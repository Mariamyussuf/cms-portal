"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

const associations = [
  {
    name: "BASA",
    full: "Business Administration Students' Association",
    description:
      "Empowering future business leaders with the skills, networks, and knowledge to shape industries.",
    color: "basa",
    borderColor: "border-basa/20 hover:border-basa/40",
    bgGlow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
    iconBg: "bg-basa/10",
    textColor: "text-basa",
    departments: ["Business Administration"],
    members: 180,
  },
  {
    name: "NESA",
    full: "Nigerian Economics Students' Association",
    description:
      "Advancing economic literacy and policy awareness through academic discourse and real-world engagement.",
    color: "nesa",
    borderColor: "border-nesa/20 hover:border-nesa/40",
    bgGlow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    iconBg: "bg-nesa/10",
    textColor: "text-nesa",
    departments: ["Economics"],
    members: 150,
  },
  {
    name: "MATSA",
    full: "Marketing, Accounting & Taxation Students' Association",
    description:
      "Bridging creative marketing, financial rigor, and tax expertise into a unified professional community.",
    color: "matsa",
    borderColor: "border-matsa/20 hover:border-matsa/40",
    bgGlow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]",
    iconBg: "bg-matsa/10",
    textColor: "text-matsa",
    departments: ["Marketing", "Accounting", "Taxation"],
    members: 170,
  },
];

export function AssociationsStrip() {
  return (
    <section className="py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Our Associations
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-text-primary">
            Three Pillars of{" "}
            <span className="gradient-gold-text">Excellence</span>
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            COLMANS is the umbrella body overseeing three vibrant departmental
            associations, each dedicated to fostering academic and professional
            growth.
          </p>
        </motion.div>

        {/* Association Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {associations.map((assoc, i) => (
            <motion.div
              key={assoc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`
                relative group
                rounded-xl p-6
                bg-bg-card backdrop-blur-md
                border ${assoc.borderColor}
                ${assoc.bgGlow}
                transition-all duration-300
              `}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg ${assoc.iconBg} flex items-center justify-center mb-5`}
              >
                <Users size={22} className={assoc.textColor} />
              </div>

              {/* Name */}
              <h3 className={`font-display text-xl font-bold ${assoc.textColor}`}>
                {assoc.name}
              </h3>
              <p className="text-xs text-text-muted mt-1">{assoc.full}</p>

              {/* Description */}
              <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                {assoc.description}
              </p>

              {/* Departments */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {assoc.departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-2 py-0.5 rounded text-xs bg-bg-elevated text-text-muted"
                  >
                    {dept}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-text-muted tabular">
                  {assoc.members}+ members
                </span>
                <Link
                  href={`/about#${assoc.name.toLowerCase()}`}
                  className={`inline-flex items-center gap-1 text-xs font-medium ${assoc.textColor} group-hover:underline`}
                >
                  Learn more
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-0.5 transition-transform"
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
