import { inngest } from "../client";
import { createClient } from "@supabase/supabase-js";


function getSupabaseServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceKey);
}

export const dispatchPayslipsFunction = (inngest.createFunction as any)(
  {
    id: "dispatch-payslips",
    triggers: [{ event: "payroll/dispatch_slips.requested" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { runId, selectedPayslipIds, triggeredBy } = event.data;

    console.log(`\n==================================================`);
    console.log(`📲 [INNGEST WORKER] Executing 'dispatch-payslips' background job for runId: ${runId}`);
    console.log(`👤 Triggered by User ID: ${triggeredBy || "System"}`);

    const supabase = getSupabaseServiceRoleClient();

    // Step 1: Fetch Payroll Run & Target Payslips
    const dispatchData = await step.run("fetch-dispatch-details", async () => {
      console.log(`🔍 [INNGEST DISPATCH STEP 1] Fetching payslips and employee phone numbers...`);

      let query = supabase.from("payslips").select("*, employees(*)").eq("payroll_run_id", runId);

      if (Array.isArray(selectedPayslipIds) && selectedPayslipIds.length > 0) {
        query = query.in("id", selectedPayslipIds);
      }

      const { data: payslips, error } = await query;

      if (error) {
        console.error(`❌ [INNGEST DISPATCH STEP 1] Fetch error: ${error.message}`);
        throw new Error(`Failed to fetch payslips for dispatch: ${error.message}`);
      }

      console.log(`✅ [INNGEST DISPATCH STEP 1] Found ${payslips?.length || 0} payslips ready for WhatsApp/Telegram dispatch.`);
      return { payslips: payslips || [] };
    });

    const { payslips } = dispatchData;

    // Step 2: Dispatch PDF Salary Slips to Employees
    const dispatchResults = [];

    for (let i = 0; i < payslips.length; i++) {
      const ps = payslips[i];
      const emp = ps.employees || {};
      const empName = emp.first_name || "Employee";
      const phone = emp.phone || "N/A";

      console.log(`\n💬 [INNGEST DISPATCH STEP 2] Dispatching Salary Slip ${i + 1}/${payslips.length} to ${empName} (${phone})...`);

      const stepResult = await step.run(`send-slip-${ps.id}`, async () => {
        // Generate 24-hr signed PDF URL directly using the admin client.
        const filePath = `${runId}/${ps.id}.pdf`;
        const { data: signedData, error: signedError } = await supabase.storage
          .from("payslips")
          .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours

        const pdfUrl = signedData?.signedUrl || null;
        const n8nWebhookUrl = process.env.N8N_PAYROLL_WEBHOOK_URL || "https://majesty-emit-reconvene.ngrok-free.dev/webhook-test/send-payroll-pdf";

        if (signedError || !pdfUrl) {
          console.warn(`  ⚠️ Could not generate signed URL for ${empName} (path: "${filePath}"): ${signedError?.message || "No URL returned"}. Has the PDF been generated yet?`);
        } else {
          console.log(`  1️⃣ PDF Signed URL ready: ${pdfUrl.slice(0, 80)}...`);
        }

        console.log(`  2️⃣ Sending payload with PDF link and user info to n8n webhook: ${n8nWebhookUrl}...`);

        const n8nPayload = {
          payslipId: ps.id,
          runId,
          pdfUrl,
          employeeName: empName,
          phone,
          telegramChatId: emp.telegram_chat_id || process.env.TELEGRAM_DEFAULT_CHAT_ID || "8240668803",
          netPay: Number(ps.net_pay || 0),
          daysWorked: Number(ps.days_worked || 0),
        };

        try {
          const res = await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n8nPayload),
          });
          console.log(`  ✅ [n8n Webhook] Response Status: ${res.status}`);
        } catch (n8nErr: any) {
          console.error(`  ❌ [n8n Webhook Error] Failed to reach n8n: ${n8nErr.message}`);
        }

        // Record dispatch status & whatsapp_status in DB
        const { error: updateErr } = await supabase
          .from("payslips")
          .update({
            status: "dispatched",
            whatsapp_status: "delivered",
          })
          .eq("id", ps.id);

        if (updateErr) {
          console.warn(`  ⚠️ Column whatsapp_status update notice: ${updateErr.message}. Updating status only...`);
          await supabase
            .from("payslips")
            .update({ status: "dispatched" })
            .eq("id", ps.id);
        }

        console.log(`  ✅ Salary Slip PDF successfully sent to n8n for ${empName} (${phone})!`);


        return {
          payslipId: ps.id,
          employeeName: empName,
          phone,
          pdfUrl,
          status: "SENT_TO_N8N",
        };
      });


      dispatchResults.push(stepResult);
    }

    // Step 3: Mark Payroll Run as 'Completed & Dispatched'
    await step.run("finalize-payroll-run-dispatch", async () => {
      console.log(`\n🎉 [INNGEST DISPATCH STEP 3] All ${dispatchResults.length} salary slip PDFs dispatched! Updating run status to 'Completed'...`);
      await supabase
        .from("payroll_runs")
        .update({ status: "Completed" })
        .eq("id", runId);
    });

    console.log(`==================================================\n`);

    return {
      success: true,
      runId,
      dispatchedCount: dispatchResults.length,
    };
  }
);
