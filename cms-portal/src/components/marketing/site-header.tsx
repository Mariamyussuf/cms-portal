"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/executives", label: "Executives" },
  { href: "/blog", label: "Blog" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
  { href: "/payments", label: "Dues" },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0A192F] text-slate-200 overflow-hidden relative z-50 shadow-xs border-b border-[#0F2E54]"
          >
            <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Sparkles size={13} className="text-[#C5A880]" />
                Welcome to the 2026/2027 Academic Session &bull; Discover upcoming events &amp; past question archives
              </span>
              <Link
                href="/resources"
                className="underline underline-offset-4 hover:text-[#C5A880] font-bold text-white transition-colors"
              >
                Access Resources &rarr;
              </Link>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                aria-label="Dismiss announcement"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl border-b border-slate-200 shadow-sm"
            : "bg-white/65 backdrop-blur-md border-b border-slate-200/60"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#0C2340] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-extrabold tracking-tight text-[#0A192F] group-hover:text-[#1D4ED8] transition-colors">
                  COLMANS
                </span>
                <span className="text-[10px] text-slate-500 font-mono leading-none tracking-wider hidden sm:block">
                  COLLEGE OF MANAGEMENT SCIENCES
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 border border-slate-200 rounded-full px-3.5 py-1.5 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200
                      ${
                        isActive
                          ? "text-white bg-[#0C2340] shadow-sm"
                          : "text-slate-600 hover:text-[#0A192F] hover:bg-white"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/portal"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#0C2340] hover:bg-[#0A192F] text-white shadow-md shadow-slate-900/15 hover:shadow-lg transition-all duration-200"
              >
                <GraduationCap size={14} />
                Student Portal
              </Link>

              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0A192F] border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-all duration-200 shadow-2xs"
              >
                Sign In
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white border-l border-slate-200 p-6 lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0C2340] flex items-center justify-center">
                    <GraduationCap size={16} className="text-white" />
                  </div>
                  <span className="font-display text-base font-bold text-[#0A192F]">
                    COLMANS
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${
                          isActive
                            ? "bg-[#0C2340] text-white font-semibold shadow-xs"
                            : "text-slate-600 hover:text-[#0A192F] hover:bg-slate-100"
                        }
                      `}
                    >
                      {link.label}
                      <ChevronRight size={14} className={isActive ? "text-white" : "text-slate-400"} />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                <Link
                  href="/portal"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-xs font-bold rounded-xl bg-[#0C2340] text-white shadow-md"
                >
                  <GraduationCap size={15} />
                  Student Digital ID Portal
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full px-4 py-3 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 bg-white"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
