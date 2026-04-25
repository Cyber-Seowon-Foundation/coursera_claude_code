"use client";

import { Expense, CATEGORY_COLORS, CATEGORY_ICONS } from "@/app/types/expense";
import { formatCurrency, formatDate } from "@/app/lib/utils";
import { Pencil, Trash2, Receipt } from "lucide-react";
import { useState } from "react";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

function DeleteConfirm({
  expense,
  onConfirm,
  onCancel,
}: {
  expense: Expense;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const titleId = `delete-expense-title-${expense.id}`;
  const descId = `delete-expense-desc-${expense.id}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      >
        <h3 id={titleId} className="text-lg font-semibold text-gray-900 mb-2">Delete Expense?</h3>
        <div id={descId}>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium text-gray-700">{expense.description}</span>
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {formatCurrency(expense.amount)} · {formatDate(expense.date)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [confirmDelete, setConfirmDelete] = useState<Expense | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
        <Receipt size={40} className="mx-auto mb-3 text-gray-200" />
        <p className="text-gray-500 font-medium">No expenses found</p>
        <p className="text-gray-400 text-sm mt-1">Add your first expense or adjust filters</p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, Expense[]> = {};
  expenses.forEach((e) => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      {confirmDelete && (
        <DeleteConfirm
          expense={confirmDelete}
          onConfirm={() => {
            onDelete(confirmDelete.id);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="space-y-4">
        {sortedDates.map((date) => {
          const dayTotal = grouped[date].reduce((sum, e) => sum + e.amount, 0);
          return (
            <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-600">{formatDate(date)}</span>
                <span className="text-sm font-semibold text-gray-700">{formatCurrency(dayTotal)}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {grouped[date].map((expense) => {
                  const color = CATEGORY_COLORS[expense.category];
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors group"
                    >
                      {/* Category badge */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        {CATEGORY_ICONS[expense.category]}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {expense.description}
                        </p>
                        <span
                          className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
                          style={{
                            backgroundColor: `${color}18`,
                            color: color,
                          }}
                        >
                          {expense.category}
                        </span>
                      </div>

                      {/* Amount */}
                      <span className="text-base font-bold text-gray-900 flex-shrink-0">
                        {formatCurrency(expense.amount)}
                      </span>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(expense)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
