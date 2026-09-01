"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Lightbulb, Trophy } from "lucide-react";

const showcases = [
  {
    icon: Trophy,
    title: "National Business Plan Winner",
    student: "Adebayo Oluwaseun",
    association: "BASA",
    description:
      "Won first place at the National Business Plan Competition with an innovative fintech solution for SME lending.",
    color: "text-basa",
    bgColor: "bg-basa/10",
  },
  {
    icon: BookOpen,
    title: "Published Economic Research",
    student: "Chinwe Okafor",
    association: "NESA",
    description:
      "Published a peer-reviewed paper on 'Impact of Digital Currency on Nigerian Monetary Policy' in the West African Economic Journal.",
    color: "text-nesa",
    bgColor: "bg-nesa/10",
  },
  {
    icon: Lightbulb,
    title: "Marketing Innovation Award",
    student: "Fatima Abdullahi",
    association: "MATSA",
    description:
      "Designed a viral social media campaign for a local brand that increased their engagement by 300% in 3 months.",
    color: "text-matsa",
    bgColor: "bg-matsa/10",
  },
  {
    icon: Award,
    title: "Best Graduating Student",
    student: "Emmanuel Nwosu",
    association: "BASA",
    description:
      "Graduated with a 4.85 CGPA and received the Dean's Excellence Award for outstanding academic performance.",
    color: "text-gold-400",
    bgColor: "bg-gold-500/10",
  },
];

export function StudentShowcase() {
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
            Achievements
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-text-primary">
            Student Spotlight
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Celebrating the outstanding achievements of students across our three associations.
          </p>
        </motion.div>

        {/* Showcase Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {showcases.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl p-6 bg-bg-card border border-border hover:border-border-hover transition-all duration-300 hover:shadow-[0_0_25px_rgba(184,134,11,0.08)]"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-11 h-11 rounded-lg ${item.bgColor} flex items-center justify-center`}
                >
                  <item.icon size={20} className={item.color} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-gold-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {item.student} ·{" "}
                    <span className={item.color}>{item.association}</span>
                  </p>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
