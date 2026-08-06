import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * POST /api/payouts/process-batch
 *
 * Accepts: { payslip_ids: string[] }
 * Fetches all 'draft' payslips from those IDs, generates a mock Razorpay payout ID,
 * updates each payslip to 'processing', and asynchronously fires the mock webhook
 * after a 3-second simulated delay.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payslip_ids } = body as { payslip_ids: string[] };

    if (!Array.isArray(payslip_ids) || payslip_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "payslip_ids must be a non-empty array." },
        { status: 400 }
      );
    }

    console.log(`\n💳 [Batch Payout] Processing ${payslip_ids.length} payslip(s)...`);

    const supabase = await createClient();

    // 1. Fetch only 'draft' payslips from the given IDs
    const { data: payslips, error: fetchError } = await supabase
      .from("payslips")
      .select("id, net_pay, employee_id, status")
      .in("id", payslip_ids)
      .eq("status", "draft");

    if (fetchError) {
      console.error("❌ [Batch Payout] Failed to fetch payslips:", fetchError.message);
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    if (!payslips || payslips.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No eligible draft payslips found for the provided IDs.",
      }, { status: 404 });
    }

    console.log(`✅ [Batch Payout] Found ${payslips.length} draft payslip(s) eligible for processing.`);

    const results: { payslipId: string; razorpayPayoutId: string; status: string }[] = [];

    // 2. Loop over each payslip: assign mock payout ID, update to 'processing'
    for (const ps of payslips) {
      const razorpayPayoutId = `pout_mock_${Math.random().toString(36).substring(2, 10)}`;

      const { error: updateError } = await supabase
        .from("payslips")
        .update({
          status: "processing",
          razorpay_payout_id: razorpayPayoutId,
        })
        .eq("id", ps.id);

      if (updateError) {
        console.warn(`⚠️ [Batch Payout] Could not update payslip ${ps.id}: ${updateError.message}`);
      }

      console.log(`  ➡️ Payslip ${ps.id} → status=processing, payoutId=${razorpayPayoutId}`);

      results.push({
        payslipId: ps.id,
        razorpayPayoutId,
        status: "processing",
      });

      // 3. Fire the mock webhook after a 3-second simulated network delay (non-blocking)
      const webhookUrl = new URL(
        "/api/webhooks/mock-razorpay",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      ).toString();

      setTimeout(async () => {
        try {
          console.log(`  ⏱️ [Batch Payout] Firing mock webhook for payslip ${ps.id}...`);
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payslip_id: ps.id }),
          });
        } catch (webhookError: any) {
          console.error(`  ❌ [Batch Payout] Mock webhook failed for payslip ${ps.id}:`, webhookError.message);
        }
      }, 3000);
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("❌ [Batch Payout] Unexpected error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
