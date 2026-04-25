import { Expense, Category, ExpenseFilters } from "@/app/types/expense";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter((expense) => {
    if (filters.category !== "All" && expense.category !== filters.category) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !expense.description.toLowerCase().includes(q) &&
        !expense.category.toLowerCase().includes(q)
      )
        return false;
    }

    if (filters.dateFrom) {
      if (expense.date < filters.dateFrom) return false;
    }

    if (filters.dateTo) {
      if (expense.date > filters.dateTo) return false;
    }

    return true;
  });
}

export function getTotalSpending(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getMonthlySpending(expenses: Expense[]): number {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return expenses
    .filter((e) => {
      try {
        return isWithinInterval(parseISO(e.date), { start, end });
      } catch {
        return false;
      }
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getSpendingByCategory(
  expenses: Expense[]
): { category: Category; amount: number; percentage: number }[] {
  const totals: Partial<Record<Category, number>> = {};
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount;
  });
  const total = getTotalSpending(expenses);
  return Object.entries(totals)
    .map(([category, amount]) => ({
      category: category as Category,
      amount: amount ?? 0,
      percentage: total > 0 ? ((amount ?? 0) / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getTopCategory(expenses: Expense[]): Category | null {
  const breakdown = getSpendingByCategory(expenses);
  return breakdown.length > 0 ? breakdown[0].category : null;
}

export interface VendorStats {
  vendor: string;
  total: number;
  count: number;
  average: number;
}

/**
 * Group expenses by vendor (using the `description` field as vendor name),
 * normalized case-insensitively and trimmed. The display name for each group
 * is the most-recently-seen original spelling (by createdAt).
 */
export function getTopVendors(expenses: Expense[]): VendorStats[] {
  const groups = new Map<
    string,
    { displayName: string; latest: string; total: number; count: number }
  >();

  for (const expense of expenses) {
    const trimmed = expense.description.trim();
    if (trimmed.length === 0) continue;
    const key = trimmed.toLowerCase();
    const existing = groups.get(key);
    if (existing) {
      existing.total += expense.amount;
      existing.count += 1;
      if (expense.createdAt > existing.latest) {
        existing.displayName = trimmed;
        existing.latest = expense.createdAt;
      }
    } else {
      groups.set(key, {
        displayName: trimmed,
        latest: expense.createdAt,
        total: expense.amount,
        count: 1,
      });
    }
  }

  return Array.from(groups.values())
    .map(({ displayName, total, count }) => ({
      vendor: displayName,
      total,
      count,
      average: count > 0 ? total / count : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getMonthlyTrend(
  expenses: Expense[]
): { month: string; amount: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    try {
      const key = format(parseISO(e.date), "yyyy-MM");
      map[key] = (map[key] ?? 0) + e.amount;
    } catch {
      // skip invalid dates
    }
  });

  // Sort chronologically (last 6 months)
  const entries = Object.entries(map)
    .map(([isoKey, amount]) => ({
      month: format(parseISO(`${isoKey}-01`), "MMM yyyy"),
      amount,
      isoKey,
    }))
    .sort((a, b) => a.isoKey.localeCompare(b.isoKey))
    .slice(-6)
    .map(({ month, amount }) => ({ month, amount }));

  return entries;
}

function escapeCSVTextCell(value: string): string {
  const sanitized = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${sanitized.replace(/"/g, '""')}"`;
}

export function exportToCSV(expenses: Expense[]): void {
  const header = ["Date", "Category", "Amount", "Description"];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    escapeCSVTextCell(e.description),
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
