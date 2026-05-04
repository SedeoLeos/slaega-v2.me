import Image from 'next/image';
import Link from 'next/link';

type ProjectItemProps = {
  src: string;
  title: string;
  desc: string;
  slug: string;
  date?: string;
};

export default function ProjectItem({ src, title, desc, slug, date }: ProjectItemProps) {
  const readTime = Math.max(1, Math.ceil((desc?.replace(/<[^>]*>/g, '').length ?? 0) / 200));
  const formattedDate = date
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
        new Date(date.includes('-') ? date : `${date}-01-01`)
      )
    : null;

  return (
    <Link
      href={`/project/${slug}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="w-full aspect-[16/9] overflow-hidden bg-foreground/5 relative">
        <Image
          src={src || '/img.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-foreground/40 font-medium uppercase tracking-wide">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDate && <span>·</span>}
          <span>{readTime} min read</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold leading-snug line-clamp-2 flex-1">{title}</h3>

        {/* Read more */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm font-semibold text-foreground/60 group-hover:text-foreground transition-colors">
            Read More
          </span>
          <div className="w-8 h-8 rounded-full bg-green-app flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1.5">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
