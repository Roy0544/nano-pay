"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, ArrowRight, Check, Play, ChevronDown, MessageSquare, Shield, Zap, FileSpreadsheet } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

export default function LandingPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the Excel upload work?",
      a: "Simply export your attendance or work hours report from any HR software (or use our template), map the columns once, and Nanopay will automatically compute basic pay, overtime, and allowances.",
    },
    {
      q: "Is it secure to connect my RazorpayX wallet?",
      a: "Yes, Nanopay uses industry-standard 256-bit encryption and strictly routes payouts through Razorpay's secure bank-grade APIs. We never store your transaction PINs or credentials directly.",
    },
    {
      q: "How are WhatsApp salary slips sent?",
      a: "Once Razorpay confirms a payout as successful, our system automatically generates a digitally signed PDF slip and sends it directly to the employee's registered mobile number via WhatsApp Business APIs.",
    },
    {
      q: "What happens if a payout fails?",
      a: "In case of a bank failure or network timeout, the status is immediately flagged in the dashboard. No money leaves your wallet, and we check idempotency constraints to ensure you never double-pay.",
    },
  ];

  return (
    <div className={`${spaceGrotesk.variable} min-h-screen bg-background text-on-background transition-colors duration-300 font-geist`}>
      {/* 1. Header (Company Logo + Sticky Nav) */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant py-4 px-gutter flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            alt="Nanopay"
            className="h-8 w-8 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGHe1KVzrBCJLTcQeueHNacDkXtPvJh7dgUxiCV3WTe62IQgzxFDr9XfKmKyXim-dYY7uZ7J6pHt_Xe3UzZ-CU6Qfan_10bdYiUuzhPptDF8GNjAUjIJZUkbh8rPJP-u4fo2ojy9gDhlFxmTOBfZl1BOury03cNZYsSbNHAhrB7XoXsMGDdITVfYaOYWJB0DczbZKLc4s3eQ9AieN8yPBGmFqn2Tpvr9O1rDgtostXMuIBaz3nExJ"
          />
          <span className="font-space-grotesk font-bold tracking-tight text-xl text-primary">
            Nanopay
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-lg">
          <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Features</a>
          <a href="#testimonials" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">Testimonials</a>
          <a href="#faq" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">FAQ</a>
        </nav>

        {/* CTA & Theme Toggles */}
        <div className="hidden md:flex items-center gap-md">
          {mounted && (
            <button
              onClick={toggleDarkMode}
              className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <Link
            href="/login"
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium px-md py-sm"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-primary hover:opacity-90 text-on-primary text-sm font-medium px-md py-sm rounded-lg shadow-sm transition-all"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-sm">
          {mounted && (
            <button
              onClick={toggleDarkMode}
              className="text-on-surface-variant p-2 rounded-full cursor-pointer"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-40 md:hidden flex flex-col justify-center p-8 space-y-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-2xl font-bold text-center hover:text-indigo-400"
          >
            Features
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-2xl font-bold text-center hover:text-indigo-400"
          >
            Testimonials
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-2xl font-bold text-center hover:text-indigo-400"
          >
            FAQ
          </a>
          <div className="h-px bg-white/10 w-full my-4" />
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-xl text-center font-medium"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl text-center font-bold py-3 rounded-lg shadow-md"
          >
            Start Free
          </Link>
        </div>
      )}

      {/* 2. Hero Section (Title + Subtitle + CTA + Social Proof) */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 px-gutter overflow-hidden flex flex-col items-center text-center">
        {/* Abstract Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* Tagline */}
        <div className="z-10 bg-primary-fixed text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 flex items-center gap-xs">
          <Zap size={14} /> One-Click Bank Payouts & Payslips
        </div>

        {/* 3. SEO-Optimized Title and Subtitle */}
        <h1 className="z-10 font-space-grotesk text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-surface leading-tight max-w-4xl mb-6">
          The Automated Payroll Platform for <span className="text-primary">Growing SMBs</span>
        </h1>
        <p className="z-10 font-geist text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-10">
          Upload monthly attendance, review calculated payouts, and trigger bank transfers directly. Salary slips are automatically generated and sent to employees via WhatsApp.
        </p>

        {/* 4. Primary CTA */}
        <div className="z-10 flex flex-col sm:flex-row items-center gap-md mb-12">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-primary hover:opacity-90 text-on-primary font-bold text-base px-xl py-md rounded-xl shadow-lg transition-all flex items-center justify-center gap-xs group active:scale-95"
          >
            Get Started Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto text-on-surface-variant hover:text-primary bg-surface-container border border-outline-variant px-xl py-md rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-xs"
          >
            <Play size={16} fill="currentColor" /> Watch 2-Min Demo
          </a>
        </div>

        {/* 5. Social Proof */}
        <div className="z-10 flex flex-col items-center gap-md">
          <div className="flex items-center gap-sm">
            {/* Avatars */}
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
              ].map((src, i) => (
                <img
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                  src={src}
                  alt="Customer"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center text-amber-500">
                <span className="material-symbols-outlined fill text-sm">star</span>
                <span className="material-symbols-outlined fill text-sm">star</span>
                <span className="material-symbols-outlined fill text-sm">star</span>
                <span className="material-symbols-outlined fill text-sm">star</span>
                <span className="material-symbols-outlined fill text-sm">star</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">Trusted by 500+ Indian businesses</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-lg mt-4 opacity-50 select-none">
            <span className="font-bold text-lg">RazorpayX</span>
            <span className="font-bold text-lg">WhatsApp API</span>
            <span className="font-bold text-lg">Acme Corp</span>
            <span className="font-bold text-lg">Vercel</span>
          </div>
        </div>
      </section>

      {/* 6. Media Section (Dashboard Mockup) */}
      <section id="demo" className="px-gutter pb-24 flex justify-center">
        <div className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant bg-surface-container p-2 md:p-4">
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none z-10"></div>
          {/* Custom Styled Mockup containing typical dashboard stats */}
          <div className="w-full h-full bg-[#f8f9ff] dark:bg-[#111827] rounded-xl flex flex-col overflow-hidden border border-outline-variant/30">
            {/* Mock Header */}
            <div className="border-b border-outline-variant/20 px-md py-sm bg-surface-container-lowest flex justify-between items-center">
              <div className="flex items-center gap-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <div className="text-xs text-on-surface-variant/80 font-medium">dashboard.nanopay.in</div>
              <div className="w-6"></div>
            </div>
            {/* Mock Dashboard Page Content */}
            <div className="flex-1 p-md md:p-lg space-y-md overflow-hidden">
              {/* Heading */}
              <div className="flex justify-between items-center">
                <div className="h-6 w-32 bg-primary/20 rounded-md"></div>
                <div className="h-8 w-24 bg-primary rounded-md"></div>
              </div>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-3 gap-sm">
                <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant/30 space-y-xs">
                  <div className="h-3 w-16 bg-on-surface-variant/20 rounded"></div>
                  <div className="h-6 w-24 bg-on-surface/80 rounded"></div>
                </div>
                <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant/30 space-y-xs">
                  <div className="h-3 w-20 bg-on-surface-variant/20 rounded"></div>
                  <div className="h-6 w-20 bg-on-surface/80 rounded"></div>
                </div>
                <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant/30 space-y-xs">
                  <div className="h-3 w-16 bg-on-surface-variant/20 rounded"></div>
                  <div className="h-6 w-28 bg-green-500/20 rounded"></div>
                </div>
              </div>
              {/* Main table mockup */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden flex-grow flex flex-col">
                <div className="border-b border-outline-variant/20 bg-surface-container-low px-md py-sm flex justify-between">
                  <div className="h-3 w-20 bg-on-surface/50 rounded"></div>
                  <div className="h-3 w-20 bg-on-surface/50 rounded"></div>
                  <div className="h-3 w-12 bg-on-surface/50 rounded"></div>
                </div>
                <div className="divide-y divide-outline-variant/10 flex-1">
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="px-md py-md flex justify-between items-center">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-xs">E{row}</div>
                        <div className="space-y-1">
                          <div className="h-3.5 w-24 bg-on-surface rounded"></div>
                          <div className="h-2.5 w-16 bg-on-surface-variant/40 rounded"></div>
                        </div>
                      </div>
                      <div className="h-3.5 w-16 bg-on-surface rounded"></div>
                      <div className="h-5 w-16 bg-green-500/20 text-green-700 text-[10px] font-bold rounded flex items-center justify-center">Paid</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Core Benefits/Features (Bento-Grid style) */}
      <section id="features" className="py-20 bg-surface-container-low px-gutter">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold tracking-tight text-on-surface">
              Built for Fast and Secure Operations
            </h2>
            <p className="font-geist text-on-surface-variant text-base md:text-lg">
              Say goodbye to messy manual processing. Nanopay connects ingestion, banking integrations, and receipt delivery in a single pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {/* Feature 1 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-64">
              <div className="bg-primary-fixed text-primary p-3 rounded-lg w-max mb-6">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h3 className="font-space-grotesk text-lg font-bold mb-2">Excel Ingestion</h3>
                <p className="text-sm text-on-surface-variant">
                  Upload employee sheets directly. Map custom columns to payroll values with automatic parsing validation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-64">
              <div className="bg-primary-fixed text-primary p-3 rounded-lg w-max mb-6">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-space-grotesk text-lg font-bold mb-2">Bulk Payout Engine</h3>
                <p className="text-sm text-on-surface-variant">
                  Integrated directly with RazorpayX. Trigger batch payouts to multiple employee bank accounts in under 10 seconds.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-64">
              <div className="bg-primary-fixed text-primary p-3 rounded-lg w-max mb-6">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="font-space-grotesk text-lg font-bold mb-2">WhatsApp Payslips</h3>
                <p className="text-sm text-on-surface-variant">
                  Never manually email a payslip again. System dispatches PDF salary receipts via WhatsApp automatically upon successful payment.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-64 lg:col-span-2">
              <div className="bg-primary-fixed text-primary p-3 rounded-lg w-max mb-6">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-space-grotesk text-lg font-bold mb-2">Zero Double-Payouts & Pre-Flight Checks</h3>
                <p className="text-sm text-on-surface-variant">
                  Our system performs real-time wallet balance validations before initiating bank requests, and enforces strict db idempotency filters to prevent double disbursements.
                </p>
              </div>
            </div>

            {/* Accent graphic card */}
            <div className="bg-gradient-to-br from-primary to-[#4f46e5] text-on-primary p-8 rounded-xl shadow-md flex flex-col justify-between h-64">
              <div className="font-space-grotesk text-3xl font-bold tracking-tight">10x</div>
              <div>
                <h3 className="font-space-grotesk text-lg font-bold mb-1">Time Saved</h3>
                <p className="text-xs text-on-primary/80">
                  Reduce the manual payroll overhead from 3 days to less than 15 minutes each month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials */}
      <section id="testimonials" className="py-20 px-gutter">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold tracking-tight text-on-surface">
              Loved by Small Business Owners
            </h2>
            <p className="font-geist text-on-surface-variant text-base">
              Here is what founders and factory managers are saying about their payroll transition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Testimonial 1 */}
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/60 flex flex-col justify-between space-y-6">
              <p className="font-geist text-sm text-on-surface italic leading-relaxed">
                "Connecting RazorpayX and automated WhatsApp slips completely changed my work weeks. We disburse salaries to 45 staff members in 2 minutes now!"
              </p>
              <div className="flex items-center gap-sm">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
                  alt="Reviewer"
                />
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Ananya Sen</h4>
                  <span className="text-xs text-on-surface-variant">Founder, Sen Design Studio</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/60 flex flex-col justify-between space-y-6">
              <p className="font-geist text-sm text-on-surface italic leading-relaxed">
                "Our employees look forward to the WhatsApp payslip every month. The Excel attendance upload handles mapping automatically, saving hours."
              </p>
              <div className="flex items-center gap-sm">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
                  alt="Reviewer"
                />
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Rajesh Kumar</h4>
                  <span className="text-xs text-on-surface-variant">Operations Lead, Kumar Garments</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/60 flex flex-col justify-between space-y-6">
              <p className="font-geist text-sm text-on-surface italic leading-relaxed">
                "The wallet balance checks and db constraints gave us huge confidence. We had duplicate request bugs in other custom software, but zero issues here."
              </p>
              <div className="flex items-center gap-sm">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
                  alt="Reviewer"
                />
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Meera Nair</h4>
                  <span className="text-xs text-on-surface-variant">HR Director, Apex Web Agency</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section id="faq" className="py-20 bg-surface-container-low px-gutter">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-space-grotesk text-3xl font-bold tracking-tight text-on-surface">
              Frequently Asked Questions
            </h2>
            <p className="font-geist text-on-surface-variant text-sm md:text-base">
              Everything you need to know about our automated fintech payroll engine.
            </p>
          </div>

          <div className="divide-y divide-outline-variant border-t border-b border-outline-variant">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex justify-between items-center text-left py-2 hover:text-primary transition-colors cursor-pointer group"
                >
                  <span className="font-space-grotesk font-bold text-base md:text-lg text-on-surface">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-on-surface-variant group-hover:text-primary transition-transform duration-200 ${
                      activeFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFaq === i ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="font-geist text-sm md:text-base text-on-surface-variant leading-relaxed pb-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="py-20 px-gutter bg-background flex justify-center">
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden relative bg-gradient-to-br from-primary to-[#4f46e5] text-on-primary p-8 md:p-16 shadow-xl flex flex-col md:flex-row justify-between items-center gap-lg">
          {/* Urgency background elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

          <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
            <h2 className="font-space-grotesk text-3xl md:text-5xl font-bold tracking-tight">
              Ready to Accelerate Your Payroll?
            </h2>
            <p className="font-geist text-on-primary/80 text-sm md:text-base">
              Join hundreds of other founders who converted their payouts workflow to one click. Set up is free and takes less than 10 minutes.
            </p>
          </div>

          <div className="z-10 w-full md:w-auto flex flex-col items-center gap-sm">
            <Link
              href="/signup"
              className="w-full md:w-auto bg-white text-primary font-bold text-base px-xl py-md rounded-xl shadow-lg hover:bg-white/90 transition-all text-center flex items-center justify-center gap-xs active:scale-95 cursor-pointer"
            >
              Get Started for Free
              <ArrowRight size={18} />
            </Link>
            <span className="text-xs text-on-primary/70">No credit card required. Cancel anytime.</span>
          </div>
        </div>
      </section>

      {/* 11. Footer (Contact + Legal links) */}
      <footer className="bg-surface border-t border-outline-variant py-12 px-gutter text-on-surface-variant">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg mb-12">
          {/* Logo Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                alt="Nanopay Logo"
                className="h-8 w-8 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGHe1KVzrBCJLTcQeueHNacDkXtPvJh7dgUxiCV3WTe62IQgzxFDr9XfKmKyXim-dYY7uZ7J6pHt_Xe3UzZ-CU6Qfan_10bdYiUuzhPptDF8GNjAUjIJZUkbh8rPJP-u4fo2ojy9gDhlFxmTOBfZl1BOury03cNZYsSbNHAhrB7XoXsMGDdITVfYaOYWJB0DczbZKLc4s3eQ9AieN8yPBGmFqn2Tpvr9O1rDgtostXMuIBaz3nExJ"
              />
              <span className="font-space-grotesk font-bold tracking-tight text-lg text-primary">
                Nanopay
              </span>
            </div>
            <p className="font-geist text-xs leading-relaxed max-w-xs">
              Automated financial tools helping modern startups and agencies manage payroll, payouts, and compliance at the speed of light.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-3">
            <h4 className="font-space-grotesk font-bold text-sm text-on-surface">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Wallet Check</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-3">
            <h4 className="font-space-grotesk font-bold text-sm text-on-surface">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">RazorpayX Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Contact info column */}
          <div className="space-y-3">
            <h4 className="font-space-grotesk font-bold text-sm text-on-surface">Contact</h4>
            <ul className="space-y-2 text-xs leading-relaxed">
              <li>support@nanopay.in</li>
              <li>Bengaluru, Karnataka, India</li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="text-xs">&copy; {new Date().getFullYear()} Nanopay Technologies. All rights reserved.</span>
          <div className="flex gap-md text-xs">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
