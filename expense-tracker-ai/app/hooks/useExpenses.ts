"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseFilters } from "@/app/types/expense";
import {
  loadExpenses,
  addExpense as storageAdd,
  updateExpense as storageUpdate,
  deleteExpense as storageDelete,
} from "@/app/lib/storage";
import { filterExpenses, generateId } from "@/app/lib/utils";

const DEFAULT_FILTERS: ExpenseFilters = {
  dateFrom: "",
  dateTo: "",
  category: "All",
  search: "",
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
    setIsLoaded(true);
  }, []);

  const addExpense = useCallback(
    (data: Omit<Expense, "id" | "createdAt">) => {
      const expense: Expense = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = storageAdd(expense);
      setExpenses(updated);
      return expense;
    },
    []
  );

  const updateExpense = useCallback((updated: Expense) => {
    const next = storageUpdate(updated);
    setExpenses(next);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    const next = storageDelete(id);
    setExpenses(next);
  }, []);

  const filteredExpenses = filterExpenses(expenses, filters);

  const updateFilters = useCallback((updates: Partial<ExpenseFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    expenses,
    filteredExpenses,
    filters,
    updateFilters,
    resetFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoaded,
  };
}
