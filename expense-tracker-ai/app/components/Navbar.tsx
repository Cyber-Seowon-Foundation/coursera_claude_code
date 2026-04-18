"use client";

import { Wallet, Plus, Download } from "lucide-react";

interface NavbarProps {
  onAddExpense: () => void;
  onExport: () => void;
}

export default function Navbar({ onAddExpense, onExport }: NavbarProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">ExpenseAI</h1>
            <p className="text-xs text-gray-400">Personal Finance Tracker</p>
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>
    </header>
  );
}
