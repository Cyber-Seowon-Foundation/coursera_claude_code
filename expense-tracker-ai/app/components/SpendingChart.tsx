"use client";

import { Expense, CATEGORY_COLORS, Category } from "@/app/types/expense";
import { getSpendingByCategory, getMonthlyTrend, formatCurrency } from "@/app/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState } from "react";
import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

interface SpendingChartProps {
  expenses: Expense[];
}

function CustomTooltipBar({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

function CustomTooltipPie({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-700">{payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].payload.fill }}>
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-xs text-gray-500">{payload[0].payload.percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
}

export default function SpendingChart({ expenses }: SpendingChartProps) {
  const [view, setView] = useState<"bar" | "pie">("bar");

  const categoryData = getSpendingByCategory(expenses).map((item) => ({
    ...item,
    fill: CATEGORY_COLORS[item.category],
  }));

  const trendData = getMonthlyTrend(expenses);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Overview</h3>
        <div className="h-48 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <BarChart2 size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Add expenses to see charts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Spending Overview</h3>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView("bar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "bar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart2 size={14} />
            Trend
          </button>
          <button
            onClick={() => setView("pie")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              view === "pie"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <PieChartIcon size={14} />
            By Category
          </button>
        </div>
      </div>

      {view === "bar" ? (
        trendData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            Not enough data for trend chart
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trendData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltipBar />} />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="amount"
              nameKey="category"
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipPie />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
