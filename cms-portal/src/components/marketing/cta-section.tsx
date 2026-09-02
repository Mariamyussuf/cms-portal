"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-[#F8FAFC]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-br from-[#0A192F] via-[#0C2340] to-[#06101E] text-white overflow-hidden shadow-2xl shadow-slate-900/20"
        >
          {/* Subtle background glow inside card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-[#DDB771] border border-white/20 mb-6">
                <GraduationCap size={14} className="text-[#DDB771]" />
                COLLEGIATE EXCELLENCE &bull; SESSION 2026/2027
              </span>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Empowering Scholars. Connecting Leaders.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Access your digital student ID pass, explore the past examination
                paper archive across all departments and levels, reserve seats for
                upcoming collegiate symposia, and manage administrative clearance.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Digital Student ID Card &amp; Barcode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>100–400 Level Past Question Archives</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Collegiate Symposia &amp; Conference Access</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link href="/portal" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold rounded-xl bg-white text-[#0A192F] hover:bg-slate-100 shadow-xl shadow-black/20 transition-all cursor-pointer">
                  <GraduationCap size={16} />
                  <span>Access Student Portal</span>
                  <ArrowRight size={16} />
                </button>
              </Link>

              <Link href="/resources" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white transition-all cursor-pointer">
                  <BookOpen size={16} className="text-[#DDB771]" />
                  <span>Past Exam Papers</span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
