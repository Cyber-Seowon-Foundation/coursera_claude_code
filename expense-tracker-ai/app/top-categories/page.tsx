"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { useExpenses } from "@/app/hooks/useExpenses";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  type Category,
} from "@/app/types/expense";
import {
  formatCurrency,
  getSpendingByCategory,
  getTotalSpending,
} from "@/app/lib/utils";

interface CategoryRow {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export default function TopCategoriesPage() {
  const { expenses, isLoaded } = useExpenses();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const breakdown = getSpendingByCategory(expenses);
  const total = getTotalSpending(expenses);

  // Count expenses per category
  const counts: Partial<Record<Category, number>> = {};
  for (const e of expenses) {
    counts[e.category] = (counts[e.category] ?? 0) + 1;
  }

  const rows: CategoryRow[] = breakdown.map((b) => ({
    category: b.category,
    amount: b.amount,
    percentage: b.percentage,
    count: counts[b.category] ?? 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Top Expense Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Categories ranked by total spend, highest first.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Total spend
            </p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div aria-hidden="true" className="text-5xl mb-3">📊</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              No expenses yet
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Add some expenses to see your top categories ranked here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Go to dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Category</div>
              <div className="col-span-3 text-right">Total</div>
              <div className="col-span-2 text-right">% of spend</div>
              <div className="col-span-2 text-right">Expenses</div>
            </div>

            <ul className="divide-y divide-gray-100">
              {rows.map((row, index) => {
                const rank = index + 1;
                return (
                  <li key={row.category} className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-2 sm:col-span-1">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            rank === 1
                              ? "bg-amber-100 text-amber-700"
                              : rank === 2
                                ? "bg-gray-100 text-gray-700"
                                : rank === 3
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {rank}
                        </span>
                      </div>

                      {/* Category */}
                      <div className="col-span-10 sm:col-span-4 flex items-center gap-3">
                        <span
                          aria-hidden
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: CATEGORY_COLORS[row.category],
                          }}
                        />
                        <span aria-hidden="true" className="text-base">
                          {CATEGORY_ICONS[row.category]}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {row.category}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="col-span-4 sm:col-span-3 text-right">
                        <p className="text-xs text-gray-400 sm:hidden">
                          Total
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(row.amount)}
                        </p>
                      </div>

                      {/* Percentage */}
                      <div className="col-span-4 sm:col-span-2 text-right">
                        <p className="text-xs text-gray-400 sm:hidden">
                          % of spend
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {row.percentage.toFixed(1)}%
                        </p>
                      </div>

                      {/* Count */}
                      <div className="col-span-4 sm:col-span-2 text-right">
                        <p className="text-xs text-gray-400 sm:hidden">
                          Expenses
                        </p>
                        <p className="text-sm text-gray-700">
                          {row.count}{" "}
                          <span className="text-gray-400">
                            {row.count === 1 ? "entry" : "entries"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${row.percentage}%`,
                          backgroundColor: CATEGORY_COLORS[row.category],
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
