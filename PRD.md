# Nanopay v2 — Product Requirements Document (PRD)

## 1. Executive Summary
Nanopay is an automated payroll and disbursement platform for SMBs. Employers upload monthly attendance via Excel, review calculated payouts on a web dashboard, select specific employees, and trigger direct bank deposits via RazorpayX. Upon successful payment, the system automatically generates and sends a PDF salary slip to the employee via WhatsApp.

## 2. Target Audience
- Small business owners, local factories, and agencies.
- Employers who want to combine bank transfers and salary slip distribution into one click.

## 3. Scope & Feature List

### MVP (Must-Have for Launch)
- **Excel Ingestion & Parsing:** Drag-and-drop file upload with column mapping.
- **Review & Selection Dashboard:** A UI data table with checkboxes allowing the employer to select all or specific employees for payout.
- **Wallet Balance Check:** Pre-flight check to ensure the employer's RazorpayX wallet has sufficient funds before allowing the batch payout.
- **Bulk Payout Engine:** Integration with RazorpayX to disburse funds to selected employees.
- **Async Webhook Processing:** Listening for bank confirmations (`payout.processed`) or failures.
- **Automated Document Dispatch:** Programmatic PDF generation and WhatsApp delivery triggered *only* upon successful payment.
- **Idempotency & Safety:** Strict database constraints to prevent double-payouts.

## 4. Key Performance Indicators (KPIs)
- **Zero Double-Payouts:** 100% adherence to idempotency rules.
- **Reconciliation Accuracy:** Database statuses exactly match the RazorpayX dashboard.
