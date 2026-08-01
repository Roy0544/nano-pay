"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return redirect("/login?error=Email+and+password+are+required");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const companyName = formData.get("companyName") as string;

  if (!email || !password) {
    return redirect("/signup?error=Email+and+password+are+required");
  }

  const supabase = await createClient();

  console.log("==================================================");
  console.log("🚀 [signupAction] Attempting Supabase Auth Sign Up for:", email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        company_name: companyName || "My Organization",
      },
    },
  });

  if (error) {
    console.error("❌ [signupAction] Supabase auth.signUp error:", error.message);
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  console.log("✅ [signupAction] Auth user created successfully. User ID:", data?.user?.id);
  console.log("⚡ [signupAction] Organization row created via Postgres trigger on_auth_user_created");
  console.log("==================================================");

  revalidatePath("/", "layout");
  redirect(
    `/signup?message=${encodeURIComponent(
      "Account created! Please check your email inbox and click the verification link to confirm your account."
    )}`
  );
}

export async function signoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
