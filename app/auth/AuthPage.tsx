"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";

interface AuthPageProps {
  defaultTab: "login" | "signup";
}

export default function AuthPage({ defaultTab }: AuthPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "login") {
      alert(`Welcome back! Logging in as ${email}`);
    } else {
      alert(`Account created successfully for ${companyName}!`);
    }
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-body-md antialiased text-white"
      style={{ backgroundColor: "#050b14" }}
    >
      <main className="w-full max-w-5xl mx-auto flex rounded-xl overflow-hidden shadow-2xl border border-outline/10 flex-col md:flex-row min-h-[600px] md:h-[80vh] bg-[#0f172a] relative">
        {/* Left Panel: Pitch */}
        <section
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(5, 11, 20, 0.95) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(5, 11, 20, 0.95) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        >
          {/* Glow Accents */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px]"></div>
          </div>

          {/* Brand */}
          <div className="flex items-center gap-3 z-10">
            <img
              alt="Nanopay"
              className="h-8 w-8 object-contain bg-[#0f172a]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGHe1KVzrBCJLTcQeueHNacDkXtPvJh7dgUxiCV3WTe62IQgzxFDr9XfKmKyXim-dYY7uZ7J6pHt_Xe3UzZ-CU6Qfan_10bdYiUuzhPptDF8GNjAUjIJZUkbh8rPJP-u4fo2ojy9gDhlFxmTOBfZl1BOury03cNZYsSbNHAhrB7XoXsMGDdITVfYaOYWJB0DczbZKLc4s3eQ9AieN8yPBGmFqn2Tpvr9O1rDgtostXMuIBaz3nExJ"
            />
            <span className="font-headline-lg text-white font-bold tracking-tight text-xl">
              Nanopay
            </span>
          </div>

          {/* Pitch Content */}
          <div className="z-10 mt-12 md:mt-0 flex-grow flex flex-col justify-center">
            <h1 className="font-headline-xl text-white mb-4 leading-tight text-3xl font-bold tracking-tight">
              Automated Payroll <br /> & Disbursements.
            </h1>
            <p className="font-body-md text-white/70 max-w-sm mb-8 text-sm md:text-base leading-relaxed">
              Disburse direct bank deposits, plan runs, and distribute payslips via WhatsApp with one simple click.
            </p>

            {/* Neon Illustration Container */}
            <div className="w-full max-w-xs mx-auto aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-6 mt-auto shadow-[0_0_40px_rgba(99,102,241,0.1)]">
              <div
                className="w-full h-full relative rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOTUmRX2gjXd0taDaYsB_aSku7f0SVYVCJXqkDl0Nb8zk13c_wQJcKEYtSFP1jQKg-dJ9jJgsix3z77T_EuDWZeU4Yqrf4iDpEBUbAPlh32i5adhcWNniNgGlFNQeJZjxPepUkNJywT_TypqDXdwuTrqoc-pdkaGwFITISl3R7sVBUG332GJa0r2iEizzjN6eoO4lLvglipgjIcv3bki0lCVU9gv8M_yhdv9Y3SBiMWd2RzRnpPw73eSPhOOZ8ggvOoaCKlgvwMoY')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Forms */}
        <section className="w-full md:w-1/2 bg-[#f8f9ff] text-[#0b1c30] p-8 md:p-12 flex flex-col justify-between relative z-20 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
          <div className="w-full max-w-md mx-auto flex flex-col h-full justify-between">
            {/* Segmented Control */}
            <div className="flex self-end bg-[#e5eeff] rounded-lg p-1 mb-8">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-all cursor-pointer ${
                  activeTab === "login"
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#5c647a] hover:bg-white/40"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={`px-6 py-2 rounded-md font-medium text-sm transition-all cursor-pointer ${
                  activeTab === "signup"
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#5c647a] hover:bg-white/40"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="flex-grow flex flex-col justify-center">
              <h2 className="font-h2 text-h2 text-on-surface mb-6 font-bold text-2xl">
                {activeTab === "login" ? "Welcome Back!" : "Get Started Today"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company Name (Sign Up only) */}
                {activeTab === "signup" && (
                  <div className="space-y-1">
                    <label className="font-body-sm text-on-surface font-medium text-sm block">
                      Company Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-[20px]">
                        domain
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#c7c4d8] bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md text-on-surface placeholder:text-[#777587]/60"
                        placeholder="Acme Corp"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="font-body-sm text-on-surface font-medium text-sm block">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-[20px]">
                      person
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#c7c4d8] bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md text-on-surface placeholder:text-[#777587]/60"
                      placeholder="admin@acmecorp.com"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="font-body-sm text-on-surface font-medium text-sm block">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-[20px]">
                      lock
                    </span>
                    <input
                      className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-[#c7c4d8] bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md text-on-surface placeholder:text-[#777587]/60"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777587] hover:text-on-surface transition-colors cursor-pointer"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {activeTab === "login" && (
                    <div className="flex justify-end mt-1">
                      <a
                        className="font-body-sm text-[#3525cd] hover:underline text-xs"
                        href="#"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  className="w-full bg-primary text-on-primary py-3 rounded-lg font-button hover:opacity-90 transition-opacity shadow-sm mt-4 cursor-pointer font-medium"
                  type="submit"
                >
                  {activeTab === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-[#c7c4d8]/50">
              <p className="font-body-sm text-[#5c647a] text-sm">
                {activeTab === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("signup")}
                      className="text-primary font-medium hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-primary font-medium hover:underline cursor-pointer"
                    >
                      Log In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
