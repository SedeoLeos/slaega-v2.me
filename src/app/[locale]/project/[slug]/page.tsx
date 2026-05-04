import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import IllustrationBody from "@/components/Illustration/IllustrationBody";
import IllustrationProject from "@/components/Illustration/IllustrationProject";
import ProjectItem from "@/components/Projects/ProjectItem";
import ContentRenderer from "@/components/Content/ContentRenderer";
import { getAllProjects, getPost, getPostPath } from "@/libs/posts";
import Image from "next/image";

export async function generateStaticParams() {
  return getPostPath();
}
export const dynamicParams = true;

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
    <article className="relative w-full mx-auto max-w-content min-h-screen overflow-x-hidden">
      {/* Decorative illustrations */}
      <div className="absolute lg:left-0 -left-3/5 top-0 opacity-15 lg:opacity-50 pointer-events-none -z-10">
        <IllustrationProject />
      </div>
      <div className="absolute top-1/2 -right-3/5 opacity-15 lg:opacity-50 lg:right-0 pointer-events-none -z-10">
        <IllustrationBody />
      </div>

      {/* ═════════════════════════════════════════════════════════
          1. BREADCRUMB
          ═════════════════════════════════════════════════════════ */}
      <nav className="w-full max-w-3xl mx-auto px-6 lg:px-0 pt-12 lg:pt-20 mb-10 flex items-center gap-2 text-xs font-medium relative z-[2]">
        <Link
          href="/project"
          className="inline-flex items-center gap-1.5 text-foreground/50 hover:text-foreground transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("projectPage.breadcrumbAll")}
        </Link>
      </nav>

      {/* ═════════════════════════════════════════════════════════
          2. HERO — categories + title + meta + cover image
          ═════════════════════════════════════════════════════════ */}
      <header className="w-full max-w-3xl mx-auto px-6 lg:px-0 flex flex-col items-center text-center gap-6 mb-14 relative z-[2]">
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

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-3xl">
          {meta.title}
        </h1>

        <div className="flex items-center gap-3 text-xs font-medium text-foreground/50">
          {meta.date && <span>{formatDate(meta.date, months)}</span>}
          {meta.date && <span className="w-1 h-1 rounded-full bg-foreground/30" />}
          <span>{t("projects.minRead", { count: readMin })}</span>
        </div>
      </header>

      {/* Cover image — full container width, lifted off the page */}
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-0 mb-20 relative z-[2]">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-foreground/10 border border-foreground/5 bg-card">
          <Image
            width={1600}
            height={900}
            src={meta.image || "/img.jpg"}
            alt={meta.title}
            className="w-full aspect-[16/9] object-cover"
            priority
          />
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          3. BODY — markdown / rich content
          ═════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-3xl mx-auto px-6 lg:px-0 mb-20 relative z-[2]">
        <ContentRenderer content={content} collapseThreshold={3000} />
      </div>

      {/* ═════════════════════════════════════════════════════════
          4. TAGS — stack used in the project
          ═════════════════════════════════════════════════════════ */}
      {meta.tags.length > 0 && (
        <div className="w-full max-w-3xl mx-auto px-6 lg:px-0 mb-24 relative z-[2]">
          <SectionDivider />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-app mb-1">
                {t("projectPage.techLabel")}
              </p>
              <h2 className="text-2xl font-extrabold">{t("projectPage.techTitle")}</h2>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-[60%]">
              {meta.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium text-foreground/80 bg-foreground/5 border border-foreground/10 px-3 py-1.5 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  {t}
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
