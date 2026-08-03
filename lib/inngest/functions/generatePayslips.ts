import { inngest } from "../client";
import { renderPayslipPdfBuffer } from "@/lib/pdf/generatePayslipPdf";
import { uploadPayslipToPrivateStorage } from "@/lib/supabase/storage";
import { createClient } from "@supabase/supabase-js";

// Initialize admin/service Supabase client for background step executions
function getSupabaseServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceKey);
}

const MONTH_NAMES: { [key: number]: string } = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const generatePayslipsFunction = (inngest.createFunction as any)(
  {
    id: "generate-payslip-pdfs",
    triggers: [{ event: "payroll/generate_pdfs.requested" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { runId } = event.data;
    console.log(`\n==================================================`);
    console.log(`⚙️ [INNGEST WORKER] Executing 'generate-payslip-pdfs' background job for runId: ${runId}`);

    const supabase = getSupabaseServiceRoleClient();

    // 1. Fetch payroll run & associated payslips with employee details
    const payrollData = await step.run("fetch-payroll-run-and-payslips", async () => {
      console.log(`🔍 [INNGEST STEP 1] Fetching run details & payslips from DB for runId: ${runId}...`);
      console.log(`🔑 [INNGEST STEP 1] Using Supabase key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "SERVICE ROLE" : "ANON KEY"}`);

      const { data: runData, error: runError } = await supabase
        .from("payroll_runs")
        .select("*")
        .eq("id", runId)
        .limit(1);

      console.log(`🔎 [INNGEST STEP 1] Raw run query result: data=`, runData, `error=`, runError?.message);

      const run = runData?.[0];
      if (runError || !run) {
        console.error(`❌ [INNGEST STEP 1] Run fetch error: ${runError?.message || "No rows returned (possibly RLS blocking access)"}`);
        throw new Error(`Payroll run not found: ${runError?.message || "No rows returned — check SUPABASE_SERVICE_ROLE_KEY in .env.local"}`);
      }

      const { data: payslips, error: payslipsError } = await supabase
        .from("payslips")
        .select("*, employees(*)")
        .eq("payroll_run_id", runId);

      if (payslipsError) {
        console.error(`❌ [INNGEST STEP 1] Payslips fetch error: ${payslipsError.message}`);
        throw new Error(`Failed to fetch payslips: ${payslipsError.message}`);
      }

      console.log(`✅ [INNGEST STEP 1] Found payroll run (${run.month}/${run.year}) with ${payslips?.length || 0} payslips.`);
      return { run, payslips: payslips || [] };
    });

    const { run, payslips } = payrollData;
    const monthName =
      typeof run.month === "number" || !isNaN(Number(run.month))
        ? MONTH_NAMES[Number(run.month)] || String(run.month)
        : String(run.month);
    const monthYearStr = `${monthName} ${run.year}`;

    // 2. Process each payslip in step-isolated background execution
    const results = [];
    for (let i = 0; i < payslips.length; i++) {
      const ps = payslips[i];
      const emp = ps.employees || {};
      const empName = emp.first_name || "Employee";

      console.log(`\n🔄 [INNGEST STEP 2] Processing Payslip ${i + 1}/${payslips.length} (ID: ${ps.id}, Employee: ${empName})...`);

      const stepResult = await step.run(`generate-and-upload-pdf-${ps.id}`, async () => {
        // A. Render React-PDF Buffer
        console.log(`  1️⃣ Rendering React-PDF document for ${empName}...`);
        const pdfBuffer = await renderPayslipPdfBuffer({
          companyName: "NanoPay Payroll",
          employeeName: empName,
          employeePhone: emp.phone || "N/A",
          accountNumber: emp.bank_account_number || "N/A",
          ifscCode: emp.bank_ifsc_code || "N/A",
          monthYear: monthYearStr,
          daysWorked: Number(ps.days_worked || 0),
          dailyWage: Number(ps.daily_wage || emp.daily_wage || 0),
          netPay: Number(ps.net_pay || 0),
        });

        // B. Upload to Private Supabase Storage Bucket & get 24-hr signed URL
        console.log(`  2️⃣ Uploading PDF to Supabase Storage & generating Signed URL...`);
        const { signedUrl } = await uploadPayslipToPrivateStorage({
          supabase,
          runId,
          payslipId: ps.id,
          pdfBuffer,
        });

        // C. Update payslip status in Supabase Database
        console.log(`  3️⃣ Updating payslip status in DB to 'pdf_generated'...`);
        await supabase
          .from("payslips")
          .update({ status: "pdf_generated" })
          .eq("id", ps.id);

        console.log(`  ✅ Payslip ${i + 1}/${payslips.length} complete for ${empName}! Signed URL ready.`);

        return {
          payslipId: ps.id,
          employeeName: empName,
          signedUrl,
        };
      });

      results.push(stepResult);
    }

    // 3. Mark the payroll run status as 'PDFs Generated'
    await step.run("mark-payroll-run-pdfs-ready", async () => {
      console.log(`\n🎉 [INNGEST STEP 3] All ${results.length} payslip PDFs generated! Updating payroll run status to 'PDFs Generated'...`);
      await supabase
        .from("payroll_runs")
        .update({ status: "PDFs Generated" })
        .eq("id", runId);
    });

    console.log(`==================================================\n`);

    return {
      success: true,
      runId,
      processedCount: results.length,
      payslips: results,
    };
  }
);
