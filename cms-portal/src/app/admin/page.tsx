"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  Users,
  Calendar,
  BookOpen,
  FileText,
  Mail,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

interface AdminStats {
  totalStudents: number;
  totalRevenueKobo: number;
  successfulPaymentsCount: number;
  totalEvents: number;
  totalPosts: number;
  totalResources: number;
  totalSubscribers: number;
  unreadMessages: number;
}

interface RecentPayment {
  id: string;
  reference: string;
  amountKobo: number;
  status: string;
  feeType: string | null;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
    matricNumber: string;
  };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentPayments(data.recentPayments || []);
        }
      } catch (err) {
        console.error("Failed to load admin overview:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time analytics, bursary collections, and departmental content
            operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/payments">
            <Button variant="primary" size="sm" leftIcon={<CreditCard size={14} />}>
              Record Payment
            </Button>
          </Link>
          <Link href="/admin/events">
            <Button variant="secondary" size="sm" leftIcon={<Calendar size={14} />}>
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gold-400" size={32} />
        </div>
      ) : (
        <>
          {/* KPI Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-bg-card border border-border p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  Total Dues Collected
                </span>
                <span className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400">
                  <TrendingUp size={16} />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-text-primary tabular">
                {stats ? formatKobo(stats.totalRevenueKobo) : "₦0"}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                {stats?.successfulPaymentsCount || 0} completed transactions
              </p>
            </div>

            <div className="rounded-xl bg-bg-card border border-border p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  Registered Students
                </span>
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Users size={16} />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-text-primary tabular">
                {stats?.totalStudents || 0}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                Across BASA, NESA, MATSA
              </p>
            </div>

            <div className="rounded-xl bg-bg-card border border-border p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  Active Events
                </span>
                <span className="w-8 h-8 rounded-lg bg-nesa/10 flex items-center justify-center text-nesa">
                  <Calendar size={16} />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-text-primary tabular">
                {stats?.totalEvents || 0}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                College &amp; sub-associations
              </p>
            </div>

            <div className="rounded-xl bg-bg-card border border-border p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  Unread Inquiries
                </span>
                <span className="w-8 h-8 rounded-lg bg-matsa/10 flex items-center justify-center text-matsa">
                  <Mail size={16} />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-text-primary tabular">
                {stats?.unreadMessages || 0}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                {stats?.totalSubscribers || 0} newsletter subscribers
              </p>
            </div>
          </div>

          {/* Quick Manager Hub & Recent Transactions */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Quick Hub */}
            <div className="lg:col-span-4 rounded-2xl bg-bg-secondary border border-border p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-text-primary">
                Management Portals
              </h2>

              {[
                {
                  label: "Payments & Dues Configuration",
                  desc: "Reconciliation, CSV export, session fees",
                  href: "/admin/payments",
                  icon: CreditCard,
                  color: "text-gold-400",
                },
                {
                  label: "Events & Symposia",
                  desc: "Create and publish departmental events",
                  href: "/admin/events",
                  icon: Calendar,
                  color: "text-basa",
                },
                {
                  label: "Blog & Gazette Editor",
                  desc: "Post academic articles and announcements",
                  href: "/admin/blog",
                  icon: BookOpen,
                  color: "text-nesa",
                },
                {
                  label: "Executive Profiles",
                  desc: "Update association leadership rosters",
                  href: "/admin/executives",
                  icon: Users,
                  color: "text-matsa",
                },
                {
                  label: "Past Questions Repository",
                  desc: "Upload exam papers and syllabus guides",
                  href: "/admin/resources",
                  icon: FileText,
                  color: "text-blue-400",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-bg-card border border-border hover:border-border-hover hover:shadow-[0_0_15px_rgba(184,134,11,0.06)] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} className={link.color} />
                    <div>
                      <p className="text-xs font-semibold text-text-primary group-hover:text-gold-400 transition-colors">
                        {link.label}
                      </p>
                      <p className="text-[10px] text-text-muted">{link.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-text-muted group-hover:text-gold-400 transition-colors"
                  />
                </Link>
              ))}
            </div>

            {/* Recent Activity Stream */}
            <div className="lg:col-span-8 rounded-2xl bg-bg-secondary border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-text-primary">
                  Recent Payment Transactions
                </h2>
                <Link
                  href="/admin/payments"
                  className="text-xs text-gold-400 hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>

              {recentPayments.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">
                  No payment transactions logged yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                        <th className="px-6 py-3">Payer</th>
                        <th className="px-6 py-3">Matric</th>
                        <th className="px-6 py-3">Fee Type</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {recentPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-bg-tertiary/30">
                          <td className="px-6 py-3.5 font-medium text-text-primary">
                            {p.student
                              ? `${p.student.firstName} ${p.student.lastName}`
                              : "Student"}
                          </td>
                          <td className="px-6 py-3.5 text-text-muted font-mono">
                            {p.student?.matricNumber || "N/A"}
                          </td>
                          <td className="px-6 py-3.5 text-text-secondary">
                            {p.feeType || "College Due"}
                          </td>
                          <td className="px-6 py-3.5 font-semibold text-text-primary tabular">
                            {formatKobo(p.amountKobo)}
                          </td>
                          <td className="px-6 py-3.5">
                            <Badge
                              variant={
                                p.status === "SUCCESSFUL"
                                  ? "paid"
                                  : p.status === "FAILED"
                                    ? "error"
                                    : "warning"
                              }
                              dot
                            >
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
