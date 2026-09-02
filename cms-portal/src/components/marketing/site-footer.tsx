"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MapPin,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const quickLinks = [
  { href: "/about", label: "About COLMANS" },
  { href: "/events", label: "Events & Calendar" },
  { href: "/executives", label: "Executive Council" },
  { href: "/blog", label: "Gazette & News" },
  { href: "/resources", label: "Past Exam Papers" },
  { href: "/contact", label: "Helpdesk & FAQ" },
];

const associations = [
  { name: "BASA", full: "Business Administration", href: "/about#basa" },
  { name: "NESA", full: "Economics Students", href: "/about#nesa" },
  { name: "MATSA", full: "Marketing, Accounting & Tax", href: "/about#matsa" },
];

const portalLinks = [
  { href: "/payments", label: "Pay Collegiate Dues" },
  { href: "/portal", label: "Student Digital ID" },
  { href: "/login", label: "Student & Staff Login" },
  { href: "/admin", label: "Admin Command Center" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        toast.success("Subscribed to COLMANS Dispatch!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Subscription failed.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-[#0A192F] text-slate-300">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0A192F] flex items-center justify-center shadow-lg shadow-slate-950/40">
                <GraduationCap size={20} className="text-[#0A192F]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  COLMANS
                </span>
                <span className="text-[10px] text-blue-200 font-mono leading-none tracking-wider">
                  COLLEGE OF MANAGEMENT SCIENCES
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The official centralized association portal unifying Business
              Administration (BASA), Economics (NESA), and Marketing, Accounting &amp;
              Taxation (MATSA).
            </p>

            {/* Newsletter */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#DDB771]">
                COLMANS Weekly Dispatch
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={15} />
                  <span>You are subscribed to collegiate dispatches.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletter}
                  className="flex items-center gap-2 max-w-sm"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@colmans.edu.ng"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0C2340] border border-blue-900/60 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DDB771]"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-4 py-2.5 rounded-xl bg-[#0F2E54] hover:bg-[#1E3A8A] text-white border border-blue-700/40 text-xs font-bold transition-colors cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubscribing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Join"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#DDB771]">
              Quick Links
            </p>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Associations */}
          <div className="space-y-4">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#DDB771]">
              Associations
            </p>
            <ul className="space-y-3 text-xs">
              {associations.map((assoc) => (
                <li key={assoc.name}>
                  <Link
                    href={assoc.href}
                    className="group block space-y-0.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-white group-hover:text-blue-300">
                      {assoc.name}
                    </span>
                    <p className="text-[11px] text-slate-500">{assoc.full}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Portal & Contact */}
          <div className="space-y-4">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#DDB771]">
              Portal Access
            </p>
            <ul className="space-y-2.5 text-xs">
              {portalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={11} className="text-[#DDB771]" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-[#DDB771]" />
                <span>COLMANS Deanery Complex</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#DDB771]" />
                <span>deanery@colmans.edu.ng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Strip */}
      <div className="border-t border-[#0F2E54] py-6 bg-[#06101E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} College of Management Sciences
            (COLMANS). All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms of Portal Use
            </Link>
            <span className="text-emerald-400 font-mono">
              System Status: 100% Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
