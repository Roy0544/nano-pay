"use client";

import React, { useState, useEffect } from "react";
import {
  createEmployeeAction,
  getEmployeesAction,
  updateEmployeeAction,
  deleteEmployeeAction,
} from "./actions";

interface Employee {
  id: string;
  name: string;
  initials: string;
  bgColor: string;
  textColor: string;
  whatsapp: string;
  rawPhone?: string;
  wage: number;
  account: string;
  rawAccount?: string;
  ifsc: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEmployees() {
      setIsLoading(true);
      const res = await getEmployeesAction();
      setIsLoading(false);
      if (res.employees && res.employees.length > 0) {
        setEmployees(res.employees);
      }
    }
    loadEmployees();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [wage, setWage] = useState("");
  const [account, setAccount] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifsc, setIfsc] = useState("");

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setActionError(null);
    setFirstName("");
    setWhatsapp("");
    setWage("");
    setAccount("");
    setConfirmAccount("");
    setIfsc("");
    setIsSheetOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setActionError(null);
    setFirstName(emp.name);
    setWhatsapp(emp.rawPhone || emp.whatsapp.replace("+91 ", "").trim());
    setWage(String(emp.wage));
    setAccount(emp.rawAccount || "");
    setConfirmAccount(emp.rawAccount || "");
    setIfsc(emp.ifsc);
    setOpenDropdownId(null);
    setIsSheetOpen(true);
  };

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    if (!confirm(`Are you sure you want to delete ${employeeName}?`)) {
      return;
    }
    setOpenDropdownId(null);
    const result = await deleteEmployeeAction(employeeId);
    if (!result.success) {
      alert(`Failed to delete employee: ${result.error}`);
      return;
    }
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
  };

  const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🖥️ [Client UI] Form submitted, editingMode:", !!editingEmployee);
    setActionError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = editingEmployee
      ? await updateEmployeeAction(editingEmployee.id, formData)
      : await createEmployeeAction(formData);

    console.log("🖥️ [Client UI] Server response received:", result);

    if (result?.logs && Array.isArray(result.logs)) {
      console.log("%c📋 SERVER ACTION TRACE LOGS:", "color: #6366f1; font-weight: bold;");
      result.logs.forEach((l) => console.log("  " + l));
    }

    setIsSubmitting(false);

    if (!result.success) {
      console.error("❌ [Client UI] Form submission failed with error:", result.error);
      setActionError(result.error);
      return;
    }

    if (result.employee) {
      if (editingEmployee) {
        setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? result.employee! : emp)));
      } else {
        setEmployees([result.employee, ...employees]);
      }
    }

    setFirstName("");
    setWhatsapp("");
    setWage("");
    setAccount("");
    setConfirmAccount("");
    setIfsc("");
    setEditingEmployee(null);
    setIsSheetOpen(false);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.whatsapp.includes(searchQuery) ||
      emp.ifsc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-gutter max-w-container-max mx-auto space-y-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface font-bold text-2xl md:text-3xl tracking-tight">
            Employee Directory
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage your team and their payout accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">
              search
            </span>
            <input
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Search employees..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  WhatsApp Number
                </th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Daily Wage (₹)
                </th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Bank Account
                </th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  IFSC Code
                </th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="table-row-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${emp.bgColor} ${emp.textColor} flex items-center justify-center font-label-md font-semibold`}
                        >
                          {emp.initials}
                        </div>
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {emp.whatsapp}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹ {emp.wage.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-mono text-[13px]">
                      {emp.account}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-mono text-[13px]">
                      {emp.ifsc}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(openDropdownId === emp.id ? null : emp.id)}
                          className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>

                        {openDropdownId === emp.id && (
                          <div className="origin-top-right absolute right-0 mt-1 w-36 rounded-xl shadow-lg bg-surface-container-lowest border border-outline-variant ring-1 ring-black ring-opacity-5 z-20 py-1 font-body-sm text-body-sm">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(emp)}
                              className="w-full text-left px-4 py-2 hover:bg-surface-container flex items-center gap-2 text-on-surface cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-on-surface-variant font-body-md"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Centered Modal */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 bg-on-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setIsSheetOpen(false);
            setEditingEmployee(null);
          }}
        >
          {/* Modal Panel */}
          <div
            className="w-full max-h-[90vh] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10">
              <h2 className="font-h3 text-h3 text-on-surface font-semibold text-lg">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsSheetOpen(false);
                  setEditingEmployee(null);
                }}
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleAddEmployee}
              className="flex-1 overflow-y-auto p-6 flex flex-col"
            >
              <div className="flex-1 space-y-xl">
                {/* Server Error Alert Banner */}
                {actionError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Section 1: Personal Details */}
                <section className="space-y-md">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide font-bold text-xs">
                    Personal Details
                  </h3>
                  <div className="space-y-1">
                    <label className="font-label-md text-label-md text-on-surface text-sm">
                      Employee Name
                    </label>
                    <input
                      name="firstName"
                      className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      type="text"
                      required
                      placeholder="Rahul Jain"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-label-md text-on-surface text-sm">
                      WhatsApp Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-outline-variant bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm">
                        +91
                      </span>
                      <input
                        name="whatsapp"
                        className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-r-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        type="tel"
                        required
                        placeholder="9876543210"
                        pattern="[0-9]{10}"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-label-md text-on-surface text-sm">
                      Base Daily Wage (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm text-body-sm">
                        ₹
                      </span>
                      <input
                        name="wage"
                        className="w-full pl-8 pr-3 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        type="number"
                        required
                        placeholder="1200"
                        value={wage}
                        onChange={(e) => setWage(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-outline-variant" />

                {/* Section 2: Payout Details */}
                <section className="space-y-md pb-4">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide font-bold text-xs">
                    Payout Details
                  </h3>

                  {/* Warning Alert */}
                  <div className="flex gap-3 p-4 bg-[#fff8e6] border border-[#fce49c] rounded-lg">
                    <span
                      className="material-symbols-outlined text-[#b28200] shrink-0"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      warning
                    </span>
                    <p className="font-body-sm text-body-sm text-[#7a5900]">
                      Ensure these match exactly to avoid Razorpay transfer
                      failures.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-md text-label-md text-on-surface text-sm">
                      Bank Account Number
                    </label>
                    <input
                      name="account"
                      className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono tracking-wider"
                      type="password"
                      required
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-label-md text-on-surface text-sm">
                      Confirm Bank Account Number
                    </label>
                    <input
                      name="confirmAccount"
                      className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono tracking-wider"
                      type="text"
                      required
                      value={confirmAccount}
                      onChange={(e) => setConfirmAccount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-label-md text-on-surface text-sm">
                      IFSC Code
                    </label>
                    <input
                      name="ifsc"
                      className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                      type="text"
                      required
                      placeholder="HDFC0001234"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-outline-variant pt-4 bg-surface-container-lowest flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSheetOpen(false);
                    setEditingEmployee(null);
                  }}
                  className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting
                    ? editingEmployee
                      ? "Updating..."
                      : "Saving..."
                    : editingEmployee
                    ? "Update Employee"
                    : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
