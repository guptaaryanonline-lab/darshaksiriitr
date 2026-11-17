"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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

export function SearchFilter({ placeholder = "Search...", pageUrl, filterOptions = [], sortOptions = [], showSearch = true }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set("query", value);
    else params.delete("query");
    params.set("page", "1");
    router.push(`${pageUrl}?${params.toString()}`);
  };

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pageUrl}?${params.toString()}`);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.set("page", "1");
    router.push(`${pageUrl}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pageUrl);
    setQuery("");
  };

  const hasActiveFilters = query || filterOptions.some((f) => searchParams.has(f.key)) || searchParams.has("sort");

  const selectClass =
    "focus-ring h-10 cursor-pointer appearance-none rounded-full border border-slate-300 bg-white pl-4 pr-9 text-sm font-medium text-slate-700 transition hover:border-slate-400";

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      {showSearch && (
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          className="focus-ring h-11 w-full rounded-full border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm transition focus:bg-white"
        />
      </div>
      )}

      {(filterOptions.length > 0 || sortOptions.length > 0 || hasActiveFilters) && (
        <div className="flex flex-wrap items-center gap-2">
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
              className="ml-auto inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-ink"
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
