import { Expense } from "@/app/types/expense";

const STORAGE_KEY = "expense_tracker_expenses";

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function addExpense(expense: Expense): Expense[] {
  const current = loadExpenses();
  const updated = [expense, ...current];
  saveExpenses(updated);
  return updated;
}

export function updateExpense(updated: Expense): Expense[] {
  const current = loadExpenses();
  const next = current.map((e) => (e.id === updated.id ? updated : e));
  saveExpenses(next);
  return next;
}

export function deleteExpense(id: string): Expense[] {
  const current = loadExpenses();
  const next = current.filter((e) => e.id !== id);
  saveExpenses(next);
  return next;
}
