"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  baseUrl: string;
  params?: Record<string, string>;
  /** Query key holding the page number (default "page"). */
  pageParam?: string;
  /** Optional anchor appended to links so the view stays on the section. */
  hash?: string;
}

export function Pagination({ page, totalPages, baseUrl, params = {}, pageParam = "page", hash }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getUrl = (p: number) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
    const qs = new URLSearchParams({ ...clean, [pageParam]: String(p) }).toString();
    return `${baseUrl}?${qs}${hash ? `#${hash}` : ""}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 border-t border-slate-200 pt-8">
      <p className="text-sm font-medium text-slate-600">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 && (
          <Link
            href={getUrl(page - 1)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 transition duration-200 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              const diff = Math.abs(p - page);
              return diff === 0 || diff === 1 || p === 1 || p === totalPages;
            })
            .map((p, i, arr) => {
              const showDots = i > 0 && arr[i - 1] !== p - 1;
              return (
                <div key={p} className="flex items-center">
                  {showDots && <span className="px-1 text-slate-400">...</span>}
                  <Link
                    href={getUrl(p)}
                    scroll={!hash}
                    aria-current={p === page ? "page" : undefined}
                    className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full font-medium transition duration-200 ${
                      p === page ? "bg-navy text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </Link>
                </div>
              );
            })}
        </div>

        {page < totalPages && (
          <Link
            href={getUrl(page + 1)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-600 transition duration-200 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
