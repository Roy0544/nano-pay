"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDashboardStatsAction } from "@/app/(dashboard)/payroll/actions";

interface RecentActivityItem {
  id: string;
  month: string;
  amount: string;
  rawAmount: number;
  status: string;
  payslipCount: number;
  createdAt: string;
}

export default function DashboardHome() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [totalPaidThisMonth, setTotalPaidThisMonth] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await getDashboardStatsAction();
        if (res.error) {
          setFetchError(res.error);
        } else {
          setTotalPaidThisMonth(res.totalPaidThisMonth || 0);
          setPendingPayouts(res.pendingPayouts || 0);
          setActiveEmployees(res.activeEmployees || 0);
          setRecentActivity((res.recentActivity || []) as RecentActivityItem[]);
        }
      } catch (err: any) {
        console.error("Failed to load dashboard stats:", err);
        setFetchError(err.message || "Failed to load dashboard metrics");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleStartPayroll = () => {
    router.push("/payroll/start");
  };

  return (
    <div className="p-gutter max-w-container-max mx-auto w-full flex flex-col gap-2xl py-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-md">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface text-3xl font-bold">
            Dashboard Overview
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Real-time payroll metrics and recent disbursements
          </p>
        </div>
        <button
          onClick={handleStartPayroll}
          className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer font-semibold shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Start New Payroll Run
        </button>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div className="p-md bg-error-container text-on-error-container rounded-xl text-sm font-medium">
          ❌ {fetchError}
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Card 1: Total Paid */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300">
          <div className="flex items-center justify-between mb-xs">
            <h3 className="font-body-sm text-body-sm text-on-surface-variant">
              Total Disbursed (Paid)
            </h3>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              account_balance_wallet
            </span>
          </div>
          <p className="font-h1 text-h1 text-on-surface font-bold text-3xl">
            {isLoading ? (
              <span className="inline-block w-24 h-8 bg-surface-variant animate-pulse rounded"></span>
            ) : (
              `₹ ${totalPaidThisMonth.toLocaleString("en-IN")}`
            )}
          </p>
        </div>

        {/* Card 2: Pending Payouts */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300">
          <div className="flex items-center justify-between mb-xs">
            <h3 className="font-body-sm text-body-sm text-on-surface-variant">
              Pending Payouts
            </h3>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">
              pending_actions
            </span>
          </div>
          <p className="font-h1 text-h1 text-on-surface font-bold text-3xl">
            {isLoading ? (
              <span className="inline-block w-24 h-8 bg-surface-variant animate-pulse rounded"></span>
            ) : (
              `₹ ${pendingPayouts.toLocaleString("en-IN")}`
            )}
          </p>
        </div>

        {/* Card 3: Active Employees */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300">
          <div className="flex items-center justify-between mb-xs">
            <h3 className="font-body-sm text-body-sm text-on-surface-variant">
              Active Employees
            </h3>
            <span className="material-symbols-outlined text-primary text-[20px]">
              group
            </span>
          </div>
          <p className="font-h1 text-h1 text-on-surface font-bold text-3xl">
            {isLoading ? (
              <span className="inline-block w-12 h-8 bg-surface-variant animate-pulse rounded"></span>
            ) : (
              activeEmployees
            )}
          </p>
        </div>
      </section>

      {/* Recent Activity Table */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-h3 text-h3 text-on-surface font-semibold text-xl">
            Recent Payroll Activity
          </h2>
          <Link
            href="/payroll"
            className="text-primary font-bold text-sm hover:underline cursor-pointer flex items-center gap-1"
          >
            View All Runs
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {isLoading && (
          <div className="p-xl text-center text-on-surface-variant flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
            Loading recent activity...
          </div>
        )}

        {!isLoading && recentActivity.length === 0 && (
          <div className="p-xl text-center text-on-surface-variant flex flex-col items-center gap-sm">
            <p>No payroll runs recorded yet.</p>
            <button
              onClick={handleStartPayroll}
              className="text-primary font-bold text-sm hover:underline cursor-pointer"
            >
              Start your first run →
            </button>
          </div>
        )}

        {!isLoading && recentActivity.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium">
                    Month / Run
                  </th>
                  <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium">
                    Employees
                  </th>
                  <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium">
                    Total Amount
                  </th>
                  <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium">
                    Status
                  </th>
                  <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface">
                {recentActivity.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-outline-variant last:border-0 hover:bg-surface-bright transition-colors duration-150"
                  >
                    <td className="px-lg py-md font-medium text-on-surface">
                      {row.month}
                    </td>
                    <td className="px-lg py-md text-on-surface-variant">
                      {row.payslipCount} employee(s)
                    </td>
                    <td className="px-lg py-md font-medium">{row.amount}</td>
                    <td className="px-lg py-md">
                      {row.status === "Paid" || row.status === "Completed" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-label-sm text-label-sm font-semibold border border-green-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span>
                          {row.status}
                        </span>
                      ) : row.status === "PDFs Generated" || row.status === "Processing Payouts" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-label-sm text-label-sm font-semibold border border-blue-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>
                          {row.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm font-medium border border-outline-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline mr-1.5"></span>
                          {row.status}
                        </span>
                      )}
                    </td>
                    <td className="px-lg py-md text-right">
                      <Link
                        href={`/payroll/review?runId=${row.id}`}
                        className="inline-flex items-center gap-1 text-primary font-bold text-sm hover:underline cursor-pointer"
                      >
                        Review
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
