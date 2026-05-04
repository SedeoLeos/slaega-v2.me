"use client";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

/**
 * Compact pagination control for admin listings.
 * - Shows "X – Y of Z" range
 * - Prev / page numbers / Next
 * - Optional page-size selector
 */
export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(total, safePage * pageSize);

  // Build a windowed page list: 1 … prev current next … last
  const pageList = buildPageList(safePage, totalPages);

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap pt-4">
      <p className="text-xs text-zinc-500">
        <span className="text-zinc-300 font-medium">{start}</span>–
        <span className="text-zinc-300 font-medium">{end}</span> sur{" "}
        <span className="text-zinc-300 font-medium">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <div className="relative mr-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none h-8 bg-zinc-900 border border-zinc-700 rounded-md pl-2.5 pr-7 text-xs text-zinc-300 outline-none focus:border-green-app cursor-pointer"
              aria-label="Items par page"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="h-8 px-2.5 rounded-md text-xs font-medium border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Préc.
        </button>

        <div className="flex items-center gap-0.5">
          {pageList.map((p, i) =>
            p === "…" ? (
              <span
                key={`gap-${i}`}
                className="text-zinc-600 text-xs px-1 select-none"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-[28px] h-8 px-2 rounded-md text-xs font-medium transition-colors ${
                  p === safePage
                    ? "bg-green-app text-white shadow-sm shadow-green-app/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                aria-current={p === safePage ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="h-8 px-2.5 rounded-md text-xs font-medium border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          Suiv.
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Compact page list with up to 7 slots:
//   1 … 4 5 6 … 10
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const list: (number | "…")[] = [1];
  if (current > 3) list.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) list.push(i);
  if (current < total - 2) list.push("…");
  list.push(total);
  return list;
}
