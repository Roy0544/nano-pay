"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Building2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { loginAction, signupAction } from "./actions";

interface AuthPageProps {
  defaultTab: "login" | "signup";
}

function AuthForm({ defaultTab }: AuthPageProps) {
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error");
  const infoMsg = searchParams.get("message");

  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="w-full mx-auto flex rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex-col md:flex-row min-h-[650px] md:h-[85vh] bg-[#090d16] relative">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Left Panel: Brand & Pitch */}
      <section
        className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-cover bg-center border-b md:border-b-0 md:border-r border-slate-800/60 z-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/15 rounded-lg border border-indigo-500/30">
            <img
              alt="Nanopay"
              className="h-6 w-6 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGHe1KVzrBCJLTcQeueHNacDkXtPvJh7dgUxiCV3WTe62IQgzxFDr9XfKmKyXim-dYY7uZ7J6pHt_Xe3UzZ-CU6Qfan_10bdYiUuzhPptDF8GNjAUjIJZUkbh8rPJP-u4fo2ojy9gDhlFxmTOBfZl1BOury03cNZYsSbNHAhrB7XoXsMGDdITVfYaOYWJB0DczbZKLc4s3eQ9AieN8yPBGmFqn2Tpvr9O1rDgtostXMuIBaz3nExJ"
            />
          </div>
          <span className="font-space-grotesk font-bold tracking-tight text-xl text-white">
            Nanopay
          </span>
        </div>

        {/* Pitch Content */}
        <div className="mt-12 md:mt-0 flex-grow flex flex-col justify-center">
          <h1 className="font-space-grotesk text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            Zero-Click <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Automated Payroll
            </span>
          </h1>
          <p className="font-geist text-slate-400 text-sm md:text-base leading-relaxed mb-8">
            Disburse bulk bank deposits securely and dispatch salary slips directly to employees via WhatsApp in one clean pipeline.
          </p>

          {/* Graphical Mockup Preview */}
          <div className="w-full mx-auto aspect-square rounded-xl overflow-hidden bg-slate-900/60 border border-slate-800 flex items-center justify-center p-6 mt-auto shadow-[0_0_50px_rgba(99,102,241,0.15)] relative group hover:border-slate-700/80 transition-all duration-300">
            <div
              className="w-full h-full relative rounded-lg bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOTUmRX2gjXd0taDaYsB_aSku7f0SVYVCJXqkDl0Nb8zk13c_wQJcKEYtSFP1jQKg-dJ9jJgsix3z77T_EuDWZeU4Yqrf4iDpEBUbAPlh32i5adhcWNniNgGlFNQeJZjxPepUkNJywT_TypqDXdwuTrqoc-pdkaGwFITISl3R7sVBUG332GJa0r2iEizzjN6eoO4lLvglipgjIcv3bki0lCVU9gv8M_yhdv9Y3SBiMWd2RzRnpPw73eSPhOOZ8ggvOoaCKlgvwMoY')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Login/Signup High-Contrast Form */}
      <section className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative z-10 bg-[#0c101b]">
        <div className="w-full flex flex-col h-full justify-between space-y-8">
          {/* Segmented Control */}
          <div className="flex self-end bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                window.history.replaceState({}, "", "/login");
              }}
              className={`px-5 py-2 rounded-lg font-medium text-xs md:text-sm transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                window.history.replaceState({}, "", "/signup");
              }}
              className={`px-5 py-2 rounded-lg font-medium text-xs md:text-sm transition-all cursor-pointer ${
                activeTab === "signup"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-grow flex flex-col justify-center">
            <h2 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white mb-2">
              {activeTab === "login" ? "Welcome Back!" : "Register Company"}
            </h2>
            <p className="font-geist text-slate-400 text-xs md:text-sm mb-6">
              {activeTab === "login"
                ? "Enter your credentials to access your dashboard"
                : "Create an account to begin automating your payouts"}
            </p>

            {/* Error Message banner */}
            {errorMsg && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm px-4 py-3 rounded-xl flex items-center gap-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{decodeURIComponent(errorMsg)}</span>
              </div>
            )}

            {/* Verification Success Message banner */}
            {infoMsg && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm px-4 py-3.5 rounded-xl flex items-start gap-3 shadow-lg">
                <CheckCircle2 size={20} className="shrink-0 text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-200 text-sm">Action Required: Verify Email</p>
                  <p className="text-emerald-300/90 text-xs leading-relaxed">{decodeURIComponent(infoMsg)}</p>
                </div>
              </div>
            )}

            <form
              action={activeTab === "login" ? loginAction : signupAction}
              className="space-y-5"
            >
              {/* Company Name (Sign Up only) */}
              {activeTab === "signup" && (
                <div className="space-y-2">
                  <label className="font-geist text-slate-200 font-semibold text-sm block">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2
                      size={20}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                    />
                    <input
                      name="companyName"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-600 bg-white text-slate-900 font-medium placeholder:text-slate-400 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
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
              <div className="space-y-2">
                <label className="font-geist text-slate-200 font-semibold text-sm block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                  />
                  <input
                    name="email"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-600 bg-white text-slate-900 font-medium placeholder:text-slate-400 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                    placeholder="admin@acmecorp.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-geist text-slate-200 font-semibold text-sm block">
                    Password
                  </label>
                  {activeTab === "login" && (
                    <a
                      className="font-geist text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                  />
                  <input
                    name="password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-slate-600 bg-white text-slate-900 font-medium placeholder:text-slate-400 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer z-10"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all mt-6 cursor-pointer text-base"
                type="submit"
              >
                {activeTab === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>

          {/* Footer Toggle */}
          <div className="text-center pt-6 border-t border-slate-900">
            <p className="font-geist text-slate-400 text-xs md:text-sm">
              {activeTab === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setActiveTab("signup");
                      window.history.replaceState({}, "", "/signup");
                    }}
                    className="text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer ml-1"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setActiveTab("login");
                      window.history.replaceState({}, "", "/login");
                    }}
                    className="text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer ml-1"
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
  );
}

export default function AuthPage(props: AuthPageProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-body-md antialiased text-white relative w-full"
      style={{ backgroundColor: "#020617" }}
    >
      <Suspense fallback={<div className="text-slate-400 text-lg">Loading...</div>}>
        <AuthForm {...props} />
      </Suspense>
    </div>
  );
}
