"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPayrollRunsAction } from "./actions";

interface PayrollRun {
  id: string;
  month: string;
  amount: string;
  status: string;
  statusColor: string;
  date: string;
  canReview: boolean;
}

export default function PayrollPage() {
  const router = useRouter();
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRuns() {
      setIsLoading(true);
      try {
        const res = await getPayrollRunsAction();
        if (res.error) {
          setFetchError(res.error);
        } else {
          setRuns(res.runs);
        }
      } catch (err: any) {
        setFetchError(err.message || "Failed to load payroll runs.");
      } finally {
        setIsLoading(false);
      }
    }
    loadRuns();
  }, []);

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-on-surface-variant">
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
          Loading payroll runs...
        </div>
      )}

      {/* Error State */}
      {!isLoading && fetchError && (
        <div className="p-lg bg-error-container text-on-error-container rounded-xl text-sm font-medium">
          ❌ {fetchError}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !fetchError && runs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">
              receipt_long
            </span>
          </div>
          <h3 className="font-h3 text-h3 text-on-surface font-semibold text-lg">
            No payroll runs yet
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Upload your attendance CSV to create your first payroll run.
          </p>
          <button
            onClick={() => router.push("/payroll/start")}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Start New Payroll
          </button>
        </div>
      )}

      {/* Payroll Runs List */}
      {!isLoading && !fetchError && runs.length > 0 && (
        <div className="space-y-md">
          {runs.map((run) => (
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
                  {run.date}
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
                    onClick={() => router.push(`/payroll/review?runId=${run.id}`)}
                    className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer"
                  >
                    Review & Disburse
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/payroll/review?runId=${run.id}`)}
                    className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
