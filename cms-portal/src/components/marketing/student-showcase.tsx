"use client";

import { motion } from "framer-motion";
import { Award, Sparkles, Quote, GraduationCap } from "lucide-react";

const spotlights = [
  {
    name: "Toluwani Adeleke",
    role: "President, BASA (2025/2026)",
    department: "Business Administration, 400L",
    quote:
      "Leading BASA taught me that collegiate leadership is about creating sustainable frameworks for those coming after us. COLMANS provides the central scaffolding that makes individual departments flourish.",
    achievement: "National Business Case Competition Winner",
  },
  {
    name: "Chukwudi Okafor",
    role: "Economics Research Fellow",
    department: "Economics, 300L",
    quote:
      "Through NESA and COLMANS symposiums, I published my first policy review on monetary policy dynamics in emerging markets. The collegiate network opens doors you didn't even know existed.",
    achievement: "Central Bank of Nigeria Youth Policy Finalist",
  },
  {
    name: "Amina Bello",
    role: "Tax & Marketing Lead",
    department: "Marketing / Accounting, 400L",
    quote:
      "The synergy between accounting rigor and creative marketing in MATSA prepared me for my Big 4 internship. Paying dues through the new portal was seamless and gave me instant clearance.",
    achievement: "KPMG Early Career Insight Fellow",
  },
];

export function StudentShowcase() {
  return (
    <section className="py-24 sm:py-32 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#0C2340] font-bold flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#B89758]" />
            SCHOLAR VOICES
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A192F]">
            Excellence Across Disciplines.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Hear from exceptional student leaders and scholars navigating
            career breakthroughs through the College of Management Sciences.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {spotlights.map((student, i) => (
            <motion.div
              key={student.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl p-8 bg-stone-50/70 border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <Quote size={28} className="text-blue-900/20 mb-4" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{student.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-[#0A192F]">
                    {student.name}
                  </h3>
                  <span className="p-1 rounded-md bg-blue-100 text-blue-900">
                    <GraduationCap size={15} />
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-[#0C2340]">{student.role}</p>
                <p className="text-[11px] text-slate-500">
                  {student.department}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-[#0C2340] font-bold">
                  <Award size={12} className="text-[#B89758]" />
                  <span>{student.achievement}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
