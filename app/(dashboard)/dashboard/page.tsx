"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();

  const handleStartPayroll = () => {
    router.push("/payroll/start");
  };

  const activityData = [
    { month: "June 2026", amount: "₹1,50,000", status: "Success" },
    { month: "May 2026", amount: "₹1,45,000", status: "Success" },
    { month: "April 2026", amount: "₹1,40,000", status: "Success" },
  ];

  return (
    <div className="p-gutter max-w-container-max mx-auto w-full flex flex-col gap-2xl py-8">
      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300">
          <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-xs">
            Total Paid This Month
          </h3>
          <p className="font-h1 text-h1 text-on-surface font-bold text-3xl">
            ₹4,50,000
          </p>
        </div>
        {/* Card 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300">
          <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-xs">
            Pending Payouts
          </h3>
          <p className="font-h1 text-h1 text-on-surface font-bold text-3xl">
            ₹1,20,000
          </p>
        </div>
        {/* Card 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300">
          <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-xs">
            Active Employees
          </h3>
          <p className="font-h1 text-h1 text-on-surface font-bold text-3xl">
            42
          </p>
        </div>
      </section>

      {/* Recent Activity Table */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-h3 text-h3 text-on-surface font-semibold text-xl">
            Recent Payroll Activity
          </h2>
          <button
            onClick={handleStartPayroll}
            className="text-primary font-bold text-sm hover:underline cursor-pointer"
          >
            Start New Run
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium">
                  Month
                </th>
                <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium">
                  Total Amount
                </th>
                <th className="px-lg py-sm font-label-md text-label-md text-on-surface-variant font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface">
              {activityData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-outline-variant last:border-0 hover:bg-surface-bright transition-colors duration-150"
                >
                  <td className="px-lg py-md">{row.month}</td>
                  <td className="px-lg py-md font-medium">{row.amount}</td>
                  <td className="px-lg py-md">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
