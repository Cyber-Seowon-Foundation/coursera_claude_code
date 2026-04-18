"use client";

import { Expense, CATEGORY_COLORS, CATEGORY_ICONS, Category } from "@/app/types/expense";
import { getSpendingByCategory, formatCurrency } from "@/app/lib/utils";

interface CategoryBreakdownProps {
  expenses: Expense[];
}

export default function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  const breakdown = getSpendingByCategory(expenses);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">By Category</h3>
      {breakdown.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
      ) : (
        <div className="space-y-3">
          {breakdown.map(({ category, amount, percentage }) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{CATEGORY_ICONS[category]}</span>
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{percentage.toFixed(1)}%</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: CATEGORY_COLORS[category],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
