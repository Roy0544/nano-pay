"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PayrollEmployee {
  id: string;
  name: string;
  role: string;
  account: string;
  ifsc: string;
  daysWorked: string;
  netPay: number;
  netPayText: string;
  status: "Ready" | "Review Needed";
}

export default function ReviewPayrollPage() {
  const router = useRouter();

  const employees: PayrollEmployee[] = [
    {
      id: "1",
      name: "Aarav Sharma",
      role: "Software Engineer",
      account: "•••• 4589",
      ifsc: "HDFC0001234",
      daysWorked: "22 / 22",
      netPay: 125000,
      netPayText: "₹ 1,25,000",
      status: "Ready",
    },
    {
      id: "2",
      name: "Diya Patel",
      role: "Product Manager",
      account: "•••• 1122",
      ifsc: "ICIC0005678",
      daysWorked: "21 / 22",
      netPay: 140000,
      netPayText: "₹ 1,40,000",
      status: "Ready",
    },
    {
      id: "3",
      name: "Rohan Gupta",
      role: "Marketing Specialist",
      account: "•••• 9988",
      ifsc: "SBIN0009012",
      daysWorked: "18 / 22",
      netPay: 85000,
      netPayText: "₹ 85,000",
      status: "Review Needed",
    },
    {
      id: "4",
      name: "Ananya Singh",
      role: "UX Designer",
      account: "•••• 3344",
      ifsc: "UTIB0003456",
      daysWorked: "22 / 22",
      netPay: 110000,
      netPayText: "₹ 1,10,000",
      status: "Ready",
    },
    {
      id: "5",
      name: "Vikram Desai",
      role: "Sales Lead",
      account: "•••• 7766",
      ifsc: "KKBK0007890",
      daysWorked: "15 / 22",
      netPay: 95000,
      netPayText: "₹ 95,000",
      status: "Review Needed",
    },
  ];

  // Default checked employees are Aarav, Diya, Ananya
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "2", "4"]);

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

  const handleDisburse = () => {
    alert(
      `Disbursed ₹ ${totalPayout.toLocaleString()} to ${
        selectedEmployees.length
      } employees successfully! WhatsApp payslips have been dispatched.`
    );
    router.push("/payroll");
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
        <div className="flex items-center gap-md">
          <h1 className="font-h1 text-h1 text-on-surface text-3xl font-bold">
            June 2026 Payroll
          </h1>
          <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm rounded-DEFAULT border border-outline-variant">
            Draft
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest">
                <th className="py-md px-md w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    checked={selectedIds.length === employees.length}
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
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant font-medium w-32">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {employees.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);
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
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        IFSC: {emp.ifsc}
                      </div>
                    </td>
                    <td className="py-md px-md font-body-sm text-body-sm text-on-surface">
                      {emp.daysWorked}
                    </td>
                    <td className="py-md px-md font-body-md text-body-md text-on-surface font-medium text-right">
                      {emp.netPayText}
                    </td>
                    <td className="py-md px-md">
                      {emp.status === "Ready" ? (
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

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 backdrop-blur-md bg-surface-container-lowest/90 border border-outline-variant shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] rounded-full px-8 py-4 flex items-center justify-between gap-8 z-50 w-[90%] max-w-3xl">
        <div className="font-body-md text-body-md text-on-surface-variant whitespace-nowrap">
          {selectedIds.length} Employees Selected
        </div>
        <div className="font-h3 text-h3 text-on-surface whitespace-nowrap text-center flex-1 font-semibold text-lg md:text-xl">
          Total Payout: ₹ {totalPayout.toLocaleString()}
        </div>
        <button
          onClick={handleDisburse}
          disabled={selectedIds.length === 0}
          className="flex items-center justify-center gap-sm bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Disburse Funds & Send Payslips
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </main>
  );
}
