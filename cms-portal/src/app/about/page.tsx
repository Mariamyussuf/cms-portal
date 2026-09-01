"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Compass,
  Lightbulb,
  Shield,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const coreValues = [
  {
    icon: Compass,
    title: "Visionary Leadership",
    description:
      "Cultivating strategic executives and analytical minds capable of leading complex institutions with integrity.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Enterprise",
    description:
      "Bridging traditional management disciplines with digital economics, fintech models, and creative brand commerce.",
  },
  {
    icon: Users,
    title: "Collaborative Unity",
    description:
      "Harmonizing three distinct departmental associations under a shared banner of mutual advancement and excellence.",
  },
  {
    icon: Shield,
    title: "Fiscal Integrity",
    description:
      "Instilling rigorous ethical principles in accounting, taxation, resource governance, and corporate management.",
  },
];

const associationProfiles = [
  {
    id: "basa",
    name: "BASA",
    fullName: "Business Administration Students' Association",
    tagline: "Leadership, Strategy & Innovation",
    color: "text-basa",
    borderColor: "border-basa/30",
    bgColor: "bg-basa/5",
    iconBg: "bg-basa/10",
    departments: ["Business Administration"],
    goals: [
      "Develop executive management skills through case studies and simulations",
      "Connect students with corporate executive mentorship networks",
      "Host the annual Business Leadership Summit and Venture Pitch",
    ],
    description:
      "BASA serves as the professional and academic hub for undergraduate and postgraduate students in Business Administration, instilling modern managerial tactics and global corporate agility.",
  },
  {
    id: "nesa",
    name: "NESA",
    fullName: "Nigerian Economics Students' Association",
    tagline: "Economic Insight, Policy & Progress",
    color: "text-nesa",
    borderColor: "border-nesa/30",
    bgColor: "bg-nesa/5",
    iconBg: "bg-nesa/10",
    departments: ["Economics", "Developmental Studies"],
    goals: [
      "Foster quantitative research and econometric modeling capabilities",
      "Organize policy symposiums on macro-fiscal developments in West Africa",
      "Prepare members for central banking, consulting, and multilateral roles",
    ],
    description:
      "NESA is committed to raising critical thinkers and policy analysts who understand national economic structures, financial markets, econometric frameworks, and global trade dynamics.",
  },
  {
    id: "matsa",
    name: "MATSA",
    fullName: "Marketing, Accounting & Taxation Students' Association",
    tagline: "Precision, Creativity & Fiscal Integrity",
    color: "text-matsa",
    borderColor: "border-matsa/30",
    bgColor: "bg-matsa/5",
    iconBg: "bg-matsa/10",
    departments: ["Marketing", "Accounting & Finance", "Taxation"],
    goals: [
      "Equip students with ICAN, ACCA, and CITN certification pathways",
      "Bridge consumer analytics with commercial storytelling and digital branding",
      "Provide practical corporate tax auditing and compliance masterclasses",
    ],
    description:
      "MATSA brings together analytical financial stewards and visionary brand builders. It blends quantitative accounting precision with dynamic marketing intelligence under one united association.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 mesh-gradient border-b border-border overflow-hidden">
          <div className="absolute inset-0 grain-overlay" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <Badge variant="colmans" className="mb-4">
                About The College
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
                A Legacy of{" "}
                <span className="gradient-gold-text">Excellence</span> in
                Management Sciences
              </h1>
              <p className="mt-6 text-lg text-text-secondary leading-relaxed">
                The College of Management Sciences (COLMANS) is the premier
                academic division preparing forward-looking business leaders,
                economists, chartered accountants, and marketing strategists for
                an increasingly interconnected global economy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 sm:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-bg-secondary border border-border p-8 sm:p-10"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6">
                  <Compass size={24} className="text-gold-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Our Mission
                </h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  To provide world-class, technology-driven management and
                  economic education, fostering entrepreneurial mindset,
                  research competence, ethical stewardship, and impactful
                  leadership across public and private spheres.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-bg-secondary border border-border p-8 sm:p-10"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <TrendingUp size={24} className="text-blue-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Our Vision
                </h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  To be globally recognized as a leading center of management
                  sciences scholarship, recognized for producing graduates who
                  pioneer groundbreaking enterprises and formulate sound
                  macroeconomic policies.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Association Profiles */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                Departmental Bodies
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-text-primary">
                The Three Associations
              </h2>
              <p className="mt-4 text-text-secondary">
                Each association represents distinct departments while working
                collaboratively within the COLMANS federation.
              </p>
            </div>

            <div className="space-y-12">
              {associationProfiles.map((assoc, idx) => (
                <motion.div
                  key={assoc.id}
                  id={assoc.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`rounded-2xl border ${assoc.borderColor} ${assoc.bgColor} p-8 sm:p-12`}
                >
                  <div className="grid gap-8 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-lg ${assoc.iconBg} flex items-center justify-center font-bold ${assoc.color}`}
                        >
                          {assoc.name}
                        </div>
                        <div>
                          <h3
                            className={`font-display text-2xl font-bold ${assoc.color}`}
                          >
                            {assoc.fullName}
                          </h3>
                          <p className="text-xs text-text-muted">
                            {assoc.tagline}
                          </p>
                        </div>
                      </div>

                      <p className="text-text-secondary text-sm sm:text-base leading-relaxed mt-4">
                        {assoc.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <span className="text-xs text-text-muted uppercase tracking-wider block w-full mb-1">
                          Departments Covered:
                        </span>
                        {assoc.departments.map((dept) => (
                          <span
                            key={dept}
                            className="px-3 py-1 rounded-md text-xs font-medium bg-bg-secondary border border-border text-text-primary"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-bg-secondary/80 rounded-xl p-6 border border-border">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-text-muted mb-4">
                        Key Strategic Objectives
                      </h4>
                      <ul className="space-y-3">
                        {assoc.goals.map((goal, gIdx) => (
                          <li
                            key={gIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${assoc.color.replace("text-", "bg-")} mt-1.5 shrink-0`}
                            />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 pt-4 border-t border-border flex justify-end">
                        <Link
                          href={`/executives?association=${assoc.name.toLowerCase()}`}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${assoc.color} hover:underline`}
                        >
                          Meet {assoc.name} Executives
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                Guiding Principles
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-text-primary">
                Our Core Values
              </h2>
              <p className="mt-4 text-text-secondary">
                The foundational pillars upon which all academic and
                association activities are conducted.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((val, idx) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-xl bg-bg-card border border-border p-6 hover:border-border-hover transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                    <val.icon size={20} className="text-gold-400" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
              Governance Framework
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-text-primary">
              Organizational Hierarchy
            </h2>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              How the College Central Body interacts with the sub-associations
              and departmental faculties.
            </p>

            <div className="mt-14 max-w-3xl mx-auto">
              {/* Central Box */}
              <div className="rounded-xl bg-gradient-to-r from-gold-900/40 via-bg-secondary to-gold-900/40 border border-gold-500/30 p-6 shadow-lg shadow-gold-500/5">
                <Badge variant="colmans" className="mb-2">
                  Apex Governing Body
                </Badge>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  COLMANS Central Executive Council
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  College Deanery &middot; Central Student Executive Council
                  &middot; Bursary &middot; Academic Advisory
                </p>
              </div>

              {/* Connecting Line */}
              <div className="w-px h-8 bg-border mx-auto" />

              {/* Sub associations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-bg-card border border-basa/30 p-5">
                  <span className="text-xs font-bold text-basa block">
                    BASA
                  </span>
                  <p className="text-xs text-text-primary font-medium mt-1">
                    Business Administration
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Executive Council
                  </p>
                </div>

                <div className="rounded-xl bg-bg-card border border-nesa/30 p-5">
                  <span className="text-xs font-bold text-nesa block">
                    NESA
                  </span>
                  <p className="text-xs text-text-primary font-medium mt-1">
                    Economics
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Executive Council
                  </p>
                </div>

                <div className="rounded-xl bg-bg-card border border-matsa/30 p-5">
                  <span className="text-xs font-bold text-matsa block">
                    MATSA
                  </span>
                  <p className="text-xs text-text-primary font-medium mt-1">
                    Marketing / Accounting / Tax
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Executive Council
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
