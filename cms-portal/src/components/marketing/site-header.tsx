"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  CreditCard,
  ChevronRight,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/executives", label: "Executives" },
  { href: "/blog", label: "Blog" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
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
            className="bg-gradient-to-r from-gold-700 via-gold-600 to-gold-700 text-bg-primary overflow-hidden relative z-50"
          >
            <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm">
              <span className="font-medium">
                📢 2026/2027 Dues Payment Portal is now open!
              </span>
              <Link
                href="/payments"
                className="underline underline-offset-2 hover:no-underline font-semibold"
              >
                Pay Now →
              </Link>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gold-700/50 rounded cursor-pointer"
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
            ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                <GraduationCap size={18} className="text-bg-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-tight text-text-primary group-hover:text-gold-400 transition-colors">
                  COLMANS
                </span>
                <span className="text-[10px] text-text-muted leading-none hidden sm:block">
                  College of Management Sciences
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative px-3 py-2 text-sm rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "text-gold-400"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"
                      }
                    `}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold-500 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/payments"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-bg-primary hover:from-gold-400 hover:to-gold-500 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all duration-300"
              >
                <CreditCard size={14} />
                Pay Dues
              </Link>
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border hover:border-border-hover rounded-lg transition-all duration-200"
              >
                Sign In
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-30 h-full w-80 max-w-[85vw] bg-bg-secondary border-l border-border p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-lg font-bold text-gold-400">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary cursor-pointer"
                >
                  <X size={20} />
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
                        flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all duration-200
                        ${
                          isActive
                            ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                        }
                      `}
                    >
                      {link.label}
                      <ChevronRight size={14} className="text-text-muted" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 space-y-3">
                <Link
                  href="/payments"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-bg-primary shadow-lg shadow-gold-500/20"
                >
                  <CreditCard size={16} />
                  Pay Your Dues
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm text-text-secondary border border-border rounded-lg hover:border-border-hover"
                >
                  Sign In to Portal
                </Link>
              </div>

              {/* Associations */}
              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
                  Associations
                </p>
                <div className="space-y-2">
                  {[
                    { name: "BASA", color: "text-basa" },
                    { name: "NESA", color: "text-nesa" },
                    { name: "MATSA", color: "text-matsa" },
                  ].map((assoc) => (
                    <span
                      key={assoc.name}
                      className={`block text-sm ${assoc.color}`}
                    >
                      {assoc.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
