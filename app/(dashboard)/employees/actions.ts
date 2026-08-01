"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "../../../utils/supabase/server";

// Zod Validation Schema for Employee Details
const EmployeeSchema = z
  .object({
    firstName: z.string().min(1, "Employee name is required"),
    whatsapp: z
      .string()
      .regex(/^[0-9]{10}$/, "WhatsApp number must be exactly 10 digits"),
    wage: z.coerce
      .number()
      .positive("Daily wage must be greater than 0"),
    account: z
      .string()
      .min(8, "Account number must be at least 8 digits"),
    confirmAccount: z.string(),
    ifsc: z
      .string()
      .regex(
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Invalid IFSC code format (e.g. HDFC0001234)"
      ),
  })
  .refine((data) => data.account === data.confirmAccount, {
    message: "Bank account numbers do not match",
    path: ["confirmAccount"],
  });

export async function getEmployeesAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { employees: [], error: "Unauthorized access" };
  }

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (orgError || !organization) {
    return { employees: [], error: "Organization record not found" };
  }

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("organization_id", organization.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ [getEmployeesAction] Error fetching employees:", error.message);
    return { employees: [], error: error.message };
  }

  const formattedEmployees = (data || []).map((emp: any) => {
    const name = emp.first_name || emp.name || "Employee";
    const phone = String(emp.phone || emp.whatsapp_number || "").replace("+91", "").trim();
    const wage = Number(emp.daily_wage || emp.daily_rate || emp.wage || 0);
    const account = String(emp.bank_account_number || emp.account_number || "");
    const ifsc = String(emp.bank_ifsc_code || emp.ifsc_code || "");
    const initials = (name[0] || "E").toUpperCase();

    return {
      id: String(emp.id),
      name: name,
      initials: initials,
      bgColor: "bg-secondary-container",
      textColor: "text-on-secondary-container",
      whatsapp: `+91 ${phone}`,
      rawPhone: phone,
      wage: wage,
      account: account.length >= 4 ? `•••• •••• ${account.slice(-4)}` : account,
      rawAccount: account,
      ifsc: ifsc.toUpperCase(),
    };
  });

  return { employees: formattedEmployees, error: null };
}

export async function createEmployeeAction(formData: FormData) {
  const logs: string[] = [];
  const log = (msg: string, ...args: any[]) => {
    const formatted = `${msg} ${args.length ? JSON.stringify(args) : ""}`;
    logs.push(formatted);
    console.log(formatted);
  };

  log("==================================================");
  log("🚀 [Server Action] STEP 1: createEmployeeAction Invoked");

  const rawData = Object.fromEntries(formData.entries());
  log("📦 [Server Action] Raw Input Received:", {
    firstName: rawData.firstName,
    whatsapp: rawData.whatsapp,
    wage: rawData.wage,
    account: rawData.account ? "••••" + String(rawData.account).slice(-4) : undefined,
    ifsc: rawData.ifsc,
  });

  // 2. Validate Form Data using Zod
  const validation = EmployeeSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0].message;
    log("❌ [Server Action] STEP 2 Validation Error:", firstError);
    return { success: false, error: firstError, employee: null, logs };
  }

  log("✅ [Server Action] STEP 2: Zod Validation Passed");
  const { firstName, whatsapp, wage, account, ifsc } = validation.data;

  // 3. Supabase Auth Check
  const supabase = await createClient();
  log("🔐 [Server Action] STEP 3: Fetching Supabase Auth User...");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    log(
      "⚠️ [Server Action] STEP 3 Warning: User is NOT authenticated in Supabase.",
      userError ? userError.message : "No active session user."
    );
  } else {
    log("👤 [Server Action] STEP 3: Authenticated User ID:", user.id);
  }

  // 4. Fetch Organization directly using user_id
  if (user && !userError) {
    log("🏢 [Server Action] STEP 4: Fetching organization directly using user_id...");
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (orgError || !organization) {
      log(
        "❌ [Server Action] STEP 4 Failed: Could not fetch organization for user_id.",
        orgError ? orgError.message : "Organization record missing."
      );
    } else {
      log("✅ [Server Action] STEP 4: Found organization_id:", organization.id);

      // 5. Database Insert into 'employees'
      log("💾 [Server Action] STEP 5: Inserting employee row into 'employees' table...");
      const insertPayload = {
        organization_id: organization.id,
        first_name: firstName,
        phone: whatsapp,
        daily_wage: wage,
        bank_account_number: account,
        bank_ifsc_code: ifsc,
      };

      const { data: insertedData, error: insertError } = await supabase
        .from("employees")
        .insert(insertPayload)
        .select();

      if (insertError) {
        log("❌ [Server Action] STEP 5 Failed: Supabase insert error:", {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        });
        return {
          success: false,
          error: `Database Error: ${insertError.message}`,
          employee: null,
          logs,
        };
      }

      log("🎉 [Server Action] STEP 5 Success: Employee uploaded to Supabase!", insertedData);
    }
  }

  log("🔄 [Server Action] STEP 6: Revalidating path /employees");
  revalidatePath("/employees");
  log("==================================================");

  return {
    success: true,
    error: null,
    logs,
    employee: {
      id: String(Date.now()),
      name: firstName,
      whatsapp: `+91 ${whatsapp}`,
      rawPhone: whatsapp,
      wage: wage,
      account: `•••• •••• ${account.slice(-4)}`,
      rawAccount: account,
      ifsc: ifsc.toUpperCase(),
      initials: (firstName[0] || "E").toUpperCase(),
      bgColor: "bg-[#e5eeff]",
      textColor: "text-[#3525cd]",
    },
  };
}

export async function updateEmployeeAction(employeeId: string, formData: FormData) {
  const logs: string[] = [];
  const log = (msg: string, ...args: any[]) => {
    const formatted = `${msg} ${args.length ? JSON.stringify(args) : ""}`;
    logs.push(formatted);
    console.log(formatted);
  };

  log("==================================================");
  log("🚀 [Server Action] STEP 1: updateEmployeeAction Invoked for ID:", employeeId);

  const rawData = Object.fromEntries(formData.entries());
  log("📦 [Server Action] Raw Update Input Received:", rawData);

  const validation = EmployeeSchema.safeParse(rawData);
  if (!validation.success) {
    const firstError = validation.error.issues[0].message;
    log("❌ [Server Action] STEP 2 Validation Error:", firstError);
    return { success: false, error: firstError, employee: null, logs };
  }

  const { firstName, whatsapp, wage, account, ifsc } = validation.data;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized access", employee: null, logs };
  }

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (orgError || !organization) {
    return { success: false, error: "Organization record missing", employee: null, logs };
  }

  log("💾 [Server Action] STEP 3: Executing update query on 'employees'...");
  const updatePayload = {
    first_name: firstName,
    phone: whatsapp,
    daily_wage: wage,
    bank_account_number: account,
    bank_ifsc_code: ifsc,
  };

  const { data: updatedData, error: updateError } = await supabase
    .from("employees")
    .update(updatePayload)
    .eq("id", employeeId)
    .eq("organization_id", organization.id)
    .select();

  if (updateError) {
    log("❌ [Server Action] Update error:", updateError.message);
    return {
      success: false,
      error: `Database Error: ${updateError.message}`,
      employee: null,
      logs,
    };
  }

  log("🎉 [Server Action] STEP 4 Success: Employee updated in Supabase!", updatedData);
  revalidatePath("/employees");

  return {
    success: true,
    error: null,
    logs,
    employee: {
      id: String(employeeId),
      name: firstName,
      whatsapp: `+91 ${whatsapp}`,
      rawPhone: whatsapp,
      wage: wage,
      account: `•••• •••• ${account.slice(-4)}`,
      rawAccount: account,
      ifsc: ifsc.toUpperCase(),
      initials: (firstName[0] || "E").toUpperCase(),
      bgColor: "bg-[#e5eeff]",
      textColor: "text-[#3525cd]",
    },
  };
}

export async function deleteEmployeeAction(employeeId: string) {
  console.log("🚀 [Server Action] deleteEmployeeAction Invoked for ID:", employeeId);

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized access" };
  }

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (orgError || !organization) {
    return { success: false, error: "Organization record missing" };
  }

  const { error: deleteError } = await supabase
    .from("employees")
    .delete()
    .eq("id", employeeId)
    .eq("organization_id", organization.id);

  if (deleteError) {
    console.error("❌ [deleteEmployeeAction] Error deleting employee:", deleteError.message);
    return { success: false, error: `Database Error: ${deleteError.message}` };
  }

  console.log("🎉 [deleteEmployeeAction] Employee deleted from Supabase!");
  revalidatePath("/employees");

  return { success: true, error: null };
}
