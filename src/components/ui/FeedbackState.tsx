"use client";

interface FeedbackStateProps {
  variant: "success" | "error";
  title: string;
  description?: string;
  /** Primary action — usually "Send another" or "Try again" */
  action?: { label: string; onClick: () => void };
  /** Secondary action — usually "Close" or a link out */
  secondaryAction?: { label: string; onClick: () => void };
}

/**
 * Card-shaped post-submit feedback. Drop-in replacement for a form once
 * the submission resolves: shows an icon, a title, optional copy,
 * and one-or-two CTA buttons (e.g. "Envoyer un autre message" / "Réessayer").
 */
export default function FeedbackState({
  variant,
  title,
  description,
  action,
  secondaryAction,
}: FeedbackStateProps) {
  const isSuccess = variant === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex-1 max-w-xl w-full bg-card rounded-2xl border border-foreground/8 shadow-sm p-8 sm:p-10 flex flex-col items-center text-center"
    >
      {/* Icon halo */}
      <div className="relative mb-5">
        <div
          className={`absolute inset-0 -m-4 rounded-full blur-xl ${
            isSuccess ? "bg-green-app/30" : "bg-red-500/20"
          }`}
        />
        <div
          className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
            isSuccess
              ? "bg-green-app text-white shadow-lg shadow-green-app/30"
              : "bg-red-500 text-white shadow-lg shadow-red-500/30"
          }`}
        >
          {isSuccess ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-sm sm:text-base text-foreground/60 mt-3 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-7 w-full sm:w-auto">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={`inline-flex items-center justify-center gap-2 py-3 px-7 rounded-full font-semibold text-sm transition-colors w-full sm:w-auto ${
                isSuccess
                  ? "bg-foreground text-background hover:bg-foreground/85"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors px-4 py-2"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
