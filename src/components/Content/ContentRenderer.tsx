"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ContentRendererProps {
  content: string;
  className?: string;
  /** Character threshold above which content is collapsed by default */
  collapseThreshold?: number;
}

// ── Content normalizer ────────────────────────────────────────────────────────
/**
 * Detects "Markdown pasted into Tiptap" — raw Markdown text wrapped inside
 * plain <p> tags with no real HTML formatting elements inside.
 *
 * Example of bad content: "<p>## Title</p><p>**bold** text</p>"
 * → strips HTML wrappers so react-markdown can process the inner Markdown.
 *
 * Proper Tiptap HTML (has <strong>, <h2>, <ul>, etc.) is left untouched.
 */
function normalizeContent(raw: string): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return trimmed;

  // If content has real HTML formatting elements → it's proper Tiptap HTML, keep as-is
  const hasRealHtml = /<(strong|b|em|i|h[1-6]|ul|ol|li|blockquote|pre|code|a[\s>]|table)\b/i
    .test(trimmed);
  if (hasRealHtml) return trimmed;

  // If content starts with HTML tags but contains Markdown patterns inside →
  // it's Markdown that Tiptap wrapped in <p> tags. Strip the wrappers.
  const isHtmlWrapped = /^<[a-z]/i.test(trimmed);
  const hasMarkdown = [
    /^#{1,6}\s+\S/m,      // ## heading
    /\*\*[^*\n]+\*\*/,    // **bold**
    /\*[^*\n]+\*/,        // *italic*
    /^\s*[-*+]\s+\S/m,    // - list
    /^\s*\d+\.\s+\S/m,    // 1. ordered
    /`[^`\n]+`/,          // `code`
    /^```/m,              // code block
    /^\s*>/m,             // > blockquote
    /\[.+?\]\(.+?\)/,     // [link](url)
  ].some((p) => p.test(trimmed));

  if (isHtmlWrapped && hasMarkdown) {
    // Strip HTML wrappers while preserving newlines for Markdown structure
    return trimmed
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/blockquote>/gi, "\n\n")
      .replace(/<\/pre>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")         // strip all remaining tags
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, "\n\n")      // collapse triple+ newlines
      .trim();
  }

  return trimmed;
}

/**
 * Universal content renderer.
 *
 * Handles ALL of:
 *   • pure Markdown
 *   • proper HTML from Tiptap (strong, em, h2, ul, etc.)
 *   • "broken" content: Markdown text wrapped in bare <p> tags by Tiptap
 *     when the user pasted raw Markdown before the smart-paste fix
 *
 * Long content auto-collapses with a "Lire plus / Lire moins" toggle.
 */
export default function ContentRenderer({
  content,
  className = "",
  collapseThreshold = 1200,
}: ContentRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("common");

  const trimmed = useMemo(() => normalizeContent(content), [content]);

  // Plain text length to decide if we collapse
  const plainLength = useMemo(
    () => trimmed.replace(/<[^>]*>/g, "").replace(/[#*_`>\-]/g, "").length,
    [trimmed]
  );
  const shouldCollapse = plainLength > collapseThreshold;

  const collapsedContent = useMemo(() => {
    if (!shouldCollapse) return trimmed;
    const slice = trimmed.slice(0, collapseThreshold);
    const lastBreak = Math.max(
      slice.lastIndexOf("\n\n"),
      slice.lastIndexOf(". "),
      slice.lastIndexOf("!"),
      slice.lastIndexOf("?"),
      slice.lastIndexOf("</p>"),
      slice.lastIndexOf("</li>")
    );
    return slice.slice(0, lastBreak > 200 ? lastBreak + 1 : slice.length);
  }, [trimmed, shouldCollapse, collapseThreshold]);

  const rendered = !expanded && shouldCollapse ? collapsedContent : trimmed;

  return (
    <div className={`relative ${className}`}>
      <article
        className={`prose prose-base max-w-none article-content ${
          !expanded && shouldCollapse ? "max-h-[640px] overflow-hidden" : ""
        }`}
        style={
          {
            "--tw-prose-body": "#3a3a3a",
            "--tw-prose-headings": "#0e0e0e",
            "--tw-prose-links": "#05796b",
            "--tw-prose-bold": "#0e0e0e",
            "--tw-prose-counters": "#71717a",
            "--tw-prose-bullets": "#52525b",
            "--tw-prose-hr": "#d0d0c8",
            "--tw-prose-quotes": "#71717a",
            "--tw-prose-quote-borders": "rgba(5,121,107,0.3)",
            "--tw-prose-code": "#05796b",
            "--tw-prose-pre-code": "#e4e4e7",
            "--tw-prose-pre-bg": "#1e1e1e",
          } as React.CSSProperties
        }
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          // Handle empty paragraphs from Tiptap gracefully
          components={{
            // Trim empty paragraphs that Tiptap sometimes emits
            p: ({ children, ...props }) => {
              const content = Array.isArray(children) ? children : [children];
              const isEmpty = content.every(
                (c) => typeof c === "string" && c.trim() === ""
              );
              if (isEmpty) return null;
              return <p {...props}>{children}</p>;
            },
          }}
        >
          {rendered}
        </ReactMarkdown>
      </article>

      {/* Fade-out when collapsed */}
      {shouldCollapse && !expanded && (
        <div
          className="absolute bottom-12 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(220,222,208,0) 0%, rgba(220,222,208,0.85) 60%, #DCDED0 100%)",
          }}
        />
      )}

      {/* Toggle */}
      {shouldCollapse && (
        <div className="flex justify-center mt-6 not-prose">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-bold hover:bg-foreground/85 transition-all hover:gap-3"
            aria-expanded={expanded}
          >
            {expanded ? t("readLess") : t("readMore")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
