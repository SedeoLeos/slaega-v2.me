type Props = {
  title: string;
  tags?: string[];
  categories?: string[];
  /** true = compact layout for small cards */
  compact?: boolean;
};

/**
 * Shown when a project has no cover image.
 * Renders a schema-like placeholder built from the project's
 * categories (coloured chips) and tags (muted pills).
 * Works in both Server and Client components.
 */
export default function ProjectPlaceholder({
  title,
  tags = [],
  categories = [],
  compact = false,
}: Props) {
  const initials = title
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 75%, var(--green-app)) 100%)",
      }}
    >
      {/* Dot-grid background pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--foreground) 9%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Soft glow blob */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 160,
          height: 160,
          top: "15%",
          left: "25%",
          background: "radial-gradient(circle, var(--green-app), transparent 70%)",
          opacity: 0.12,
          filter: "blur(28px)",
        }}
      />

      {/* Initials badge */}
      <div
        className={`relative z-10 rounded-2xl bg-green-app/10 border border-green-app/25 flex items-center justify-center ${
          compact ? "w-10 h-10" : "w-14 h-14"
        }`}
      >
        <span
          className={`font-black text-green-app ${compact ? "text-[15px]" : "text-xl"}`}
        >
          {initials}
        </span>
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5 justify-center px-4">
          {categories.slice(0, compact ? 2 : 4).map((cat) => (
            <span
              key={cat}
              className="text-[8px] font-bold uppercase tracking-widest text-green-app bg-green-app/10 border border-green-app/20 px-2.5 py-[3px] rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Tech tags — only shown in full (non-compact) mode */}
      {!compact && tags.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5 justify-center px-8">
          {tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-medium text-foreground/40 bg-foreground/[0.05] border border-foreground/[0.08] px-2 py-[2px] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
