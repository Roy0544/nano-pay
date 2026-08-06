import { inngest } from "../client";

// ─── Type Definitions ─────────────────────────────────────────────────────────

/**
 * Shape of the event payload emitted when a single payslip payout succeeds.
 * Emitted by the mock webhook or the real RazorpayX webhook after a transfer completes.
 */
export interface PayoutSuccessfulEventData {
  payslipId: string;
  runId?: string;
  pdfUrl?: string | null;
  telegramChatId: string;
  phone?: string;
  netPay: number;
  employeeName: string;
}

// ─── Inngest Function ─────────────────────────────────────────────────────────

export const processPayslipWithN8nFunction = (inngest.createFunction as any)(
  {
    id: "process-payslip-with-n8n",
    triggers: [{ event: "payroll/payout.successful" }],
  },
  async ({
    event,
    step,
  }: {
    event: { data: PayoutSuccessfulEventData };
    step: any;
  }) => {
    const { payslipId, runId, pdfUrl, telegramChatId, phone, netPay, employeeName } =
      event.data;

    const webhookUrl =
      process.env.N8N_PAYROLL_WEBHOOK_URL ||
      "https://majesty-emit-reconvene.ngrok-free.dev/webhook-test/send-payroll-pdf";

    if (!webhookUrl) {
      throw new Error(
        "[processPayslipWithN8n] N8N_PAYROLL_WEBHOOK_URL is not set."
      );
    }

    console.log(
      `\n🔗 [INNGEST N8N] Received 'payroll/payout.successful' for payslipId: ${payslipId}`
    );
    console.log(
      `   Employee: ${employeeName} | TelegramChatId: ${telegramChatId} | Phone: ${phone || "N/A"} | Net Pay: ₹${netPay}`
    );

    const n8nResponse = await step.fetch(
      "call-n8n-payroll-webhook",
      webhookUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payslipId,
          runId: runId || null,
          pdfUrl: pdfUrl || null,
          telegramChatId,
          phone: phone || null,
          netPay,
          employeeName,
        }),
      }
    );


    // n8n returns 200 on success; treat any non-2xx as a retryable failure
    if (!n8nResponse.ok) {
      const errorBody = await n8nResponse.text();
      console.error(
        `❌ [INNGEST N8N] n8n webhook responded with ${n8nResponse.status}: ${errorBody}`
      );
      throw new Error(
        `n8n webhook returned HTTP ${n8nResponse.status}. ` +
          `Inngest will automatically retry. Body: ${errorBody}`
      );
    }

    console.log(
      `✅ [INNGEST N8N] n8n webhook accepted the request (HTTP ${n8nResponse.status}).`
    );
    console.log(
      `   n8n will now handle PDF generation, Telegram dispatch, and Supabase update.`
    );

    return {
      success: true,
      payslipId,
      employeeName,
      netPay,
      n8nStatus: n8nResponse.status,
      message: `Payslip data for ${employeeName} successfully handed off to n8n.`,
    };
  }
);
