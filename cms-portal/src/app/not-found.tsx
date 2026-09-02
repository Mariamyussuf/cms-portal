"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Home, Compass, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 mesh-gradient relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay" />

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg text-center p-8 rounded-3xl bg-bg-secondary/80 backdrop-blur-xl border border-border shadow-2xl"
      >
        {/* Badge */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-6 text-bg-primary font-bold shadow-lg shadow-gold-500/25">
          <GraduationCap size={28} />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
          Error 404
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mt-2">
          Page Not Located
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
          The collegiate page, department document, or portal resource you are
          looking for has either been relocated or is under administrative
          review.
        </p>

        {/* Action Shortcuts */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home size={15} />}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </Link>

          <Link href="/payments">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<CreditCard size={15} />}
              className="w-full sm:w-auto"
            >
              Payment Portal
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-6 text-xs text-text-muted">
          <Link href="/about" className="hover:text-gold-400 transition-colors">
            About COLMANS
          </Link>
          <span>&middot;</span>
          <Link href="/events" className="hover:text-gold-400 transition-colors">
            Events
          </Link>
          <span>&middot;</span>
          <Link href="/contact" className="hover:text-gold-400 transition-colors">
            Helpdesk
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
