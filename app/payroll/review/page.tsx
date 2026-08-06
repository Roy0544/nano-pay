"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getPayrollRunDetailsAction,
  triggerGeneratePdfsAction,
  getPayslipSignedUrlAction,
  triggerBulkPayoutAction,
} from "@/app/(dashboard)/payroll/actions";

interface PayrollEmployee {
  id: string;
  name: string;
  role: string;
  account: string;
  ifsc: string;
  daysWorked: string;
  netPay: number;
  netPayText: string;
  status: "Ready" | "Review Needed" | "Paid";
  paymentRef?: string | null;
}

function ReviewPayrollContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const runId = searchParams.get("runId");

  const [runTitle, setRunTitle] = useState("Payroll Review");
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // PDF Generation State
  const [isGeneratingPdfs, setIsGeneratingPdfs] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [loadingPdfId, setLoadingPdfId] = useState<string | null>(null);

  // Bulk Payout State
  const [isDisbursingPayouts, setIsDisbursingPayouts] = useState(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!runId) {
      setFetchError("No payroll run ID provided. Please go back and upload a CSV first.");
      setIsLoading(false);
      return;
    }

    async function loadRunData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await getPayrollRunDetailsAction(runId!);

        if (res.error) {
          setFetchError(res.error);
          return;
        }

        if (res.run) {
          setRunTitle(`${res.run.month} ${res.run.year} Payroll`);
        }

        const payslips = (res.payslips || []) as PayrollEmployee[];
        setEmployees(payslips);

        // Pre-select all Ready & unpaid payslips
        const readyIds = payslips
          .filter((p) => p.status === "Ready" || p.status === "Paid")
          .map((p) => p.id);
        setSelectedIds(readyIds);
      } catch (err: any) {
        console.error("Failed to load run details:", err);
        setFetchError(err.message || "Failed to load payroll data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadRunData();
  }, [runId]);

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleAll = () => {
    if (selectedIds.length === employees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map((e) => e.id));
    }
  };

  const selectedEmployees = employees.filter((e) => selectedIds.includes(e.id));
  const totalPayout = selectedEmployees.reduce((sum, e) => sum + e.netPay, 0);

  // Trigger Inngest Background PDF Generation & Supabase Private Storage Upload
  const handleGeneratePdfs = async () => {
    if (!runId) return;
    setIsGeneratingPdfs(true);
    setPdfSuccessMessage(null);
    setFetchError(null);

    try {
      const res = await triggerGeneratePdfsAction(runId);
      if (res.success) {
        setPdfSuccessMessage(
          "⚡ PDF generation event sent to Inngest! PDFs are being generated & saved to private Supabase Storage."
        );
      } else {
        setFetchError(res.error || "Failed to trigger PDF generation");
      }
    } catch (err: any) {
      setFetchError(err.message || "An unexpected error occurred");
    } finally {
      setIsGeneratingPdfs(false);
    }
  };

  // Trigger Inngest Bulk Payment Disbursement
  const handleDisbursePayouts = async () => {
    if (!runId || selectedIds.length === 0) return;
    setIsDisbursingPayouts(true);
    setPayoutSuccessMessage(null);
    setFetchError(null);

    try {
      const res = await triggerBulkPayoutAction(runId, selectedIds);
      if (res.success) {
        setPayoutSuccessMessage(
          `⚡ Bulk payment event sent to Inngest! Disbursing ₹${totalPayout.toLocaleString("en-IN")} across ${selectedIds.length} employees.`
        );
      } else {
        setFetchError(res.error || "Failed to trigger bulk payout");
      }
    } catch (err: any) {
      setFetchError(err.message || "An unexpected error occurred during payout disburse");
    } finally {
      setIsDisbursingPayouts(false);
    }
  };

  // View PDF via 24-hr Signed URL
  const handleViewPdf = async (payslipId: string) => {
    if (!runId) return;
    setLoadingPdfId(payslipId);
    try {
      const res = await getPayslipSignedUrlAction(runId, payslipId);
      if (res.signedUrl) {
        window.open(res.signedUrl, "_blank");
      } else {
        alert(res.error || "PDF not generated yet. Click 'Generate & Save PDFs' first.");
      }
    } catch (err: any) {
      alert("Failed to fetch PDF link: " + err.message);
    } finally {
      setLoadingPdfId(null);
    }
  };


  return (
    <main className="flex-1 w-full max-w-container-max mx-auto px-gutter py-xl pb-32">
      {/* Header */}
      <div className="flex flex-col gap-sm mb-xl">
        <button
          onClick={() => router.push("/payroll")}
          className="flex items-center gap-xs text-on-surface-variant font-body-sm text-body-sm hover:text-on-surface transition-colors w-fit group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back to Payrolls
        </button>
        <div className="flex items-center justify-between flex-wrap gap-md">
          <div className="flex items-center gap-md">
            <h1 className="font-h1 text-h1 text-on-surface text-3xl font-bold">
              {runTitle}
            </h1>
            <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm rounded-DEFAULT border border-outline-variant">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-sm">
            {/* Generate PDFs Action Button */}
            <button
              onClick={handleGeneratePdfs}
              disabled={isGeneratingPdfs || employees.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity border border-outline-variant cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdfs ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                  Starting Inngest...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  Generate & Save PDFs
                </>
              )}
            </button>

            {/* Bulk Payout Action Button */}
            <button
              onClick={handleDisbursePayouts}
              disabled={isDisbursingPayouts || selectedIds.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isDisbursingPayouts ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                  Disbursing via Inngest...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  Disburse Payouts ({selectedIds.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banners */}
      {pdfSuccessMessage && (
        <div className="p-md mb-md bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>{pdfSuccessMessage}</span>
          <button
            onClick={() => setPdfSuccessMessage(null)}
            className="text-green-600 hover:text-green-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {payoutSuccessMessage && (
        <div className="p-md mb-md bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>{payoutSuccessMessage}</span>
          <button
            onClick={() => setPayoutSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-xl text-center text-on-surface-variant flex items-center justify-center gap-2">
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
          Loading payroll details...
        </div>
      )}

      {/* Error State */}
      {!isLoading && fetchError && (
        <div className="p-lg bg-error-container text-on-error-container rounded-xl text-sm font-medium">
          ❌ {fetchError}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !fetchError && employees.length === 0 && (
        <div className="p-xl text-center text-on-surface-variant">
          No payslips found for this payroll run.
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !fetchError && employees.length > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="py-md px-md w-12 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      checked={employees.length > 0 && selectedIds.length === employees.length}
                      onChange={handleToggleAll}
                    />
                  </th>
                  <th className="py-md px-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Employee Name
                  </th>
                  <th className="py-md px-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Bank Details
                  </th>
                  <th className="py-md px-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Days Worked
                  </th>
                  <th className="py-md px-md font-label-md text-label-md text-on-surface-variant font-medium text-right">
                    Net Pay (₹)
                  </th>
                  <th className="py-md px-md font-label-md text-label-md text-on-surface-variant font-medium text-center">
                    PDF Document
                  </th>
                  <th className="py-md px-md font-label-md text-label-md text-on-surface-variant font-medium w-32">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {employees.map((emp) => {
                  const isSelected = selectedIds.includes(emp.id);
                  const isPdfLoading = loadingPdfId === emp.id;

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="py-md px-md text-center">
                        <input
                          type="checkbox"
                          className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(emp.id)}
                        />
                      </td>
                      <td className="py-md px-md">
                        <div className="font-body-md text-body-md font-medium text-on-surface">
                          {emp.name}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          {emp.role}
                        </div>
                      </td>
                      <td className="py-md px-md">
                        <div className="font-body-sm text-body-sm text-on-surface font-medium">
                          Acct: {emp.account}
                        </div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                          IFSC: {emp.ifsc}
                          {emp.paymentRef && (
                            <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono rounded">
                              Ref: {emp.paymentRef}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-md px-md font-body-sm text-body-sm text-on-surface">
                        {emp.daysWorked}
                      </td>
                      <td className="py-md px-md font-body-md text-body-md text-on-surface font-medium text-right">
                        {emp.netPayText}
                      </td>

                      {/* View PDF Column */}
                      <td className="py-md px-md text-center">
                        <button
                          onClick={() => handleViewPdf(emp.id)}
                          disabled={isPdfLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm rounded-lg border border-outline-variant transition-colors cursor-pointer"
                        >
                          {isPdfLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              visibility
                            </span>
                          )}
                          View PDF
                        </button>
                      </td>

                      <td className="py-md px-md">
                        {emp.status === "Paid" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 font-label-sm text-label-sm rounded-DEFAULT font-semibold border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Paid
                          </span>
                        ) : emp.status === "Ready" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm rounded-DEFAULT">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                            Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-container text-on-error-container font-label-sm text-label-sm rounded-DEFAULT font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Review Needed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 backdrop-blur-md bg-surface-container-lowest/90 border border-outline-variant shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] rounded-full px-6 py-3.5 flex items-center justify-between gap-6 z-50 w-[92%] max-w-4xl">
        <div className="font-body-md text-body-md text-on-surface-variant whitespace-nowrap">
          <span className="font-semibold text-on-surface">{selectedIds.length}</span> Selected
        </div>
        <div className="font-h3 text-h3 text-on-surface whitespace-nowrap text-center flex-1 font-semibold text-lg md:text-xl">
          Total: ₹ {totalPayout.toLocaleString("en-IN")}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGeneratePdfs}
            disabled={selectedIds.length === 0 || isLoading || isGeneratingPdfs}
            className="flex items-center justify-center gap-1.5 bg-secondary-container text-on-secondary-container border border-outline-variant font-label-md text-label-md px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            PDFs
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
          </button>

          <button
            onClick={handleDisbursePayouts}
            disabled={selectedIds.length === 0 || isLoading || isDisbursingPayouts}
            className="flex items-center justify-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isDisbursingPayouts ? "Disbursing..." : "Disburse Payouts"}
            <span className="material-symbols-outlined text-[18px]">payments</span>
          </button>
        </div>
      </div>

    </main>
  );
}

export default function ReviewPayrollPage() {
  return (
    <Suspense fallback={<div className="p-xl text-center text-on-surface-variant">Loading page...</div>}>
      <ReviewPayrollContent />
    </Suspense>
  );
}
