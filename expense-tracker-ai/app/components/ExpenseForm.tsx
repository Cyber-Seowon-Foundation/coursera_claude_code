"use client";

import { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";
import { Expense, CATEGORIES, Category } from "@/app/types/expense";
import { format } from "date-fns";

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, "id" | "createdAt">) => void;
  onCancel: () => void;
  initialData?: Expense | null;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export default function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDescription(initialData.description);
    }
  }, [initialData]);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!date) errs.date = "Date is required";
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) errs.amount = "Enter a valid positive amount";
    if (parsed > 1_000_000) errs.amount = "Amount seems too large";
    if (!description.trim()) errs.description = "Description is required";
    if (description.trim().length > 200) errs.description = "Max 200 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      date,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category,
      description: description.trim(),
    });
  }

  const titleId = "expense-form-title";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 id={titleId} className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Expense" : "Add Expense"}
          </h2>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className={`w-full px-4 py-2.5 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                errors.date ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-8 pr-4 py-2.5 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.amount ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                }`}
              />
            </div>
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                    category === cat
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <input
              type="text"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className={`w-full px-4 py-2.5 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                errors.description ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
            />
            {errors.description ? (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            ) : (
              <p className="text-gray-400 text-xs mt-1 text-right">{description.length}/200</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              {initialData ? <Save size={16} /> : <Plus size={16} />}
              {initialData ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
