"use client";

import { ExpenseFilters, CATEGORIES, Category } from "@/app/types/expense";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterBarProps {
  filters: ExpenseFilters;
  onChange: (updates: Partial<ExpenseFilters>) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

export default function FilterBar({
  filters,
  onChange,
  onReset,
  resultCount,
  totalCount,
}: FilterBarProps) {
  const isFiltered =
    filters.search || filters.category !== "All" || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {isFiltered && (
          <button
            onClick={onReset}
            className="ml-auto flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as (Category | "All")[]).map((cat) => (
          <button
            key={cat}
            onClick={() => onChange({ category: cat })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filters.category === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400">
        Showing {resultCount} of {totalCount} expense{totalCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
