import { contactSubmissionRepository } from "@/features/contact-submissions/repositories/contact-submission.repository";
import MessagesList from "@/components/admin/MessagesList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages — Admin" };

export default async function AdminMessagesPage() {
  const [inbox, archived] = await Promise.all([
    contactSubmissionRepository.getInbox().catch(() => []),
    contactSubmissionRepository.getArchived().catch(() => []),
  ]);

  const unread = inbox.filter((m) => !m.read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Messages reçus</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          {inbox.length} dans la boîte de réception
          {unread > 0 && (
            <span className="ml-2 inline-flex items-center text-xs bg-green-app/15 text-green-app border border-green-app/25 px-2 py-0.5 rounded-full font-medium">
              {unread} non lu{unread > 1 ? "s" : ""}
            </span>
          )}
          {archived.length > 0 && (
            <span className="text-zinc-600 ml-3">· {archived.length} archivé{archived.length > 1 ? "s" : ""}</span>
          )}
        </p>
      </div>

      <MessagesList inbox={inbox} archived={archived} />
    </div>
  );
}
