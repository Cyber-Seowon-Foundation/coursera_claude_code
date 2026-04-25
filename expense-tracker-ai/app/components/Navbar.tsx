"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Plus, Download, BarChart3 } from "lucide-react";

interface NavbarProps {
  onAddExpense?: () => void;
  onExport?: () => void;
}

export default function Navbar({ onAddExpense, onExport }: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Wallet },
    { href: "/top-categories", label: "Top Categories", icon: BarChart3 },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">ExpenseAI</h1>
            <p className="text-xs text-gray-400">Personal Finance Tracker</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon size={15} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Mobile-only nav link to Top Categories */}
        <Link
          href="/top-categories"
          aria-label="Top Categories"
          className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            pathname === "/top-categories"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <BarChart3 size={15} />
        </Link>

        {/* Actions */}
        {onExport && (
          <button
            onClick={onExport}
            aria-label="Export CSV"
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        )}

        {onAddExpense && (
          <button
            onClick={onAddExpense}
            aria-label="Add Expense"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Expense</span>
          </button>
        )}
      </div>
    </header>
  );
}
