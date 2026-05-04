"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ContentRendererProps {
  content: string;
  className?: string;
  /** Character threshold above which content is collapsed by default */
  collapseThreshold?: number;
}

/**
 * Smart renderer:
 * - HTML (Tiptap output)  → dangerouslySetInnerHTML + prose styles
 * - Markdown (legacy MDX) → react-markdown + GFM
 * - Long content auto-collapses with "Lire plus / Lire moins"
 */
export default function ContentRenderer({
  content,
  className = "",
  collapseThreshold = 1200,
}: ContentRendererProps) {
  const [expanded, setExpanded] = useState(false);

  const trimmed = content?.trim() ?? "";
  const isHtml = trimmed.startsWith("<");

  // Plain text length to decide if we collapse
  const plainLength = useMemo(
    () => trimmed.replace(/<[^>]*>/g, "").replace(/[#*_`>\-]/g, "").length,
    [trimmed]
  );
  const shouldCollapse = plainLength > collapseThreshold;

  // For collapsed state: pick a safe truncation (first chunks for markdown,
  // first paragraph for HTML)
  const collapsedHtml = useMemo(() => {
    if (!isHtml || !shouldCollapse) return trimmed;
    // Stop at the end of the second paragraph or at threshold characters
    const stopIdx = (() => {
      const p2 = (() => {
        let count = 0;
        let pos = 0;
        const re = /<\/p>/gi;
        let m: RegExpExecArray | null;
        while ((m = re.exec(trimmed))) {
          count += 1;
          if (count === 2) {
            pos = m.index + 4;
            return pos;
          }
        }
        return -1;
      })();
      return p2 > 0 ? p2 : Math.min(trimmed.length, collapseThreshold);
    })();
    return trimmed.slice(0, stopIdx);
  }, [trimmed, isHtml, shouldCollapse, collapseThreshold]);

  const collapsedMd = useMemo(() => {
    if (isHtml || !shouldCollapse) return trimmed;
    // Cut at first sentence boundary near threshold
    const slice = trimmed.slice(0, collapseThreshold);
    const lastBreak = Math.max(
      slice.lastIndexOf("\n\n"),
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? ")
    );
    return slice.slice(0, lastBreak > 200 ? lastBreak + 1 : slice.length);
  }, [trimmed, isHtml, shouldCollapse, collapseThreshold]);

  const proseStyle = {
    "--tw-prose-body": "#3a3a3a",
    "--tw-prose-headings": "#0E0E0E",
    "--tw-prose-links": "#05796B",
    "--tw-prose-bold": "#0E0E0E",
    "--tw-prose-counters": "#71717a",
    "--tw-prose-bullets": "#52525b",
    "--tw-prose-hr": "#d0d0c8",
    "--tw-prose-quotes": "#71717a",
    "--tw-prose-quote-borders": "rgba(5,121,107,0.3)",
    "--tw-prose-code": "#05796B",
    "--tw-prose-pre-code": "#e4e4e7",
    "--tw-prose-pre-bg": "#1E1E1E",
  } as React.CSSProperties;

  const wrapperClass = `prose prose-base max-w-none relative ${className}`;
  const collapseWrapClass = !expanded && shouldCollapse ? "max-h-[640px] overflow-hidden" : "";

  return (
    <div className={`${wrapperClass}`}>
      <div className={collapseWrapClass} style={proseStyle}>
        {isHtml ? (
          <div
            className="article-html"
            dangerouslySetInnerHTML={{
              __html: !expanded && shouldCollapse ? collapsedHtml : trimmed,
            }}
          />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {!expanded && shouldCollapse ? collapsedMd : trimmed}
          </ReactMarkdown>
        )}
      </div>

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
            {expanded ? "Lire moins" : "Lire plus"}
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
