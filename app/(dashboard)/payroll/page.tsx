"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PayrollPage() {
  const router = useRouter();

  const payrollRuns = [
    {
      id: "june-2026",
      month: "June 2026",
      year: "2026",
      amount: "₹3,75,000",
      employeesCount: 3,
      status: "Draft",
      statusColor: "bg-surface-variant text-on-surface-variant border-outline-variant",
      date: "Created on Jul 20, 2026",
      canReview: true,
    },
    {
      id: "may-2026",
      month: "May 2026",
      year: "2026",
      amount: "₹4,50,000",
      employeesCount: 42,
      status: "Success",
      statusColor: "bg-green-100 text-green-700",
      date: "Processed on Jun 01, 2026",
      canReview: false,
    },
    {
      id: "april-2026",
      month: "April 2026",
      year: "2026",
      amount: "₹4,32,000",
      employeesCount: 41,
      status: "Success",
      statusColor: "bg-green-100 text-green-700",
      date: "Processed on May 01, 2026",
      canReview: false,
    },
  ];

  return (
    <div className="p-gutter max-w-container-max mx-auto space-y-xl py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface text-3xl font-bold">
            Payroll Runs
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Initiate, review, and track your organization's payroll runs.
          </p>
        </div>
        <button
          onClick={() => router.push("/payroll/start")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Start New Payroll
        </button>
      </div>

      {/* Payroll Runs List */}
      <div className="space-y-md">
        {payrollRuns.map((run) => (
          <div
            key={run.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row md:items-center justify-between gap-lg hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300"
          >
            <div className="space-y-sm">
              <div className="flex items-center gap-md">
                <h3 className="font-h3 text-h3 text-on-surface font-semibold text-lg">
                  {run.month} Payroll
                </h3>
                <span
                  className={`px-2 py-1 rounded-DEFAULT border font-label-sm text-label-sm font-semibold ${run.statusColor}`}
                >
                  {run.status}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {run.date} • {run.employeesCount} Employees
              </p>
            </div>

            <div className="flex items-center gap-xl justify-between md:justify-end">
              <div className="text-left md:text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                  Total Payout
                </span>
                <span className="font-h2 text-h2 text-on-surface font-semibold text-xl">
                  {run.amount}
                </span>
              </div>

              {run.canReview ? (
                <button
                  onClick={() => router.push("/payroll/review")}
                  className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  Review & Disburse
                </button>
              ) : (
                <button className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                  View Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
