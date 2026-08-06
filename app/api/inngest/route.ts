import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generatePayslipsFunction } from "@/lib/inngest/functions/generatePayslips";
import { processBulkPayoutsFunction } from "@/lib/inngest/functions/processPayouts";
import { dispatchPayslipsFunction } from "@/lib/inngest/functions/dispatchPayslips";
import { processPayslipWithN8nFunction } from "@/lib/inngest/functions/processPayslipWithN8n";

const isDev = process.env.NODE_ENV === "development" || process.env.INNGEST_DEV === "1";

export const { GET, POST, PUT } = (serve as any)({
  client: inngest,
  functions: [
    generatePayslipsFunction,
    processBulkPayoutsFunction,
    dispatchPayslipsFunction,
    processPayslipWithN8nFunction,
  ],
  signingKey: process.env.INNGEST_SIGNING_KEY || (isDev ? "local-dev-signing-key" : undefined),
});



