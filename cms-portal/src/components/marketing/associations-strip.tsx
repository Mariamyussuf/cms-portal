"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const associations = [
  {
    name: "BASA",
    full: "Business Administration Students' Association",
    description:
      "Developing executive strategy, corporate finance understanding, organizational agility, and entrepreneurial vision.",
    color: "text-blue-800",
    badgeBg: "bg-blue-50",
    badgeBorder: "border-blue-200",
    borderColor: "border-slate-200 hover:border-blue-400",
    bgGlow: "hover:shadow-[0_10px_30px_rgba(29,78,216,0.08)]",
    departments: ["Business Administration"],
    members: 180,
  },
  {
    name: "NESA",
    full: "Nigerian Economics Students' Association",
    description:
      "Fostering quantitative economic research, macroeconomic policy debates, and global market analysis.",
    color: "text-emerald-800",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    borderColor: "border-slate-200 hover:border-emerald-400",
    bgGlow: "hover:shadow-[0_10px_30px_rgba(4,120,87,0.08)]",
    departments: ["Economics", "Policy Studies"],
    members: 150,
  },
  {
    name: "MATSA",
    full: "Marketing, Accounting & Taxation Students' Association",
    description:
      "Harmonizing rigorous accounting certifications (ICAN/ACCA) with tax governance and creative digital brand marketing.",
    color: "text-[#0C2340]",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    borderColor: "border-slate-200 hover:border-amber-400",
    bgGlow: "hover:shadow-[0_10px_30px_rgba(184,151,88,0.08)]",
    departments: ["Marketing", "Accounting & Finance", "Taxation"],
    members: 170,
  },
];

export function AssociationsStrip() {
  return (
    <section className="py-24 sm:py-32 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#0C2340] font-bold flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#B89758]" />
            UNDERLYING ACADEMIC BODIES
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A192F]">
            Three Pillars of Academic Leadership.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            COLMANS coordinates three specialized departmental associations, each
            dedicated to distinct professional disciplines while operating under
            the unified collegiate umbrella.
          </p>
        </motion.div>

        {/* Association Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {associations.map((assoc, i) => (
            <motion.div
              key={assoc.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`
                relative group rounded-2xl p-8
                bg-stone-50/70 backdrop-blur-xl
                border ${assoc.borderColor}
                ${assoc.bgGlow}
                transition-all duration-300 flex flex-col justify-between shadow-xs
              `}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${assoc.badgeBg} ${assoc.color} border ${assoc.badgeBorder}`}
                  >
                    {assoc.name}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {assoc.members}+ matriculated
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#0A192F] group-hover:text-[#1D4ED8] transition-colors">
                  {assoc.full}
                </h3>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {assoc.description}
                </p>

                {/* Departments */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {assoc.departments.map((dept) => (
                    <span
                      key={dept}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-700"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Official Council
                </span>
                <Link
                  href={`/about#${assoc.name.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C2340] hover:text-[#1D4ED8] transition-colors"
                >
                  Explore Details
                  <ArrowRight
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
