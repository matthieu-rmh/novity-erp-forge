"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  onPage: (page: number) => void;
}

function Pagination({ page, pageCount, total, onPage }: PaginationProps) {
  if (pageCount <= 1) {
    return (
      <p className="text-xs text-brand-gray">
        {total} résultat{total > 1 ? "s" : ""}
      </p>
    );
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs text-brand-gray">{total} résultats</p>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded border border-brand-light-gray bg-white text-brand-dark-gray hover:bg-brand-offwhite disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon size={15} />
        </button>
        {pages.map((i) => (
          <button
            key={i}
            onClick={() => onPage(i)}
            className={[
              "inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold transition-colors",
              i === page
                ? "bg-brand-black text-white"
                : "border border-brand-light-gray bg-white text-brand-dark-gray hover:bg-brand-offwhite",
            ].join(" ")}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === pageCount - 1}
          onClick={() => onPage(page + 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded border border-brand-light-gray bg-white text-brand-dark-gray hover:bg-brand-offwhite disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon size={15} />
        </button>
      </div>
    </div>
  );
}

export { Pagination };
export type { PaginationProps };
