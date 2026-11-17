"use client";

import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

interface SearchFilterProps {
  placeholder?: string;
  pageUrl: string;
  filterOptions?: {
    label: string;
    key: string;
    options: { label: string; value: string }[];
  }[];
  sortOptions?: { label: string; value: string }[];
  showSearch?: boolean;
}

const SEARCH_DEBOUNCE_MS = 350;

export function SearchFilter({ placeholder = "Search...", pageUrl, filterOptions = [], sortOptions = [], showSearch = true }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(urlQuery);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Keep the input in sync when the URL changes from outside (back/forward, Clear).
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Every change resets to page 1 and replaces the history entry, so typing
  // doesn't flood the back button and the page doesn't jump to the top.
  const navigate = (update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pageUrl}?${qs}` : pageUrl, { scroll: false });
    });
  };

  const setParam = (key: string, value: string) =>
    navigate((params) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

  const handleSearch = (value: string) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setParam("query", value.trim()), SEARCH_DEBOUNCE_MS);
  };

  const handleFilter = (key: string, value: string) => setParam(key, value);
  const handleSort = (value: string) => setParam("sort", value);

  const clearAll = () => {
    clearTimeout(debounceRef.current);
    setQuery("");
    startTransition(() => router.replace(pageUrl, { scroll: false }));
  };

  const hasActiveFilters = urlQuery || filterOptions.some((f) => searchParams.has(f.key)) || searchParams.has("sort");

  const selectClass =
    "focus-ring h-10 cursor-pointer appearance-none rounded-full border border-slate-300 bg-white pl-4 pr-9 text-sm font-medium text-slate-700 transition hover:border-slate-400";

  return (
    <div className={showSearch ? "flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-3" : "flex justify-end"}>
      {showSearch && (
      <div className="relative min-w-0 flex-1">
        {isPending ? (
          <Loader2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        ) : (
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          className="focus-ring h-10 w-full rounded-full border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm transition focus:bg-white"
        />
      </div>
      )}

      {(filterOptions.length > 0 || sortOptions.length > 0 || hasActiveFilters) && (
        <div className={`flex flex-wrap items-center gap-2 ${showSearch ? "shrink-0" : "justify-end"}`}>
          {filterOptions.map((filter) => (
            <div key={filter.key} className="relative">
              <select
                value={searchParams.get(filter.key) || ""}
                onChange={(e) => handleFilter(filter.key, e.target.value)}
                aria-label={filter.label}
                className={selectClass}
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          ))}

          {sortOptions.length > 0 && (
            <div className="relative">
              <select
                value={searchParams.get("sort") || ""}
                onChange={(e) => handleSort(e.target.value)}
                aria-label="Sort by"
                className={selectClass}
              >
                <option value="">Sort by</option>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className={`${showSearch ? "" : "order-first "}inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-ink`}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
