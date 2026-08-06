import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { inngest } from "@/lib/inngest/client";

/**
 * POST /api/webhooks/mock-razorpay
 *
 * Accepts: { payslip_id: string }
 * Simulates a Razorpay webhook for a successful payout:
 * 1. Updates the payslip status to 'processed'.
 * 2. Fetches the payslip + employee phone/net_pay.
 * 3. Dispatches "payroll/payout.successful" Inngest event.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payslip_id } = body as { payslip_id: string };

    if (!payslip_id) {
      return NextResponse.json(
        { success: false, error: "payslip_id is required." },
        { status: 400 }
      );
    }

    console.log(`\n🔔 [Mock Webhook] Received payout confirmation for payslip: ${payslip_id}`);

    const supabase = await createClient();

    // 1. Update payslip status to 'processed'
    const { error: updateError } = await supabase
      .from("payslips")
      .update({ status: "processed" })
      .eq("id", payslip_id);

    if (updateError) {
      console.error(`❌ [Mock Webhook] Failed to update payslip ${payslip_id}:`, updateError.message);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ [Mock Webhook] Payslip ${payslip_id} updated to status=processed.`);

    // 2. Fetch updated payslip + employee data
    const { data: payslip, error: fetchError } = await supabase
      .from("payslips")
      .select("id, net_pay, employee_id, employees(phone)")
      .eq("id", payslip_id)
      .limit(1)
      .single();

    if (fetchError || !payslip) {
      console.error(`❌ [Mock Webhook] Could not fetch payslip data: ${fetchError?.message}`);
      return NextResponse.json(
        { success: false, error: fetchError?.message || "Payslip not found after update." },
        { status: 500 }
      );
    }

    const employee = (payslip.employees as any) || {};
    const phone = employee.phone || null;
    const employeeId = payslip.employee_id;
    const netPay = payslip.net_pay;

    console.log(`📦 [Mock Webhook] Fetched payslip data — employeeId: ${employeeId}, netPay: ₹${netPay}, phone: ${phone}`);

    // 3. Send Inngest event to trigger downstream background job
    await inngest.send({
      name: "payroll/payout.successful",
      data: {
        payslipId: payslip_id,
        employeeId,
        netPay,
        phone,
      },
    });

    console.log(`🚀 [Mock Webhook] Inngest event 'payroll/payout.successful' dispatched for payslip: ${payslip_id}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ [Mock Webhook] Unexpected error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
