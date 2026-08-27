/**
 * AI provider abstraction — switch between Claude (Anthropic), OpenAI, and
 * any free OpenAI-compatible endpoint (Groq, OpenRouter, Ollama, …) by env.
 *
 * Pick provider via env:
 *   AI_PROVIDER=anthropic                 → Claude (default if ANTHROPIC_API_KEY set)
 *   AI_PROVIDER=openai                    → OpenAI GPT-4 / GPT-4o / GPT-3.5
 *   AI_PROVIDER=groq                      → Groq (free tier, Llama 3, Mixtral)
 *   AI_PROVIDER=openrouter                → OpenRouter (many models, free tier)
 *   AI_PROVIDER=ollama                    → Local Ollama
 *   AI_PROVIDER=mock                      → Deterministic stub (no API call)
 *
 * Env per provider:
 *   ANTHROPIC_API_KEY, ANTHROPIC_MODEL (default: claude-sonnet-4-5)
 *   OPENAI_API_KEY,    OPENAI_MODEL    (default: gpt-4o-mini)
 *   GROQ_API_KEY,      GROQ_MODEL      (default: llama-3.3-70b-versatile)
 *   OPENROUTER_API_KEY, OPENROUTER_MODEL (default: meta-llama/llama-3.1-8b-instruct:free)
 *   OLLAMA_BASE_URL (default: http://localhost:11434), OLLAMA_MODEL (default: llama3.2)
 */

export type AiProvider =
  | "anthropic"
  | "openai"
  | "groq"
  | "openrouter"
  | "ollama"
  | "mock";

export type AiMessage = { role: "user" | "assistant"; content: string };

export type AiGenerateOptions = {
  system?: string;
  messages: AiMessage[];
  /** Force JSON output (the model is instructed to return only JSON). */
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
};

export type AiResult = {
  text: string;
  provider: AiProvider;
  model: string;
};

function pickProvider(): AiProvider {
  const env = (process.env.AI_PROVIDER ?? "").toLowerCase().trim();
  if (
    env === "anthropic" ||
    env === "openai" ||
    env === "groq" ||
    env === "openrouter" ||
    env === "ollama" ||
    env === "mock"
  ) {
    return env;
  }
  // Auto-detect: prefer Anthropic, then OpenAI, then Groq, then mock
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  return "mock";
}

// ─────────────────────────────────────────────────────────────────────
// Adapters
// ─────────────────────────────────────────────────────────────────────

async function callAnthropic(opts: AiGenerateOptions): Promise<AiResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("[ai] ANTHROPIC_API_KEY not set");
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: opts.maxTokens ?? 4096,
      temperature: opts.temperature ?? 0.4,
      system: opts.system,
      messages: opts.messages,
    }),
  });
  if (!res.ok) {
    throw new Error(`[ai/anthropic] ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const text =
    data?.content?.map((c: { text?: string }) => c.text ?? "").join("") ?? "";
  return { text, provider: "anthropic", model };
}

async function callOpenAICompat(opts: {
  baseURL: string;
  apiKey: string;
  model: string;
  provider: AiProvider;
  generate: AiGenerateOptions;
  defaultHeaders?: Record<string, string>;
}): Promise<AiResult> {
  const messages: { role: string; content: string }[] = [];
  if (opts.generate.system) {
    messages.push({ role: "system", content: opts.generate.system });
  }
  for (const m of opts.generate.messages) messages.push(m);

  const body: Record<string, unknown> = {
    model: opts.model,
    messages,
    max_tokens: opts.generate.maxTokens ?? 4096,
    temperature: opts.generate.temperature ?? 0.4,
  };
  if (opts.generate.json) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${opts.baseURL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${opts.apiKey}`,
      "content-type": "application/json",
      ...(opts.defaultHeaders ?? {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`[ai/${opts.provider}] ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text, provider: opts.provider, model: opts.model };
}

async function callOpenAI(opts: AiGenerateOptions): Promise<AiResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("[ai] OPENAI_API_KEY not set");
  return callOpenAICompat({
    baseURL: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    apiKey,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    provider: "openai",
    generate: opts,
  });
}

// Groq decommissions model ids regularly (e.g. llama-3.3-70b-versatile →
// 404 model_not_found). To stay working without redeploys, we ask Groq which
// models the key can actually use and pick the best one by preference. An
// explicit GROQ_MODEL always wins; the resolved id is cached per process.
const GROQ_MODEL_PREFERENCE = [
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
  "moonshotai/kimi-k2-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "qwen/qwen3-32b",
  "deepseek-r1-distill-llama-70b",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];
let cachedGroqModel: string | null = null;

async function resolveGroqModel(apiKey: string): Promise<string> {
  const explicit = process.env.GROQ_MODEL?.trim();
  if (explicit) return explicit;
  if (cachedGroqModel) return cachedGroqModel;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      const data = await res.json();
      const available = new Set<string>(
        (data?.data ?? []).map((m: { id?: string }) => m.id).filter(Boolean),
      );
      const pick =
        GROQ_MODEL_PREFERENCE.find((m) => available.has(m)) ??
        [...available].find((id) => /llama|gpt-oss|qwen|kimi|gemma|mixtral/i.test(id));
      if (pick) {
        cachedGroqModel = pick;
        return pick;
      }
    }
  } catch {
    /* fall through to a sane default */
  }
  return GROQ_MODEL_PREFERENCE[0];
}

async function callGroq(opts: AiGenerateOptions): Promise<AiResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("[ai] GROQ_API_KEY not set");
  const model = await resolveGroqModel(apiKey);
  const base = { baseURL: "https://api.groq.com/openai/v1", apiKey, provider: "groq" as const, generate: opts };
  try {
    return await callOpenAICompat({ ...base, model });
  } catch (e) {
    // Free Groq tiers cap tokens-per-minute per model. On a "too large / rate
    // limit" (413) error, retry once on the highest-TPM small model so the CV
    // still gets AI-tailored instead of silently falling back to the heuristic.
    const msg = String((e as Error)?.message ?? "");
    const HIGH_TPM = "llama-3.1-8b-instant";
    if (/\b413\b|rate_limit|too large|reduce your message/i.test(msg) && model !== HIGH_TPM) {
      cachedGroqModel = HIGH_TPM;
      return await callOpenAICompat({ ...base, model: HIGH_TPM });
    }
    throw e;
  }
}

async function callOpenRouter(opts: AiGenerateOptions): Promise<AiResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("[ai] OPENROUTER_API_KEY not set");
  return callOpenAICompat({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    model: process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct:free",
    provider: "openrouter",
    generate: opts,
    defaultHeaders: {
      "http-referer": process.env.OPENROUTER_REFERER ?? "https://slaega.me",
      "x-title": "Slaega Portfolio",
    },
  });
}

async function callOllama(opts: AiGenerateOptions): Promise<AiResult> {
  const baseURL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2";
  const messages: { role: string; content: string }[] = [];
  if (opts.system) messages.push({ role: "system", content: opts.system });
  for (const m of opts.messages) messages.push(m);
  const res = await fetch(`${baseURL.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: { temperature: opts.temperature ?? 0.4 },
      format: opts.json ? "json" : undefined,
    }),
  });
  if (!res.ok) {
    throw new Error(`[ai/ollama] ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const text = data?.message?.content ?? "";
  return { text, provider: "ollama", model };
}

function callMock(opts: AiGenerateOptions): AiResult {
  // Deterministic stub returning empty JSON / plain text — used when no key is set.
  const text = opts.json
    ? '{"summary": "Stub IA — configure ANTHROPIC_API_KEY / OPENAI_API_KEY / GROQ_API_KEY pour activer.", "experiences": [], "projects": []}'
    : "Stub IA — aucun fournisseur configuré. Définis AI_PROVIDER + clé API correspondante.";
  return { text, provider: "mock", model: "mock" };
}

// ─────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────

export async function aiGenerate(opts: AiGenerateOptions): Promise<AiResult> {
  const provider = pickProvider();
  switch (provider) {
    case "anthropic":
      return callAnthropic(opts);
    case "openai":
      return callOpenAI(opts);
    case "groq":
      return callGroq(opts);
    case "openrouter":
      return callOpenRouter(opts);
    case "ollama":
      return callOllama(opts);
    case "mock":
    default:
      return callMock(opts);
  }
}

export function getActiveAiProvider(): AiProvider {
  return pickProvider();
}
