"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Shield, FileText } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-700/20 via-bg-secondary to-blue-600/10" />
          <div className="absolute inset-0 grain-overlay" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative px-6 sm:px-12 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-display text-3xl sm:text-4xl font-bold text-text-primary"
              >
                Ready to Pay Your{" "}
                <span className="gradient-gold-text">Dues?</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 text-text-secondary text-lg leading-relaxed"
              >
                Pay your COLMANS college dues and association dues securely
                online. Track your payment history and download receipts
                instantly.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary"
              >
                <span className="inline-flex items-center gap-2">
                  <CreditCard size={16} className="text-gold-400" />
                  Secure Paystack checkout
                </span>
                <span className="inline-flex items-center gap-2">
                  <Shield size={16} className="text-gold-400" />
                  Verified transactions
                </span>
                <span className="inline-flex items-center gap-2">
                  <FileText size={16} className="text-gold-400" />
                  Instant receipts
                </span>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10"
              >
                <Link
                  href="/payments"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-bg-primary hover:from-gold-400 hover:to-gold-500 shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300"
                >
                  Go to Payment Portal
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
