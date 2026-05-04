import Image from 'next/image';
import Link from 'next/link';

type ProjectItemProps = {
  src: string;
  title: string;
  desc: string;
  slug: string;
  date?: string;
  categories?: string[];
};

export default function ProjectItem({ src, title, desc, slug, date, categories }: ProjectItemProps) {
  const cleanDesc = desc?.replace(/<[^>]*>/g, '') ?? '';
  const readTime = Math.max(1, Math.ceil(cleanDesc.length / 200));
  const formattedDate = date
    ? new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(
        new Date(date.includes('-') ? date : `${date}-01-01`)
      )
    : null;

  const primaryCategory = categories?.[0];

  return (
    <Link
      href={`/project/${slug}`}
      className="group flex flex-col bg-card rounded-3xl overflow-hidden border border-foreground/5 hover:border-foreground/15 hover:shadow-2xl hover:shadow-foreground/5 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Image */}
      <div className="w-full aspect-[16/10] overflow-hidden bg-foreground/5 relative">
        <Image
          src={src || '/img.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay (always slight, stronger on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

        {/* Category badge top-left */}
        {primaryCategory && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-white bg-black/40 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full">
              {primaryCategory}
            </span>
          </div>
        )}

        {/* Read More floating action — visible on hover */}
        <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-green-app flex items-center justify-center shadow-lg shadow-green-app/40 transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-6 flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 text-[11px] text-foreground/45 font-semibold uppercase tracking-widest">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDate && <span className="w-1 h-1 rounded-full bg-foreground/25" />}
          <span>{readTime} min</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold leading-tight line-clamp-2 group-hover:text-green-app transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        {cleanDesc && (
          <p className="text-sm text-foreground/55 leading-relaxed line-clamp-2">
            {cleanDesc}
          </p>
        )}

        {/* Bottom inline link */}
        <div className="flex items-center gap-1.5 mt-auto pt-2 text-sm font-bold text-foreground/70 group-hover:text-green-app group-hover:gap-2.5 transition-all duration-300">
          <span>Découvrir</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
