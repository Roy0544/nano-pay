import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceKey);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.event;
    const payload = body.payload?.payout?.entity;

    console.log(`🔔 [Razorpay Webhook] Event received: "${event}"`);

    if (!payload) {
      return NextResponse.json({ status: "ignored", reason: "no payout entity" });
    }

    const supabase = getSupabaseServiceRoleClient();
    const referenceId = payload.reference_id; // payslip ID
    const payoutId = payload.id;
    const utr = payload.utr;

    if (event === "payout.processed") {
      console.log(`✅ [Razorpay Webhook] Payout PROCESSED for reference: ${referenceId}, UTR: ${utr || payoutId}`);

      if (referenceId) {
        await supabase
          .from("payslips")
          .update({
            status: "paid",
            payment_ref: utr || payoutId,
            paid_at: new Date().toISOString(),
          })
          .eq("id", referenceId);
      }
    } else if (event === "payout.failed" || event === "payout.reversed") {
      console.error(`❌ [Razorpay Webhook] Payout FAILED for reference: ${referenceId}`);

      if (referenceId) {
        await supabase
          .from("payslips")
          .update({ status: "failed" })
          .eq("id", referenceId);
      }
    }

    return NextResponse.json({ status: "success", event });
  } catch (err: any) {
    console.error("❌ [Razorpay Webhook Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
