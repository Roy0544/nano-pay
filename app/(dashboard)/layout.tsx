"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/employees", label: "Employees", icon: "group" },
    { href: "/payroll", label: "Payroll Runs", icon: "payments" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ];

  const handleStartPayroll = () => {
    router.push("/payroll/start");
  };

  return (
    <div className="min-h-screen flex bg-background text-on-background">
      {/* Sidebar - Desktop */}
      <nav className="bg-surface border-r border-outline-variant h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col py-lg px-md z-40">
        {/* Brand */}
        <div className="flex items-center gap-sm mb-xl">
          <img
            alt="Nanopay"
            className="h-8 w-8 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGHe1KVzrBCJLTcQeueHNacDkXtPvJh7dgUxiCV3WTe62IQgzxFDr9XfKmKyXim-dYY7uZ7J6pHt_Xe3UzZ-CU6Qfan_10bdYiUuzhPptDF8GNjAUjIJZUkbh8rPJP-u4fo2ojy9gDhlFxmTOBfZl1BOury03cNZYsSbNHAhrB7XoXsMGDdITVfYaOYWJB0DczbZKLc4s3eQ9AieN8yPBGmFqn2Tpvr9O1rDgtostXMuIBaz3nExJ"
          />
          <span className="text-h3 font-h3 text-primary tracking-tight font-bold">
            Nanopay
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-xs">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-sm px-sm py-sm rounded-lg transition-all ${
                  isActive
                    ? "text-primary font-bold bg-primary-fixed"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {link.icon}
                </span>
                <span className="font-body-md text-body-md">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Widget */}
        <div className="mt-auto pt-md border-t border-outline-variant">
          <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-sm flex flex-col gap-xs mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Available Balance
            </span>
            <div className="flex items-center gap-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="font-h3 text-h3 text-on-surface font-semibold">
                ₹1,50,000
              </span>
            </div>
          </div>
          <Link
            href="#"
            className="flex items-center gap-sm px-sm py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-200 rounded-lg"
          >
            <span className="material-symbols-outlined">help_outline</span>
            <span className="font-body-md text-body-md">Support</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-on-background/40 backdrop-blur-[2px] z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <nav
        className={`bg-surface border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col py-lg px-md z-50 md:hidden transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-xl">
          <div className="flex items-center gap-sm">
            <img
              alt="Nanopay"
              className="h-8 w-8 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvGHe1KVzrBCJLTcQeueHNacDkXtPvJh7dgUxiCV3WTe62IQgzxFDr9XfKmKyXim-dYY7uZ7J6pHt_Xe3UzZ-CU6Qfan_10bdYiUuzhPptDF8GNjAUjIJZUkbh8rPJP-u4fo2ojy9gDhlFxmTOBfZl1BOury03cNZYsSbNHAhrB7XoXsMGDdITVfYaOYWJB0DczbZKLc4s3eQ9AieN8yPBGmFqn2Tpvr9O1rDgtostXMuIBaz3nExJ"
            />
            <span className="text-h3 font-h3 text-primary tracking-tight font-bold">
              Nanopay
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-xs">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-sm px-sm py-sm rounded-lg transition-all ${
                  isActive
                    ? "text-primary font-bold bg-primary-fixed"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {link.icon}
                </span>
                <span className="font-body-md text-body-md">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-md border-t border-outline-variant">
          <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant shadow-sm flex flex-col gap-xs mb-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Available Balance
            </span>
            <div className="flex items-center gap-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="font-h3 text-h3 text-on-surface font-semibold">
                ₹1,50,000
              </span>
            </div>
          </div>
          <Link
            href="#"
            className="flex items-center gap-sm px-sm py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors duration-200 rounded-lg"
          >
            <span className="material-symbols-outlined">help_outline</span>
            <span className="font-body-md text-body-md">Support</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center px-gutter py-md sticky top-0 z-30">
          <div className="flex items-center gap-md">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-h2 text-h2 text-on-surface text-lg md:text-2xl font-bold">
              Good morning, Acme Corp
            </h1>
          </div>
          <div className="flex items-center gap-md">
            <button className="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-surface-container">
              notifications
            </button>
            <button className="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-surface-container">
              account_circle
            </button>

            {/* Dark Mode Toggle Button */}
            {mounted ? (
              <button
                onClick={toggleDarkMode}
                className="text-on-surface-variant hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-surface-container cursor-pointer flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}

            <button
              onClick={handleStartPayroll}
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-md py-sm rounded-lg shadow-sm inner-shadow-subtle transition-all flex items-center gap-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Start New Payroll
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 bg-surface-bright">{children}</main>
      </div>
    </div>
  );
}
