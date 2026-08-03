import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generatePayslipsFunction } from "@/lib/inngest/functions/generatePayslips";

const isDev = process.env.NODE_ENV === "development" || process.env.INNGEST_DEV === "1";

export const { GET, POST, PUT } = (serve as any)({
  client: inngest,
  functions: [generatePayslipsFunction],
  signingKey: process.env.INNGEST_SIGNING_KEY || (isDev ? "local-dev-signing-key" : undefined),
});
