"use client";

import React, { useState } from "react";

type TabId = "general" | "integrations" | "logs";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  // General tab states
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [email, setEmail] = useState("admin@acmecorp.com");
  const [phone, setPhone] = useState("+91 98765 43210");

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  const handleSyncBalance = () => {
    alert("Syncing RazorpayX Virtual Account balance... Status: Success!");
  };

  const handleTestConnection = () => {
    alert("Testing WhatsApp API sender connection... Status: OK!");
  };

  const logs = [
    {
      time: "2026-07-30 10:15 AM",
      type: "Razorpay Payout",
      description: "Invalid IFSC Code for John Doe",
      status: "Failed",
    },
    {
      time: "2026-07-29 04:30 PM",
      type: "WhatsApp Dispatch",
      description: "Rate limit exceeded for +91 90000 00000",
      status: "Failed",
    },
    {
      time: "2026-07-28 11:05 AM",
      type: "Razorpay Payout",
      description: "Insufficient balance in virtual account",
      status: "Failed",
    },
  ];

  return (
    <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full py-8">
      {/* Header */}
      <header className="mb-2xl pt-lg">
        <h1 className="font-h1 text-h1 text-on-surface mb-2 font-bold text-3xl">
          Settings
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Manage your account, integrations, and system logs.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-outline-variant mb-xl flex gap-md overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 border-b-2 font-body-md text-body-md font-medium transition-all cursor-pointer ${
            activeTab === "general"
              ? "text-primary border-primary"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={`px-4 py-2 border-b-2 font-body-md text-body-md font-medium transition-all cursor-pointer ${
            activeTab === "integrations"
              ? "text-primary border-primary"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 border-b-2 font-body-md text-body-md font-medium transition-all cursor-pointer ${
            activeTab === "logs"
              ? "text-primary border-primary"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
        >
          Error Logs
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-md">
        {/* Tab 1: General */}
        {activeTab === "general" && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl max-w-3xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h2 className="font-h3 text-h3 text-on-surface mb-md font-semibold text-lg">
              Company Profile
            </h2>
            <form onSubmit={handleSaveGeneral} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-sm font-medium">
                    Company Name
                  </label>
                  <input
                    className="w-full border border-outline-variant rounded p-sm bg-transparent text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-sm font-medium">
                    Support Email
                  </label>
                  <input
                    className="w-full border border-outline-variant rounded p-sm bg-transparent text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-sm font-medium">
                  Employer Phone Number
                </label>
                <input
                  className="w-full border border-outline-variant rounded p-sm bg-transparent text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all max-w-sm"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="pt-md border-t border-outline-variant flex justify-end">
                <button
                  type="submit"
                  className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded hover:opacity-90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Integrations */}
        {activeTab === "integrations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Card 1: RazorpayX */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between items-start h-full">
              <div className="w-full flex justify-between items-start mb-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      account_balance
                    </span>
                  </div>
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface m-0 text-lg font-semibold">
                      RazorpayX
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant m-0 mt-1">
                      Virtual Account: •••• 5678
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  Connected
                </span>
              </div>
              <div className="mt-auto w-full pt-md border-t border-outline-variant">
                <button
                  onClick={handleSyncBalance}
                  className="w-full border border-outline-variant hover:bg-surface-container-low text-on-surface font-label-md text-label-md py-sm rounded transition-colors cursor-pointer"
                >
                  Sync Balance
                </button>
              </div>
            </div>

            {/* Card 2: WhatsApp API */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between items-start h-full">
              <div className="w-full flex justify-between items-start mb-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      chat
                    </span>
                  </div>
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface m-0 text-lg font-semibold">
                      WhatsApp API
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant m-0 mt-1">
                      Verified Sender: +91 98765 43210
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  Connected
                </span>
              </div>
              <div className="mt-auto w-full pt-md border-t border-outline-variant">
                <button
                  onClick={handleTestConnection}
                  className="w-full border border-outline-variant hover:bg-surface-container-low text-on-surface font-label-md text-label-md py-sm rounded transition-colors cursor-pointer"
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Error Logs */}
        {activeTab === "logs" && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Date/Time
                    </th>
                    <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Event Type
                    </th>
                    <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Description
                    </th>
                    <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant">
                  {logs.map((log, index) => (
                    <tr
                      key={index}
                      className="hover:bg-surface-bright transition-colors duration-150"
                    >
                      <td className="py-md px-md text-on-surface whitespace-nowrap">
                        {log.time}
                      </td>
                      <td className="py-md px-md text-on-surface font-medium">
                        {log.type}
                      </td>
                      <td className="py-md px-md text-on-surface-variant">
                        {log.description}
                      </td>
                      <td className="py-md px-md">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
