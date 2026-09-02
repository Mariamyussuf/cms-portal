"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Download,
  TrendingUp,
  Clock,
  Compass,
  QrCode,
} from "lucide-react";

/* ──────────────────────────────────────────────────
   Animated Counter Hook
   ────────────────────────────────────────────────── */

function useCountUp(target: number, durationMs = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { value, ref };
}

/* ──────────────────────────────────────────────────
   Collegiate Portal Executive Dashboard Preview
   ────────────────────────────────────────────────── */

function CollegiatePortalShowcase() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-900/15 via-blue-700/10 to-amber-500/10 rounded-3xl blur-2xl opacity-80 pointer-events-none" />

      {/* Main Glass Stack Container */}
      <div className="relative space-y-4">
        {/* Card 1: Official Student Executive Identity Pass */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-[#0A192F] via-[#0C2340] to-[#06101E] border border-blue-400/30 p-6 text-white shadow-xl shadow-slate-950/20 relative overflow-hidden"
        >
          {/* Subtle gold sheen */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#DDB771]/15 to-transparent rounded-full blur-xl pointer-events-none" />

          {/* Card Top */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0A192F] flex items-center justify-center font-extrabold shadow-md">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="font-display text-base font-extrabold tracking-tight text-white leading-none">
                  COLMANS
                </p>
                <p className="text-[10px] font-mono text-blue-200 uppercase tracking-wider mt-1">
                  COLLEGE OF MANAGEMENT SCIENCES
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#DDB771]/20 text-[#DDB771] border border-[#DDB771]/40">
              OFFICIAL PASS
            </span>
          </div>

          {/* Card Middle: Scholar Identity */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DDB771]">
                Academic Scholar
              </span>
              <p className="font-display text-lg font-bold text-white">
                EXECUTIVE SCHOLAR
              </p>
              <p className="text-xs font-mono text-slate-300">
                MATRIC: BU/20A/0842 &bull; LEVEL 400
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Department
              </span>
              <p className="text-xs font-bold text-blue-200">
                BUSINESS ADMIN
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                <CheckCircle2 size={12} />
                CLEARED
              </span>
            </div>
          </div>

          {/* Card Bottom: Barcode & Key */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono text-[11px] text-blue-200">
              <ShieldCheck size={14} className="text-[#DDB771]" />
              <span>SESSION 2026/2027</span>
            </div>
            <QrCode size={24} className="text-white opacity-80" />
          </div>
        </motion.div>

        {/* Card 2 & 3: Floating Micro Widgets (Exam Papers & Symposium Ticker) */}
        <div className="grid sm:grid-cols-2 gap-3">
          {/* Widget 1: Past Exam Archive Quick Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-blue-50 text-[#0C2340]">
                <FileText size={16} />
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                100L–400L
              </span>
            </div>
            <div>
              <p className="font-display text-xs font-bold text-[#0A192F]">
                Exam Question Vault
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Past papers with solutions
              </p>
            </div>
            <Link
              href="/resources"
              className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0C2340] hover:text-[#1D4ED8]"
            >
              <span>Browse Papers</span>
              <ArrowRight size={12} />
            </Link>
          </motion.div>

          {/* Widget 2: Upcoming Symposia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Calendar size={16} />
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                UPCOMING
              </span>
            </div>
            <div>
              <p className="font-display text-xs font-bold text-[#0A192F] line-clamp-1">
                Annual Policy Colloquium
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Deanery Auditorium &bull; Sept 15
              </p>
            </div>
            <Link
              href="/events"
              className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0C2340] hover:text-[#1D4ED8]"
            >
              <span>Reserve Seat</span>
              <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────
   Main Hero Component
   ────────────────────────────────────────────────── */

const collegiateMetrics = [
  {
    label: "Matriculated Scholars",
    value: 500,
    suffix: "+",
    caption: "Across Business, Economics & Marketing",
  },
  {
    label: "Departmental Bodies",
    value: 3,
    suffix: "",
    caption: "BASA, NESA, and MATSA Councils",
  },
  {
    label: "Annual Conferences & Symposia",
    value: 20,
    suffix: "+",
    caption: "Academic summits, case challenges & debates",
  },
  {
    label: "Corporate & Alumni Placement",
    value: 50,
    suffix: "+",
    caption: "Industry fellows & corporate alumni network",
  },
];

export function Hero() {
  return (
    <section className="relative min-h-[88vh] flex flex-col justify-between overflow-hidden pt-8 pb-16 bg-[#F8FAFC]">
      {/* Subtle Architectural Grid & Atmosphere */}
      <div className="absolute inset-0 architectural-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      {/* Ambient Flare */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[75vw] h-[450px] rounded-full bg-gradient-to-b from-blue-900/10 via-blue-700/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full my-auto py-8 lg:py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Clean & Prestigious Narrative */}
          <div className="lg:col-span-6 space-y-6">
            {/* Academic Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0C2340]/10 border border-[#0C2340]/20 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#0C2340] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-[#0A192F]">
                COLLEGE OF MANAGEMENT SCIENCES
              </span>
              <span className="text-blue-900 font-bold">&bull;</span>
              <span className="text-xs font-mono text-[#0C2340] font-semibold">
                APEX PORTAL
              </span>
            </motion.div>

            {/* Clear, Beautiful Editorial Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-2"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A192F] leading-[1.12]">
                Empowering the Next Generation of{" "}
                <span className="gradient-oxford-text text-glow-oxford">
                  Executive Leaders.
                </span>
              </h1>
            </motion.div>

            {/* Mission Narrative */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base text-slate-600 leading-relaxed max-w-[50ch]"
            >
              The unified collegiate authority coordinating{" "}
              <strong className="text-[#0A192F]">BASA</strong> (Business Administration),{" "}
              <strong className="text-[#0A192F]">NESA</strong> (Economics), and{" "}
              <strong className="text-[#0A192F]">MATSA</strong> (Marketing, Accounting &amp; Taxation).
              Pioneering academic excellence, executive leadership, and corporate mentorship.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="space-y-4 pt-2"
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <Link href="/about" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold rounded-xl bg-[#0C2340] hover:bg-[#0A192F] text-white shadow-md shadow-slate-900/15 hover:shadow-lg transition-all cursor-pointer">
                    <Compass size={15} />
                    <span>Explore College</span>
                    <ArrowRight size={14} />
                  </button>
                </Link>

                <Link href="/resources" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-xs transition-all cursor-pointer">
                    <FileText size={15} className="text-[#0C2340]" />
                    <span>Past Exam Papers</span>
                  </button>
                </Link>

                <Link href="/events" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-xs transition-all cursor-pointer">
                    <Calendar size={15} className="text-[#0C2340]" />
                    <span>Symposia</span>
                  </button>
                </Link>
              </div>

              {/* Quick utility pill links */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <Link
                  href="/executives"
                  className="inline-flex items-center gap-1.5 hover:text-[#0C2340] font-medium"
                >
                  <Users size={13} className="text-[#0C2340]" />
                  Executive Council
                </Link>
                <span>&bull;</span>
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-1.5 hover:text-[#0C2340] font-medium"
                >
                  <GraduationCap size={13} className="text-[#0C2340]" />
                  Digital ID Portal
                </Link>
                <span>&bull;</span>
                <Link
                  href="/payments"
                  className="inline-flex items-center gap-1.5 hover:text-[#0C2340] font-medium"
                >
                  <ShieldCheck size={13} className="text-emerald-700" />
                  Dues Clearance
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Clean Collegiate Portal Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 flex justify-center w-full"
          >
            <CollegiatePortalShowcase />
          </motion.div>
        </div>
      </div>

      {/* Bottom Collegiate Metrics Strip */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full pt-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-8 border-t border-slate-200"
        >
          {collegiateMetrics.map((stat, i) => (
            <MetricBlock key={stat.label} {...stat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MetricBlock({
  label,
  value,
  suffix,
  caption,
  index,
}: {
  label: string;
  value: number;
  suffix: string;
  caption: string;
  index: number;
}) {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-1">
        <span
          ref={ref}
          className="tabular font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight"
        >
          {animated.toLocaleString()}
        </span>
        <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#B89758]">
          {suffix}
        </span>
      </div>

      <p className="text-xs sm:text-sm font-bold text-[#0A192F] mt-1">
        {label}
      </p>
      <p className="text-[11px] text-slate-500 line-clamp-1">
        {caption}
      </p>
    </div>
  );
}
