"use client";

/**
 * Smart content renderer:
 * - HTML (from Tiptap): rendered with dangerouslySetInnerHTML + prose styles
 * - Markdown (legacy, from MDX seed): shown in a simple styled block
 */
interface ContentRendererProps {
  content: string;
  className?: string;
}

export default function ContentRenderer({ content, className = "" }: ContentRendererProps) {
  const isHtml = content.trimStart().startsWith("<");

  if (isHtml) {
    return (
      <div
        className={`prose prose-invert prose-base max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          "--tw-prose-body": "#a1a1aa",
          "--tw-prose-headings": "#f4f4f5",
          "--tw-prose-links": "#4ade80",
          "--tw-prose-bold": "#f4f4f5",
          "--tw-prose-counters": "#71717a",
          "--tw-prose-bullets": "#52525b",
          "--tw-prose-hr": "#3f3f46",
          "--tw-prose-quotes": "#71717a",
          "--tw-prose-quote-borders": "#3f3f46",
          "--tw-prose-code": "#4ade80",
          "--tw-prose-pre-code": "#e4e4e7",
          "--tw-prose-pre-bg": "#18181b",
        } as React.CSSProperties}
      />
    );
  }

  // Legacy markdown: render as raw text in a styled pre-like block
  return (
    <div className={`prose prose-invert prose-sm max-w-none whitespace-pre-wrap ${className}`}>
      {content}
    </div>
  );
}
