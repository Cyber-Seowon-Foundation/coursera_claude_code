"use client";

import { Expense, CATEGORY_ICONS } from "@/app/types/expense";
import {
  formatCurrency,
  getTotalSpending,
  getMonthlySpending,
  getTopCategory,
  getSpendingByCategory,
} from "@/app/lib/utils";
import { TrendingUp, Calendar, Tag, Receipt } from "lucide-react";

interface SummaryCardsProps {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const total = getTotalSpending(expenses);
  const monthly = getMonthlySpending(expenses);
  const topCategory = getTopCategory(expenses);
  const count = expenses.length;

  const cards = [
    {
      title: "Total Spending",
      value: formatCurrency(total),
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "This Month",
      value: formatCurrency(monthly),
      icon: Calendar,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Top Category",
      value: topCategory ? `${CATEGORY_ICONS[topCategory]} ${topCategory}` : "—",
      icon: Tag,
      color: "from-violet-500 to-violet-600",
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Entries",
      value: count.toString(),
      icon: Receipt,
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <Icon size={20} className={card.iconColor} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
}
