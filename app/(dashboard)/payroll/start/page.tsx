"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { processPayrollCSVAction } from "../actions";

export default function StartPayrollPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessPayroll = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("month", selectedMonth);
      formData.append("year", selectedYear);

      const res = await processPayrollCSVAction(formData);

      if (res.success && res.payrollRunId) {
        router.push(`/payroll/review?runId=${res.payrollRunId}`);
      } else {
        setErrorMessage(res.error || "Failed to process payroll CSV.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    router.push("/payroll");
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-xl flex justify-center items-start pt-2xl py-8">
      <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="mb-xl text-center">
          <h1 className="font-h2 text-h2 text-on-surface mb-2 font-bold text-2xl">
            Start New Payroll Run
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Upload your employee data to initiate processing.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-md mb-xl">
          <div className="flex-1">
            <label
              className="block font-label-sm text-label-sm text-on-surface-variant mb-2 text-sm"
              htmlFor="month-select"
            >
              Target Month
            </label>
            <select
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 appearance-none"
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label
              className="block font-label-sm text-label-sm text-on-surface-variant mb-2 text-sm"
              htmlFor="year-select"
            >
              Fiscal Year
            </label>
            <select
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3 appearance-none"
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`border-2 border-dashed rounded-xl p-2xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group bg-surface-bright ${
            isDragging
              ? "bg-primary-container border-primary bg-opacity-10"
              : "border-outline-variant hover:bg-surface-container hover:border-primary"
          }`}
        >
          {uploadedFile ? (
            <>
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-primary">
                  description
                </span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-1 font-semibold">
                {uploadedFile.name}
              </h3>
              <p className="font-body-sm text-body-sm text-primary font-bold">
                Ready to process ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-3xl text-primary group-hover:text-on-primary">
                  cloud_upload
                </span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-2 font-semibold text-lg">
                Click to upload or drag and drop
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                CSV files only (.csv) up to 10MB
              </p>
              <button
                type="button"
                className="border border-outline-variant text-on-surface font-label-md text-label-md px-6 py-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                Browse Files
              </button>
            </>
          )}
          <input
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,text/csv"
            className="hidden"
            type="file"
          />
        </div>

        <div className="mt-md text-center">
          <Link
            href="#"
            className="font-label-md text-label-md text-primary hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download sample Excel template
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-md p-md bg-error-container text-on-error-container rounded-lg text-sm font-medium">
            ❌ {errorMessage}
          </div>
        )}

        <div className="mt-2xl flex justify-end gap-md pt-xl border-t border-outline-variant">
          <button
            onClick={handleCancel}
            type="button"
            disabled={isProcessing}
            className="font-label-md text-label-md text-on-surface border border-outline-variant px-6 py-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessPayroll}
            disabled={!uploadedFile || isProcessing}
            className="font-label-md text-label-md bg-primary text-on-primary px-6 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing CSV...
              </>
            ) : (
              "Process Payroll"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
