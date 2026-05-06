import Link from "next/link";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";
import { statRepository } from "@/features/banner/repositories/banner.repository";
import { contactSubmissionRepository } from "@/features/contact-submissions/repositories/contact-submission.repository";
import type { DashboardChartsProps } from "@/components/admin/DashboardCharts";
import DashboardCharts from "@/components/admin/DashboardChartsNoSSR";

// ── Data helpers ──────────────────────────────────────────────────────────────
function buildChartData(
  projects: Awaited<ReturnType<typeof projectRepository.getAll>>,
  messages: Awaited<ReturnType<typeof contactSubmissionRepository.getAll>>,
): DashboardChartsProps {
  // 1. Projects by category
  const catMap = new Map<string, number>();
  for (const p of projects) {
    for (const c of p.categories) {
      catMap.set(c, (catMap.get(c) ?? 0) + 1);
    }
  }
  const projectsByCategory = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category, count]) => ({ category, count }));

  // 2. Project status
  const published = projects.filter((p) => p.published).length;
  const draft = projects.length - published;
  const projectStatus = [
    { name: 'Publiés', value: published },
    { name: 'Brouillons', value: draft },
  ];

  // 3. Projects by year
  const yearMap = new Map<string, { published: number; draft: number }>();
  for (const p of projects) {
    const year = (p.date ?? '').slice(0, 4) || 'N/A';
    const entry = yearMap.get(year) ?? { published: 0, draft: 0 };
    if (p.published) entry.published += 1;
    else entry.draft += 1;
    yearMap.set(year, entry);
  }
  const projectsByYear = [...yearMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, v]) => ({ year, ...v }));

  // 4. Messages over last 6 months
  const now = new Date();
  const months: { month: string; ts: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      ts: d.getTime(),
      month: d.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }),
    });
  }
  const messagesByMonth = months.map(({ month, ts }) => {
    const end = new Date(ts);
    end.setMonth(end.getMonth() + 1);
    const count = messages.filter((m) => {
      const t = new Date(m.createdAt).getTime();
      return t >= ts && t < end.getTime();
    }).length;
    return { month, messages: count };
  });

  // 5. Top tags
  const tagMap = new Map<string, number>();
  for (const p of projects) {
    for (const tag of p.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  const topTags = [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  return { projectsByCategory, projectsByYear, messagesByMonth, projectStatus, topTags };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminDashboard() {
  const [projects, experiences, stats, unreadMessages, messages] = await Promise.all([
    projectRepository.getAll().catch(() => []),
    experienceRepository.getAll().catch(() => []),
    statRepository.getAll().catch(() => []),
    contactSubmissionRepository.countUnread().catch(() => 0),
    contactSubmissionRepository.getAll().catch(() => []),
  ]);

  const published = projects.filter((p) => p.published).length;
  const drafts = projects.length - published;
  const chartData = buildChartData(projects, messages);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Bonjour 👋</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          Gérez le contenu de votre portfolio depuis ici.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <Stat label="Projets publiés" value={published} color="green" />
        <Stat label="Brouillons" value={drafts} color="yellow" />
        <Stat label="Expériences" value={experiences.length} color="blue" />
        <Stat label="Messages non lus" value={unreadMessages} color={unreadMessages > 0 ? "green" : "zinc"} />
        <Stat label="Stats banner" value={stats.length} color="zinc" />
      </div>

      {/* Charts */}
      <div className="mb-8">
        <DashboardCharts {...chartData} />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">
          Actions rapides
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <QuickAction
            href="/admin/projects/new"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M12 4v16m8-8H4" />
              </svg>
            }
            title="Nouveau projet"
            desc="Créer et publier un projet"
            color="blue"
          />
          <QuickAction
            href="/admin/experience/new"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M12 4v16m8-8H4" />
              </svg>
            }
            title="Nouvelle expérience"
            desc="Ajouter une expérience professionnelle"
            color="green"
          />
        </div>
      </div>

      {/* Recent projects */}
      {projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Projets récents
            </h2>
            <Link href="/admin/projects" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-1.5">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p.slug}
                href={`/admin/projects/${p.slug}`}
                className="flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800/60 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.published ? "bg-green-app/90" : "bg-yellow-400"}`}
                  />
                  <span className="text-sm text-zinc-200 truncate">{p.title}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className="text-xs text-zinc-600">{p.date}</span>
                  <svg
                    className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    green: "text-green-app bg-green-app/10 border-green-app/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    zinc: "text-zinc-300 bg-zinc-800/50 border-zinc-700/50",
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color] ?? colors.zinc}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1 opacity-70">{label}</p>
    </div>
  );
}

function QuickAction({
  href, icon, title, desc, color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  const iconColors: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-400",
    green: "bg-green-app/15 text-green-app",
  };
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800/60 rounded-xl transition-colors group"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
          {title}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
      <svg
        className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors ml-auto"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
