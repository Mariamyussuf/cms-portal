"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Globe,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

interface Executive {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
  socialLinks: string | null;
  association?: {
    name: string;
    fullName: string;
  } | null;
}

export default function ExecutivesPage() {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExecutives() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeTab !== "all") params.set("association", activeTab);

        const res = await fetch(`/api/executives?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setExecutives(data.executives || []);
        }
      } catch (err) {
        console.error("Failed to load executives:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadExecutives();
  }, [activeTab]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Header */}
        <section className="relative py-16 sm:py-24 mesh-gradient border-b border-border">
          <div className="absolute inset-0 grain-overlay" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <Badge variant="colmans" className="mb-4">
              Student Leadership
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
              Executive Council
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              Meet the elected student leaders driving policy, advocacy,
              academic advancement, and campus activities across our
              associations.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Association Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-border">
              {[
                { id: "all", label: "All Executives" },
                { id: "BASA", label: "BASA Executives" },
                { id: "NESA", label: "NESA Executives" },
                { id: "MATSA", label: "MATSA Executives" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                    ${
                      activeTab === tab.id
                        ? "bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20"
                        : "bg-bg-secondary text-text-secondary border border-border hover:border-border-hover hover:text-text-primary"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="min-h-[30vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-gold-400" size={32} />
              </div>
            ) : executives.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-bg-secondary border border-border p-8">
                <User size={48} className="text-text-muted mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  No Executive Profiles Found
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Profiles will appear here once registered by the administrator.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {executives.map((exec, i) => {
                  const assocName = exec.association?.name || "COLMANS";
                  const assocVariant =
                    assocName === "BASA"
                      ? "basa"
                      : assocName === "NESA"
                        ? "nesa"
                        : assocName === "MATSA"
                          ? "matsa"
                          : "colmans";

                  return (
                    <motion.div
                      key={exec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="rounded-2xl bg-bg-card border border-border overflow-hidden hover:border-border-hover hover:shadow-[0_0_25px_rgba(184,134,11,0.08)] transition-all group"
                    >
                      {/* Photo or Placeholder */}
                      <div className="h-56 bg-gradient-to-b from-bg-tertiary to-bg-secondary flex items-center justify-center border-b border-border relative overflow-hidden">
                        {exec.photoUrl ? (
                          <img
                            src={exec.photoUrl}
                            alt={exec.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-muted">
                            <User size={48} />
                          </div>
                        )}

                        <div className="absolute top-3 right-3">
                          <Badge variant={assocVariant} dot>
                            {assocName}
                          </Badge>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                          {exec.position}
                        </p>
                        <h3 className="font-display text-lg font-bold text-text-primary mt-1">
                          {exec.name}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                          {exec.association?.fullName || "College Executive"}
                        </p>

                        {/* Social Links */}
                        <div className="mt-5 pt-4 border-t border-border flex items-center gap-3 text-text-muted">
                          <span className="p-1.5 rounded-lg bg-bg-elevated hover:text-gold-400 transition-colors cursor-pointer" title="Email Executive">
                            <Mail size={14} />
                          </span>
                          <span className="p-1.5 rounded-lg bg-bg-elevated hover:text-gold-400 transition-colors cursor-pointer" title="Profile">
                            <Globe size={14} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
