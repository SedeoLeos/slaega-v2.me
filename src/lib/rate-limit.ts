/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Works perfectly for a single-server (VPS / Node.js) deployment.
 * For serverless / multi-instance (Vercel Edge, Cloudflare Workers),
 * replace the Map with an Upstash Redis or Cloudflare KV backend.
 */

interface Entry {
  count: number;
  /** Unix ms — when this window expires */
  resetAt: number;
}

const store = new Map<string, Entry>();

/** Clean up expired entries every 5 minutes to avoid unbounded growth. */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60_000).unref?.(); // .unref() so the timer doesn't prevent process exit

export interface RateLimitResult {
  /** true → request allowed */
  ok: boolean;
  /** remaining requests in the current window */
  remaining: number;
  /** Unix ms — when the window resets */
  resetAt: number;
}

/**
 * @param key      Unique identifier — typically `"route:IP"`
 * @param limit    Max allowed requests per window
 * @param windowMs Window size in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { ok: true, remaining: limit - 1, resetAt: entry.resetAt };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return { ok: entry.count <= limit, remaining, resetAt: entry.resetAt };
}
