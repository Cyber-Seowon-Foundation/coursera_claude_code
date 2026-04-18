"use client";

import { useState, useCallback } from "react";
import { Download } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import SummaryCards from "@/app/components/SummaryCards";
import SpendingChart from "@/app/components/SpendingChart";
import CategoryBreakdown from "@/app/components/CategoryBreakdown";
import FilterBar from "@/app/components/FilterBar";
import ExpenseList from "@/app/components/ExpenseList";
import ExpenseForm from "@/app/components/ExpenseForm";
import Toast from "@/app/components/Toast";
import { useExpenses } from "@/app/hooks/useExpenses";
import { Expense } from "@/app/types/expense";
import { exportToCSV } from "@/app/lib/utils";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export default function Home() {
  const {
    expenses,
    filteredExpenses,
    filters,
    updateFilters,
    resetFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoaded,
  } = useExpenses();

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  function handleFormSubmit(data: Omit<Expense, "id" | "createdAt">) {
    if (editingExpense) {
      updateExpense({ ...editingExpense, ...data });
      showToast("Expense updated");
    } else {
      addExpense(data);
      showToast("Expense added");
    }
    setShowForm(false);
    setEditingExpense(null);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    deleteExpense(id);
    showToast("Expense deleted");
  }

  function handleExport() {
    if (expenses.length === 0) {
      showToast("No expenses to export", "error");
      return;
    }
    exportToCSV(filteredExpenses.length < expenses.length ? filteredExpenses : expenses);
    showToast("CSV exported");
  }

  function handleCancel() {
    setShowForm(false);
    setEditingExpense(null);
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddExpense={() => setShowForm(true)} onExport={handleExport} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Summary Cards */}
        <SummaryCards expenses={expenses} />

        {/* Export Data button */}
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Download size={15} />
            Export Data
          </button>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SpendingChart expenses={expenses} />
          </div>
          <div>
            <CategoryBreakdown expenses={expenses} />
          </div>
        </div>

        {/* Expenses Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <FilterBar
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              resultCount={filteredExpenses.length}
              totalCount={expenses.length}
            />
          </div>

          {/* Expense list */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
              <button
                onClick={() => setShowForm(true)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add new
              </button>
            </div>
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>

      {/* Form modal */}
      {showForm && (
        <ExpenseForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          initialData={editingExpense}
        />
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
