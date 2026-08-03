import React from "react";
import { pdf } from "@react-pdf/renderer";
import { PayslipDocument, PayslipPDFProps } from "./PayslipDocument";

/**
 * Server-side helper to render a React-PDF component into a Node.js Buffer
 */
export async function renderPayslipPdfBuffer(props: PayslipPDFProps): Promise<Buffer> {
  console.log(`📄 [PDF GENERATOR] Starting React-PDF render for employee: "${props.employeeName}" (${props.monthYear})...`);
  const startTime = Date.now();

  const element = React.createElement(PayslipDocument, props);
  const instance = pdf(element as any);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const durationMs = Date.now() - startTime;
  console.log(`✅ [PDF GENERATOR] PDF successfully rendered for "${props.employeeName}"! Size: ${buffer.length} bytes (took ${durationMs}ms)`);

  return buffer;
}
