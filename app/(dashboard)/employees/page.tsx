"use client";

import React, { useState } from "react";

interface Employee {
  id: string;
  name: string;
  initials: string;
  bgColor: string;
  textColor: string;
  whatsapp: string;
  wage: number;
  account: string;
  ifsc: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Rahul Jain",
      initials: "RJ",
      bgColor: "bg-secondary-container",
      textColor: "text-on-secondary-container",
      whatsapp: "+91 98765 43210",
      wage: 1200,
      account: "•••• 4567",
      ifsc: "HDFC0001234",
    },
    {
      id: "2",
      name: "Priya Sharma",
      initials: "PS",
      bgColor: "bg-tertiary-container",
      textColor: "text-on-tertiary-container",
      whatsapp: "+91 87654 32109",
      wage: 950,
      account: "•••• 8901",
      ifsc: "SBIN0005678",
    },
    {
      id: "3",
      name: "Amit Kumar",
      initials: "AK",
      bgColor: "bg-primary-container",
      textColor: "text-on-primary-container",
      whatsapp: "+91 76543 21098",
      wage: 1500,
      account: "•••• 2345",
      ifsc: "ICIC0009012",
    },
    {
      id: "4",
      name: "Neha Patel",
      initials: "NP",
      bgColor: "bg-surface-variant",
      textColor: "text-on-surface-variant",
      whatsapp: "+91 65432 10987",
      wage: 1100,
      account: "•••• 6789",
      ifsc: "UTIB0003456",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [wage, setWage] = useState("");
  const [account, setAccount] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifsc, setIfsc] = useState("");

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !whatsapp || !wage || !account || !ifsc) {
      alert("Please fill all required fields");
      return;
    }
    if (account !== confirmAccount) {
      alert("Bank account numbers do not match");
      return;
    }

    const name = `${firstName} ${lastName}`;
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    const bgColors = [
      "bg-secondary-container",
      "bg-tertiary-container",
      "bg-primary-container",
      "bg-surface-variant",
    ];
    const textColors = [
      "text-on-secondary-container",
      "text-on-tertiary-container",
      "text-on-primary-container",
      "text-on-surface-variant",
    ];
    const randomIndex = Math.floor(Math.random() * bgColors.length);

    const newEmp: Employee = {
      id: String(employees.length + 1),
      name,
      initials,
      bgColor: bgColors[randomIndex],
      textColor: textColors[randomIndex],
      whatsapp: `+91 ${whatsapp}`,
      wage: Number(wage),
      account: `•••• ${account.slice(-4)}`,
      ifsc: ifsc.toUpperCase(),
    };

    setEmployees([...employees, newEmp]);
    setIsSheetOpen(false);
    // Reset form
    setFirstName("");
    setLastName("");
    setWhatsapp("");
    setWage("");
    setAccount("");
    setConfirmAccount("");
    setIfsc("");
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-gutter max-w-container-max mx-auto space-y-xl py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface text-3xl font-bold">
            Employee Directory
          </h2>
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
            onClick={() => setIsSheetOpen(true)}
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
              {filteredEmployees.length > 0 ? (
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
                      <button className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
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

      {/* Slide-out Sheet */}
      {isSheetOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-on-background/40 backdrop-blur-[2px] z-50 transition-opacity"
            onClick={() => setIsSheetOpen(false)}
          />

          {/* Sheet Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest shadow-[[-10px_0_15px_-3px_rgba(0,0,0,0.1)]] z-50 flex flex-col border-l border-outline-variant transform translate-x-0 transition-transform duration-300">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10">
              <h2 className="font-h3 text-h3 text-on-surface font-semibold text-lg">
                Add New Employee
              </h2>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Sheet Form Body */}
            <form
              onSubmit={handleAddEmployee}
              className="flex-1 overflow-y-auto p-6 flex flex-col"
            >
              <div className="flex-1 space-y-xl">
                {/* Section 1: Personal Details */}
                <section className="space-y-md">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide font-bold text-xs">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface text-sm">
                        First Name
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface text-sm">
                        Last Name
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
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
                <section className="space-y-md pb-8">
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

              {/* Sheet Footer */}
              <div className="border-t border-outline-variant p-6 bg-surface-container-lowest sticky bottom-0 z-10 flex justify-end gap-3 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
