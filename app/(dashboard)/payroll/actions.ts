"use server";

import { revalidatePath } from "next/cache";
import Papa from "papaparse";
import { createClient } from "@/utils/supabase/server";

interface CSVRow {
  name?: string;
  phone?: string;
  whatsapp?: string;
  phone_number?: string;
  mobile?: string;
  working_days?: string;
  workingdays?: string;
  days_worked?: string;
  daysworked?: string;
  days?: string;
  attendance?: string;
  [key: string]: string | undefined;
}

/**
 * Normalizes phone numbers to standard 10-digit strings for reliable DB matching.
 */
function normalizePhone(phoneRaw: string | number | undefined | null): string {
  if (!phoneRaw) return "";
  const str = String(phoneRaw).replace(/\D/g, "");
  return str.length >= 10 ? str.slice(-10) : str;
}

/**
 * Safely extracts a column value from a CSV row by checking multiple candidate header names.
 */
function getRowValue(row: Record<string, any>, candidates: string[]): string {
  if (!row || typeof row !== "object") return "";
  const entries = Object.entries(row);

  // 1. Exact or cleaned key match
  for (const candidate of candidates) {
    const cleanCandidate = candidate.toLowerCase().replace(/[\s\-_]+/g, "");
    for (const [key, val] of entries) {
      const cleanKey = key.replace(/^\ufeff/, "").trim().toLowerCase().replace(/[\s\-_]+/g, "");
      if (cleanKey === cleanCandidate && val !== undefined && val !== null && String(val).trim() !== "") {
        return String(val).trim();
      }
    }
  }

  // 2. Substring key match fallback
  for (const candidate of candidates) {
    const cleanCandidate = candidate.toLowerCase();
    for (const [key, val] of entries) {
      const cleanKey = key.replace(/^\ufeff/, "").trim().toLowerCase();
      if (cleanKey.includes(cleanCandidate) && val !== undefined && val !== null && String(val).trim() !== "") {
        return String(val).trim();
      }
    }
  }

  return "";
}

const MONTH_MAP: Record<string, number> = {
  january: 1, jan: 1, "1": 1,
  february: 2, feb: 2, "2": 2,
  march: 3, mar: 3, "3": 3,
  april: 4, apr: 4, "4": 4,
  may: 5, "5": 5,
  june: 6, jun: 6, "6": 6,
  july: 7, jul: 7, "7": 7,
  august: 8, aug: 8, "8": 8,
  september: 9, sep: 9, sept: 9, "9": 9,
  october: 10, oct: 10, "10": 10,
  november: 11, nov: 11, "11": 11,
  december: 12, dec: 12, "12": 12,
};

const MONTH_NAMES = [
  "",
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
];

export async function processPayrollCSVAction(formData: FormData) {
  const logs: string[] = [];
  const log = (msg: string, ...args: any[]) => {
    const formatted = `${msg} ${args.length ? JSON.stringify(args) : ""}`;
    logs.push(formatted);
    console.log(formatted);
  };

  log("==================================================");
  log("🚀 [Server Action] STEP 1: processPayrollCSVAction Invoked");

  const file = formData.get("file") as File | null;
  const rawMonth = (formData.get("month") as string) || "July";
  const rawYear = (formData.get("year") as string) || "2026";

  const monthVal = MONTH_MAP[rawMonth.toLowerCase()] || parseInt(rawMonth, 10) || 7;
  const yearVal = parseInt(rawYear, 10) || 2026;

  if (!file) {
    log("❌ [Server Action] Error: No file provided");
    return { success: false, error: "Please upload a CSV file.", payrollRunId: null, logs };
  }

  // Reject Excel files — PapaParse can only parse plain CSV text
  const fileName = file.name.toLowerCase();
  const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".xlsm");
  if (isExcel) {
    log("❌ [Server Action] Error: Excel file uploaded instead of CSV");
    return {
      success: false,
      error: "Please export your spreadsheet as a CSV file first. In Excel or Google Sheets: File → Download → CSV (.csv), then upload that file.",
      payrollRunId: null,
      logs,
    };
  }

  log(`📦 [Server Action] Received file: ${file.name} (${file.size} bytes), Month: ${rawMonth}, Year: ${rawYear}`);

  // 1. Authenticate user & get organization
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    log("❌ [Server Action] Error: Unauthorized access");
    return { success: false, error: "Unauthorized access", payrollRunId: null, logs };
  }

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (orgError || !organization) {
    log("❌ [Server Action] Error: Organization record not found");
    return { success: false, error: "Organization record not found", payrollRunId: null, logs };
  }

  log(`🏢 [Server Action] Found organization_id: ${organization.id}`);

  // Query 2 (Fetch Employees): Fetch all employees for this organization_id
  log("🔍 [Server Action] Query 2: Fetching all organization employees for matching...");
  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("*")
    .eq("organization_id", organization.id);

  if (empError) {
    log("❌ [Server Action] Error fetching employees:", empError.message);
    return { success: false, error: `Failed to fetch employees: ${empError.message}`, payrollRunId: null, logs };
  }

  log(`✅ [Server Action] Fetched ${employees?.length || 0} employees from DB.`);
  console.log("🔍 [DB DEBUG] Fetched Employees Count:", employees?.length);
  if (employees && employees.length > 0) {
    console.log("🔍 [DB DEBUG] Sample DB Employee 1:", employees[0]);
  }

  if (!employees || employees.length === 0) {
    return {
      success: false,
      error: "No employees found in your employee directory. Please add your employees under the Employees tab first.",
      payrollRunId: null,
      logs,
    };
  }

  // Build in-memory lookup maps by normalized phone number AND by name
  const employeePhoneMap = new Map<string, any>();
  const employeeNameMap = new Map<string, any>();

  (employees || []).forEach((emp: any) => {
    const rawPhone = emp.phone || emp.whatsapp_number || emp.whatsapp || emp.mobile || emp.phone_number || "";
    const normalized = normalizePhone(rawPhone);
    if (normalized) {
      employeePhoneMap.set(normalized, emp);
    }
    const fullName = String(emp.first_name || emp.name || "").trim().toLowerCase();
    if (fullName) {
      employeeNameMap.set(fullName, emp);
      const firstNameOnly = fullName.split(" ")[0];
      if (firstNameOnly && !employeeNameMap.has(firstNameOnly)) {
        employeeNameMap.set(firstNameOnly, emp);
      }
    }
  });

  console.log("🔍 [DB DEBUG] Phone Map keys:", Array.from(employeePhoneMap.keys()));
  console.log("🔍 [DB DEBUG] Name Map keys:", Array.from(employeeNameMap.keys()));

  // Read CSV contents
  let fileText = "";
  try {
    fileText = await file.text();
  } catch (err: any) {
    log("❌ [Server Action] Error reading CSV text:", err.message);
    return { success: false, error: "Failed to read CSV file content", payrollRunId: null, logs };
  }

  // Parse CSV with Papaparse
  log("📄 [Server Action] Parsing CSV file with PapaParse...");
  const parsed = Papa.parse<CSVRow>(fileText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  if (parsed.errors && parsed.errors.length > 0) {
    log("⚠️ [Server Action] PapaParse non-fatal warnings/errors:", parsed.errors);
  }

  const rawRows = parsed.data || [];
  // Filter out any trailing empty or whitespace-only rows produced by Excel
  const rows = rawRows.filter((row: any) => {
    if (!row || typeof row !== "object") return false;
    return Object.values(row).some((val) => val !== undefined && val !== null && String(val).trim() !== "");
  });

  log(`📊 [Server Action] Parsed ${rows.length} valid rows from CSV (out of ${rawRows.length} total lines).`);
  console.log("📄 [CSV DEBUG] Parsed CSV valid rows count:", rows.length);
  if (rows.length > 0) {
    console.log("📄 [CSV DEBUG] Sample CSV Row 1 keys:", Object.keys(rows[0]));
    console.log("📄 [CSV DEBUG] Sample CSV Row 1 values:", rows[0]);
  }

  if (rows.length === 0) {
    return { success: false, error: "CSV file is empty or missing headers.", payrollRunId: null, logs };
  }

  // Pre-validate CSV rows and calculate net pay before creating database records
  const preparedItems: any[] = [];
  const unmatchedList: string[] = [];
  let runningTotalNetPay = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // --- Direct phone scan: iterate all keys to find the phone column value ---
    let rawPhone = "";
    const PHONE_KEY_HINTS = ["phone", "mobile", "whatsapp", "contact", "number", "ph"];
    for (const [key, val] of Object.entries(row)) {
      const cleanKey = String(key).replace(/^\ufeff/, "").trim().toLowerCase();
      if (PHONE_KEY_HINTS.some((hint) => cleanKey === hint || cleanKey.includes(hint))) {
        const candidate = String(val || "").trim();
        if (candidate) { rawPhone = candidate; break; }
      }
    }

    // --- Direct days scan: iterate all keys to find the working days column ---
    let rawDays = "0";
    const DAYS_KEY_HINTS = ["working_days", "workingdays", "days_worked", "daysworked", "days", "attendance", "present"];
    for (const [key, val] of Object.entries(row)) {
      const cleanKey = String(key).replace(/^\ufeff/, "").trim().toLowerCase();
      if (DAYS_KEY_HINTS.some((hint) => cleanKey === hint || cleanKey.includes(hint))) {
        const candidate = String(val || "").trim();
        if (candidate) { rawDays = candidate; break; }
      }
    }

    // --- Normalize phone to 10 digits and look up in DB map ---
    const normalizedPhone = normalizePhone(rawPhone);
    const matchedEmp = normalizedPhone ? employeePhoneMap.get(normalizedPhone) : undefined;

    console.log(
      `🔍 [MATCH DEBUG] Row ${i + 1}:`,
      `CSV phone raw="${rawPhone}" → normalized="${normalizedPhone}"`,
      `| DB phone map has key? ${employeePhoneMap.has(normalizedPhone)}`,
      `| Matched: ${Boolean(matchedEmp)}`
    );

    if (!matchedEmp) {
      const nameCol = Object.entries(row).find(([k]) => k.replace(/^\ufeff/, "").trim().toLowerCase().includes("name"))?.[1] || "";
      const identifier = `${String(nameCol).trim() || "?"}  (phone: ${rawPhone || "empty"})`;
      unmatchedList.push(identifier);
      log(`⚠️ [Server Action] Row ${i + 1}: No match — ${identifier}. All CSV keys: ${Object.keys(row).join(", ")}`);
      continue;
    }

    const daysWorked = Math.max(0, parseFloat(rawDays) || 0);
    const dailyWage = Number(matchedEmp.daily_wage || matchedEmp.daily_rate || matchedEmp.wage || 0);
    const netPay = Math.round(daysWorked * dailyWage);

    runningTotalNetPay += netPay;
    preparedItems.push({
      employee_id: matchedEmp.id,
      days_worked: daysWorked,
      daily_wage: dailyWage,
      net_pay: netPay,
    });
  }

  if (preparedItems.length === 0) {
    const csvKeys = rows.length > 0 ? Object.keys(rows[0]).join(", ") : "none";
    const sampleRowStr = rows.length > 0 ? JSON.stringify(rows[0]) : "{}";
    const sampleDbName = employees.length > 0 ? (employees[0].first_name || employees[0].name || "N/A") : "None";
    const sampleDbPhone = employees.length > 0 ? (employees[0].phone || employees[0].whatsapp_number || "N/A") : "None";
    const errorMsg = `None of the employees in your CSV matched your DB directory (${employees.length} employees in DB, e.g. ${sampleDbName} / ${sampleDbPhone}). CSV Headers found: [${csvKeys}]. Sample Row 1: ${sampleRowStr}.`;
    log(`❌ [Server Action] ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      payrollRunId: null,
      logs,
    };
  }

  // Query 1 (Create Batch): Insert a new row into payroll_runs with Month and Year. Get the returned payroll_run_id.
  log("➕ [Server Action] Query 1: Inserting new payroll_run row...");
  const { data: newRun, error: createRunError } = await supabase
    .from("payroll_runs")
    .insert({
      organization_id: organization.id,
      month: monthVal,
      year: yearVal,
      total_amount: runningTotalNetPay,
      status: "Draft",
    })
    .select("id")
    .single();

  if (createRunError || !newRun) {
    log("❌ [Server Action] Error creating payroll_run:", createRunError?.message);
    return { success: false, error: `Database Error: ${createRunError?.message || "Failed to create payroll run"}`, payrollRunId: null, logs };
  }

  const payrollRunId = newRun.id;
  log(`🎉 [Server Action] Query 1 Success: Created payroll_run_id = ${payrollRunId}`);

  // Query 3 (Bulk Insert Payslips):
  const payslipsPayload = preparedItems.map((item) => ({
    payroll_run_id: payrollRunId,
    ...item,
  }));

  // Query 3 (Bulk Insert Payslips): Single bulk insert into payslips table
  log(`📦 [Server Action] Query 3: Bulk inserting ${payslipsPayload.length} payslips into Supabase...`);
  let { error: bulkInsertError } = await supabase
    .from("payslips")
    .insert(payslipsPayload);

  // If status is NOT NULL without a default or rejected, attempt candidate enum values
  if (bulkInsertError && (bulkInsertError.message.includes("status") || bulkInsertError.message.includes("payout_status"))) {
    log("⚠️ [Server Action] Default insert failed for status enum. Attempting candidate enum values...");
    const candidates = ["draft", "DRAFT", "PENDING", "queued", "QUEUED", "processing", "processed", "created"];
    
    for (const candidate of candidates) {
      const retryPayload = payslipsPayload.map((p) => ({ ...p, status: candidate }));
      const { error: retryErr } = await supabase.from("payslips").insert(retryPayload);
      if (!retryErr) {
        bulkInsertError = null;
        log(`🎉 [Server Action] Query 3 Success: Payslips inserted using enum value "${candidate}"!`);
        break;
      }
    }
  }

  if (bulkInsertError) {
    log("❌ [Server Action] Query 3 Failed: Error bulk inserting payslips:", bulkInsertError.message);
    // Cleanup orphaned payroll_run if bulk insert fails
    await supabase.from("payroll_runs").delete().eq("id", payrollRunId);
    return {
      success: false,
      error: `Failed to insert payslips: ${bulkInsertError.message}`,
      payrollRunId: null,
      logs,
    };
  }

  log("🎉 [Server Action] Query 3 Success: Payslips inserted successfully!");

  // Query 4 (Update Total): Sum up all the net_pay values and update the total_amount in the payroll_runs table.
  log(`🔄 [Server Action] Query 4: Updating total_amount = ₹${runningTotalNetPay} for payroll_run_id = ${payrollRunId}...`);
  const { error: updateTotalError } = await supabase
    .from("payroll_runs")
    .update({ total_amount: runningTotalNetPay })
    .eq("id", payrollRunId);

  if (updateTotalError) {
    log("⚠️ [Server Action] Query 4 Warning: Failed to update total_amount:", updateTotalError.message);
  } else {
    log("🎉 [Server Action] Query 4 Success: Payroll total updated!");
  }

  revalidatePath("/payroll");
  log("==================================================");

  return {
    success: true,
    error: null,
    payrollRunId: String(payrollRunId),
    totalAmount: runningTotalNetPay,
    payslipsCount: payslipsPayload.length,
    logs,
  };
}

export async function getPayrollRunDetailsAction(payrollRunId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized access", run: null, payslips: [] };
  }

  // Fetch payroll run details
  const { data: run, error: runError } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", payrollRunId)
    .single();

  if (runError || !run) {
    return { error: "Payroll run not found", run: null, payslips: [] };
  }

  const monthName =
    typeof run.month === "number" || !isNaN(Number(run.month))
      ? MONTH_NAMES[Number(run.month)] || String(run.month)
      : String(run.month);

  const formattedRun = {
    ...run,
    month: monthName,
  };

  // Fetch payslips with employee details
  const { data: payslipsData, error: payslipsError } = await supabase
    .from("payslips")
    .select(`
      *,
      employees (
        id,
        first_name,
        phone,
        bank_account_number,
        bank_ifsc_code,
        daily_wage
      )
    `)
    .eq("payroll_run_id", payrollRunId);

  if (payslipsError) {
    return { error: payslipsError.message, run, payslips: [] };
  }

  const formattedPayslips = (payslipsData || []).map((ps: any) => {
    const emp = ps.employees || {};
    const empName = emp.first_name || "Unknown Employee";
    const account = String(emp.bank_account_number || "");
    const maskedAccount = account.length >= 4 ? `•••• ${account.slice(-4)}` : account || "N/A";

    let uiStatus: "Ready" | "Review Needed" | "Paid" =
      !ps.employee_id || ps.status === "failed" || ps.status === "review_needed"
        ? "Review Needed"
        : "Ready";

    if (ps.status === "paid") {
      uiStatus = "Paid";
    }

    return {
      id: String(ps.id),
      employeeId: ps.employee_id ? String(ps.employee_id) : null,
      name: empName,
      role: "Employee",
      account: maskedAccount,
      ifsc: emp.bank_ifsc_code || "N/A",
      daysWorked: `${ps.days_worked} days`,
      netPay: Number(ps.net_pay || 0),
      netPayText: `₹ ${Number(ps.net_pay || 0).toLocaleString("en-IN")}`,
      status: uiStatus,
      paymentRef: ps.payment_ref || null,
      paidAt: ps.paid_at || null,
    };

  });

  return { error: null, run: formattedRun, payslips: formattedPayslips };
}

export async function getPayrollRunsAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized access", runs: [] };
  }

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (orgError || !organization) {
    return { error: "Organization not found", runs: [] };
  }

  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("organization_id", organization.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, runs: [] };
  }

  const runs = (data || []).map((run: any) => {
    const monthName =
      typeof run.month === "number" || !isNaN(Number(run.month))
        ? MONTH_NAMES[Number(run.month)] || String(run.month)
        : String(run.month);

    const isDraft = !run.status || String(run.status).toLowerCase() === "draft";
    const statusLabel = isDraft ? "Draft" : String(run.status);
    const statusColor = isDraft
      ? "bg-surface-variant text-on-surface-variant border-outline-variant"
      : "bg-green-100 text-green-700";

    const createdAt = run.created_at
      ? new Date(run.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

    return {
      id: String(run.id),
      month: `${monthName} ${run.year}`,
      amount: `₹ ${Number(run.total_amount || 0).toLocaleString("en-IN")}`,
      status: statusLabel,
      statusColor,
      date: `Created on ${createdAt}`,
      canReview: isDraft,
    };
  });

  return { error: null, runs };
}

export async function triggerGeneratePdfsAction(payrollRunId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized access" };
  }

  // Import inngest client dynamically to avoid module side-effects
  const { inngest } = await import("@/lib/inngest/client");

  try {
    console.log(`🚀 [Inngest Trigger] Dispatching 'payroll/generate_pdfs.requested' for runId: ${payrollRunId}`);
    const sendResult = await inngest.send({
      name: "payroll/generate_pdfs.requested",
      data: {
        runId: payrollRunId,
        triggeredBy: user.id,
      },
    });
    console.log("✅ [Inngest Trigger] Event sent successfully:", sendResult);

    // Update status to 'Generating PDFs'
    await supabase
      .from("payroll_runs")
      .update({ status: "Generating PDFs" })
      .eq("id", payrollRunId);

    return {
      success: true,
      message: "PDF generation started in background via Inngest!",
    };
  } catch (err: any) {
    console.error("Failed to trigger Inngest event:", err);
    return { success: false, error: err.message || "Failed to trigger PDF generation" };
  }
}

export async function getPayslipSignedUrlAction(payrollRunId: string, payslipId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized access", signedUrl: null };
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !serviceKey) {
    return { error: "Supabase environment variables missing", signedUrl: null };
  }

  // Admin client bypasses RLS for storage access
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const adminSupabase = createAdminClient(supabaseUrl, serviceKey);

  const filePath = `${payrollRunId}/${payslipId}.pdf`;

  // 1. Verify file exists in bucket first
  const { data: fileList, error: listError } = await adminSupabase.storage
    .from("payslips")
    .list(payrollRunId, { search: `${payslipId}.pdf` });

  const exists = fileList && fileList.some((f) => f.name === `${payslipId}.pdf`);

  if (!exists) {
    console.log(`⚠️ [Storage Check] File "${filePath}" not found in bucket 'payslips'. (Found: ${fileList?.length || 0} files)`);
    return {
      error: "PDF payslip has not been generated yet. Please click 'Generate & Save PDFs (Inngest)' first and wait a few seconds for processing to finish.",
      signedUrl: null,
    };
  }

  // 2. Generate signed URL
  const { data, error } = await adminSupabase.storage
    .from("payslips")
    .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours

  if (error || !data?.signedUrl) {
    return { error: error?.message || "Failed to generate signed URL for PDF", signedUrl: null };
  }

  return { error: null, signedUrl: data.signedUrl };
}

export async function triggerBulkPayoutAction(payrollRunId: string, selectedPayslipIds?: string[]) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized access" };
  }

  const { inngest } = await import("@/lib/inngest/client");

  try {
    console.log(`🚀 [Inngest Trigger] Dispatching 'payroll/bulk_payout.requested' for runId: ${payrollRunId}`);
    const sendResult = await inngest.send({
      name: "payroll/bulk_payout.requested",
      data: {
        runId: payrollRunId,
        selectedPayslipIds: selectedPayslipIds || [],
        triggeredBy: user.id,
      },
    });
    console.log("✅ [Inngest Trigger] Bulk payout event sent successfully:", sendResult);

    // Update status to 'Processing Payouts'
    await supabase
      .from("payroll_runs")
      .update({ status: "Processing Payouts" })
      .eq("id", payrollRunId);

    revalidatePath("/payroll/review");

    return {
      success: true,
      message: "⚡ Bulk payment disbursement started in background via Inngest!",
    };
  } catch (err: any) {
    console.error("Failed to trigger Inngest bulk payout event:", err);
    return { success: false, error: err.message || "Failed to trigger bulk payout" };
  }
}



