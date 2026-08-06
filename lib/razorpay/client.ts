/**
 * RazorpayX Banking & Payouts API Utility Helper
 * Official API Documentation: https://razorpay.com/docs/api/x/payouts/
 */

const RAZORPAY_BASE_URL = "https://api.razorpay.com/v1";

function getAuthHeader(): string {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables");
  }

  const credentials = `${keyId}:${keySecret}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export interface RazorpayContactInput {
  name: string;
  email?: string;
  contact?: string;
  type?: "employee" | "vendor" | "customer";
  referenceId?: string;
}

export interface RazorpayFundAccountInput {
  contactId: string;
  name: string;
  ifsc: string;
  accountNumber: string;
}

export interface RazorpayPayoutInput {
  accountNumber: string; // RazorpayX Business Account Number
  fundAccountId: string;
  amountInRupees: number;
  mode?: "IMPS" | "NEFT" | "RTGS" | "UPI";
  purpose?: "salary" | "payout" | "refund";
  referenceId?: string;
  notes?: Record<string, string>;
}

/**
 * 1. Create or fetch a Contact on RazorpayX
 */
export async function createRazorpayContact(input: RazorpayContactInput) {
  const auth = getAuthHeader();

  const response = await fetch(`${RAZORPAY_BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email || `${input.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
      contact: input.contact || "9999999999",
      type: input.type || "employee",
      reference_id: input.referenceId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ [RazorpayX API] Contact creation failed:", data);
    throw new Error(`RazorpayX Contact error: ${data.error?.description || response.statusText}`);
  }

  console.log(`✅ [RazorpayX API] Contact created/retrieved successfully: ${data.id}`);
  return data; // returns { id: "cont_...", name: "...", ... }
}

/**
 * 2. Create a Fund Account (Bank Account) linked to a Contact
 */
export async function createRazorpayFundAccount(input: RazorpayFundAccountInput) {
  const auth = getAuthHeader();

  const response = await fetch(`${RAZORPAY_BASE_URL}/fund_accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify({
      contact_id: input.contactId,
      account_type: "bank_account",
      bank_account: {
        name: input.name,
        ifsc: input.ifsc,
        account_number: input.accountNumber,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ [RazorpayX API] Fund Account creation failed:", data);
    throw new Error(`RazorpayX Fund Account error: ${data.error?.description || response.statusText}`);
  }

  console.log(`✅ [RazorpayX API] Fund Account created successfully: ${data.id}`);
  return data; // returns { id: "fa_...", ... }
}

/**
 * 3. Create a Payout to disburse funds directly to Employee Bank Account
 */
export async function createRazorpayPayout(input: RazorpayPayoutInput) {
  const auth = getAuthHeader();
  const amountInPaise = Math.round(input.amountInRupees * 100);

  const payload = {
    account_number: input.accountNumber,
    fund_account_id: input.fundAccountId,
    amount: amountInPaise,
    currency: "INR",
    mode: input.mode || "IMPS",
    purpose: input.purpose || "salary",
    queue_if_low_balance: true,
    reference_id: input.referenceId,
    narration: "Salary Payout",
    notes: input.notes || {},
  };

  const response = await fetch(`${RAZORPAY_BASE_URL}/payouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
      "X-Payout-Idempotency": input.referenceId || `payout_${Date.now()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ [RazorpayX API] Payout failed:", data);
    throw new Error(`RazorpayX Payout error: ${data.error?.description || response.statusText}`);
  }

  console.log(`🎉 [RazorpayX API] Payout created successfully! ID: ${data.id}, Status: ${data.status}, UTR: ${data.utr || "Pending"}`);
  return data; // returns { id: "pout_...", status: "queued"|"processing"|"processed", utr: "..." }
}
