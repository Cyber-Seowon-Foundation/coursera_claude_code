"use client";

import { useMemo } from "react";
import { Store, Trophy } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { useExpenses } from "@/app/hooks/useExpenses";
import { formatCurrency, getTopVendors } from "@/app/lib/utils";

export default function TopVendorsPage() {
  const { expenses, isLoaded } = useExpenses();

  const vendors = useMemo(() => getTopVendors(expenses), [expenses]);
  const grandTotal = useMemo(
    () => vendors.reduce((sum, v) => sum + v.total, 0),
    [vendors]
  );

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
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Store size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-none">Top Vendors</h2>
            <p className="text-sm text-gray-500 mt-1">
              Vendors ranked by total amount spent
            </p>
          </div>
        </div>

        {vendors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <Store size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 font-medium">No vendor data yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Add some expenses to see your top vendors
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-600">
                {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(grandTotal)}
              </span>
            </div>
            <ol className="divide-y divide-gray-50">
              {vendors.map((v, index) => {
                const rank = index + 1;
                const isPodium = rank <= 3;
                const percentage =
                  grandTotal > 0 ? (v.total / grandTotal) * 100 : 0;
                return (
                  <li
                    key={v.vendor.toLowerCase()}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                        isPodium
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      aria-label={`Rank ${rank}`}
                    >
                      {isPodium ? (
                        <span className="flex items-center gap-0.5">
                          <Trophy size={12} />
                          {rank}
                        </span>
                      ) : (
                        rank
                      )}
                    </div>

                    {/* Vendor info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {v.vendor}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {v.count} {v.count === 1 ? "transaction" : "transactions"}
                        {" · avg "}
                        {formatCurrency(v.average)}
                      </p>
                    </div>

                    {/* Total + share */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-gray-900">
                        {formatCurrency(v.total)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
