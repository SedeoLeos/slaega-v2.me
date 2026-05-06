import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import IllustrationBody from "@/components/Illustration/IllustrationBody";
import IllustrationProject from "@/components/Illustration/IllustrationProject";
import ProjectItem from "@/components/Projects/ProjectItem";
import ContentRenderer from "@/components/Content/ContentRenderer";
import { getAllProjects, getPost } from "@/libs/posts";
import Image from "next/image";

export const dynamic = "force-dynamic";

function formatDate(d: string, months: string[]): string {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length >= 2) {
    const m = parseInt(parts[1]);
    const y = parts[0];
    if (!isNaN(m) && m >= 1 && m <= 12) return `${months[m - 1]} ${y}`;
  }
  return d;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPost(slug);
  if (!project) notFound();

  const t = await getTranslations();
  const months = t.raw("common.monthsShort") as string[];

  const { content, meta } = project;

  const data = await getAllProjects();
  const currentIndex = data.findIndex((item) => item.slug === slug);

  const similarProjects = data
    .filter((item) => item.slug !== slug)
    .filter(
      (item) =>
        item.categories.some((it) => meta.categories.includes(it)) ||
        item.tags.some((it) => meta.tags.includes(it)),
    );

  const sortByProximity = (projects: typeof similarProjects) =>
    projects
      .map((p) => {
        const idx = data.findIndex((x) => x.slug === p.slug);
        const distance = Math.min(
          Math.abs(idx - currentIndex),
          data.length - Math.abs(idx - currentIndex),
        );
        return { p, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.p);

  const posts = sortByProximity(similarProjects);

  // Plain text length for read-time hint
  const plain = content.replace(/<[^>]*>/g, "").replace(/[#*_`>\-]/g, "");
  const readMin = Math.max(1, Math.ceil(plain.length / 1100));

  return (
    /* Outer wrapper: full viewport width, positioning context for illustrations */
    <div className="relative w-full overflow-x-hidden">
      {/* Decorative illustrations — live here, outside the max-w article,
          so they can bleed to the edge of the screen */}
      <div className="absolute left-0 top-0 opacity-15 lg:opacity-50 pointer-events-none">
        <IllustrationProject />
      </div>
      <div className="absolute top-1/2 right-0 opacity-15 lg:opacity-50 pointer-events-none">
        <IllustrationBody />
      </div>

    <article className="relative w-full mx-auto max-w-content min-h-screen">
      {/* ═════════════════════════════════════════════════════════
          1. BREADCRUMB
          ═════════════════════════════════════════════════════════ */}
      <nav className="w-full max-w-5xl mx-auto px-6 lg:px-0 pt-12 lg:pt-20 mb-10 flex items-center gap-2 text-xs font-medium relative z-[2]">
        <Link
          href="/project"
          className="inline-flex items-center gap-1.5 text-foreground/50 hover:text-foreground transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("projectPage.breadcrumbAll")}
        </Link>
      </nav>

      {/* ═════════════════════════════════════════════════════════
          2. HERO — categories + title + meta + cover image
          ═════════════════════════════════════════════════════════ */}
      <header className="w-full max-w-5xl mx-auto px-6 lg:px-0 flex flex-col items-center text-center gap-6 mb-14 relative z-[2]">
        {meta.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {meta.categories.map((c) => (
              <span
                key={c}
                className="text-[10px] font-bold uppercase tracking-widest text-green-app bg-green-app/10 border border-green-app/25 px-3 py-1.5 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
          {meta.title}
        </h1>

        <div className="flex items-center gap-3 text-xs font-medium text-foreground/50">
          {meta.date && <span>{formatDate(meta.date, months)}</span>}
          {meta.date && (
            <span className="w-1 h-1 rounded-full bg-foreground/30" />
          )}
          <span>{t("projects.minRead", { count: readMin })}</span>
        </div>

        {/* Project URL + GitHub URL CTAs */}
        {(meta.projectUrl || meta.githubUrl) && (
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {meta.projectUrl && (
              <a
                href={meta.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground/85 transition-all"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {t("projectPage.viewLive")}
              </a>
            )}
            {meta.githubUrl && (
              <a
                href={meta.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:border-foreground/50 hover:bg-foreground/5 transition-all"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        )}
      </header>

      {/* Cover image — full container width, lifted off the page */}
      <div className="w-full max-w-5xl mx-auto px-6 lg:px-0 mb-20 relative z-[2]">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-foreground/10 border border-foreground/5 bg-card">
          <Image
            width={1600}
            height={900}
            src={meta.image || "/img.jpg"}
            alt={meta.title}
            className="w-full h-auto min-h-[520px]"
            priority
          />
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          3. BODY — markdown / rich content
          ═════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-5xl mx-auto px-6 lg:px-0 mb-20 relative z-[2]">
        <ContentRenderer content={content} collapseThreshold={3000} />
      </div>

      {/* ═════════════════════════════════════════════════════════
          4. TAGS — stack used in the project
          ═════════════════════════════════════════════════════════ */}
      {meta.tags.length > 0 && (
        <div className="w-full max-w-5xl mx-auto px-6 lg:px-0 mb-24 relative z-[2]">
          <SectionDivider />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-app mb-1">
                {t("projectPage.techLabel")}
              </p>
              <h2 className="text-2xl font-extrabold">
                {t("projectPage.techTitle")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-[60%]">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-foreground/80 bg-foreground/5 border border-foreground/10 px-3 py-1.5 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          5. SIMILAR PROJECTS
          ═════════════════════════════════════════════════════════ */}
      {posts.length > 0 && (
        <section className="w-full max-w-content-blog mx-auto px-6 lg:px-0 pb-24 relative z-[2]">
          <SectionDivider />
          <div className="text-center mt-10 mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-app mb-2">
              {t("projectPage.similarLabel")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {t("projectPage.similarTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {posts.slice(0, 3).map((item) => (
              <ProjectItem
                key={item.slug}
                src={item.image}
                title={item.title}
                slug={item.slug}
                desc={item.desc}
                date={item.date}
                categories={item.categories}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/project"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/20 text-sm font-semibold text-foreground hover:border-foreground/50 hover:bg-foreground/5 transition-all"
            >
              {t("projectPage.viewAll")}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.53 2.22L9 1.69 7.94 2.75l.53.53 3.97 3.97H1.75H1V8.75h.75h10.69L8.47 12.72l-.53.53L9 14.31l.53-.53 5.07-5.07a1 1 0 000-1.41L9.53 2.22z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </article>
    </div>
  );
}

// Elegant gradient divider — fades out at the edges
function SectionDivider() {
  return (
    <div
      className="w-full h-px"
      style={{
        background:
          "linear-gradient(to right, transparent 0%, rgba(14,14,14,0.18) 30%, rgba(14,14,14,0.18) 70%, transparent 100%)",
      }}
    />
  );
}
