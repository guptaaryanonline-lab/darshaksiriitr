"use client";

import { Search, X } from "lucide-react";
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
}

export function SearchFilter({ placeholder = "Search...", pageUrl, filterOptions = [], sortOptions = [] }: SearchFilterProps) {
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

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={placeholder}
              className="focus-ring w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {(filterOptions.length > 0 || sortOptions.length > 0) && (
        <div className="flex flex-wrap gap-3 pt-2">
          {filterOptions.map((filter) => (
            <div key={filter.key}>
              <select
                value={searchParams.get(filter.key) || ""}
                onChange={(e) => handleFilter(filter.key, e.target.value)}
                className="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {sortOptions.length > 0 && (
            <div>
              <select
                value={searchParams.get("sort") || ""}
                onChange={(e) => handleSort(e.target.value)}
                className="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <option value="">Sort by</option>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
