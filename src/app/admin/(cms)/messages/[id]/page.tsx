import Link from "next/link";
import { notFound } from "next/navigation";
import { contactSubmissionRepository } from "@/features/contact-submissions/repositories/contact-submission.repository";
import MessageDetailActions from "@/components/admin/MessageDetailActions";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const FIELD_LABELS: Record<string, string> = {
  name: "Nom",
  email: "Email",
  subject: "Sujet",
  message: "Message",
  phone: "Téléphone",
};

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await contactSubmissionRepository.getById(id);
  if (!submission) notFound();

  // Mark as read on visit (server-side, fire-and-forget — can't await in render
  // but we can call before returning to ensure it persists this request).
  if (!submission.read) {
    await contactSubmissionRepository.update(id, { read: true }).catch(() => null);
  }

  // Common fields surface explicitly, then any other in the payload
  const knownKeys = new Set(["name", "email", "subject", "message"]);
  const otherFields = Object.entries(submission.data).filter(([k]) => !knownKeys.has(k));

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium mb-4">
        <Link
          href="/admin/messages"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Messages
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-500 truncate">
          {submission.subject || submission.name || "Détail"}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-6 pb-5 border-b border-zinc-800/60">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {submission.subject || submission.name || "Message"}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              <span className="text-zinc-300 font-medium">{submission.name || "—"}</span>
              {submission.email && (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-green-app hover:underline"
                  >
                    {submission.email}
                  </a>
                </>
              )}
            </p>
            <p className="text-xs text-zinc-600 mt-1.5">{formatDateTime(submission.createdAt)}</p>
          </div>

          <MessageDetailActions
            id={submission.id}
            archived={submission.archived}
            email={submission.email}
            subject={submission.subject || submission.name}
          />
        </div>
      </div>

      {/* Content — centered, wider */}
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Message body */}
        {submission.data.message && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Message
            </p>
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {submission.data.message}
              </p>
            </div>
          </div>
        )}

        {/* Other fields */}
        {otherFields.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Autres informations
            </p>
            <dl className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 grid sm:grid-cols-2 gap-4">
              {otherFields.map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                    {FIELD_LABELS[k] ?? k}
                  </dt>
                  <dd className="text-sm text-zinc-200 break-words">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Metadata */}
        {(submission.ip || submission.userAgent) && (
          <details className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
            <summary className="text-xs font-medium text-zinc-500 cursor-pointer hover:text-zinc-300">
              Métadonnées techniques
            </summary>
            <div className="mt-3 space-y-1.5 text-xs text-zinc-500 font-mono">
              {submission.ip && (
                <p>
                  <span className="text-zinc-600">IP :</span> {submission.ip}
                </p>
              )}
              {submission.userAgent && (
                <p className="break-all">
                  <span className="text-zinc-600">User-Agent :</span> {submission.userAgent}
                </p>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
