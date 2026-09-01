"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Download,
  ArrowLeft,
  Shield,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

interface FeeItem {
  id: string;
  type: "COLLEGE_DUE" | "ASSOCIATION_DUE";
  label: string;
  amount: number; // in kobo
  status: "paid" | "unpaid";
  session: string;
}

interface PaymentRecord {
  id: string;
  createdAt: string;
  feeType: string | null;
  amountKobo: number;
  reference: string;
  status: string;
  receipt?: { id: string; receiptNo: string } | null;
}

function formatKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

export default function PaymentsPage() {
  const router = useRouter();
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [selectedFees, setSelectedFees] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/payments/history");
        if (res.ok) {
          const data = await res.json();
          if (data.feeBreakdown && data.feeBreakdown.length > 0) {
            setFees(data.feeBreakdown);
          } else {
            // Default fallback if no database record yet
            setFees([
              {
                id: "default-col-due",
                type: "COLLEGE_DUE",
                label: "COLMANS College Due",
                amount: 500000,
                status: "unpaid",
                session: "2026/2027",
              },
              {
                id: "default-basa-due",
                type: "ASSOCIATION_DUE",
                label: "BASA Association Annual Due",
                amount: 300000,
                status: "unpaid",
                session: "2026/2027",
              },
            ]);
          }

          if (data.payments) {
            setHistory(data.payments);
          }
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleFee = (id: string) => {
    setSelectedFees((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedTotal = fees
    .filter((f) => selectedFees.has(f.id))
    .reduce((sum, f) => sum + f.amount, 0);

  const handlePay = async () => {
    if (selectedFees.size === 0) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeIds: Array.from(selectedFees),
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Failed to initialize payment gateway.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting payment service.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold-400 transition-colors mb-4"
            >
              <ArrowLeft size={14} />
              Back to Portal
            </Link>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Payment Portal
            </h1>
            <p className="mt-2 text-text-secondary">
              Pay your college and association dues securely via Paystack.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader2 className="animate-spin text-gold-400" size={32} />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Fee Dashboard — Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Fee Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-2xl bg-bg-secondary border border-border overflow-hidden shadow-lg"
                >
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-text-primary">
                      Fee Breakdown — 2026/2027 Session
                    </h2>
                    <Badge variant="colmans">Current Session</Badge>
                  </div>

                  <div className="divide-y divide-border">
                    {fees.map((fee) => (
                      <label
                        key={fee.id}
                        className={`flex items-center gap-4 px-6 py-5 cursor-pointer transition-colors ${
                          fee.status === "paid"
                            ? "opacity-60 bg-bg-tertiary/20"
                            : "hover:bg-bg-tertiary/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFees.has(fee.id)}
                          onChange={() => toggleFee(fee.id)}
                          disabled={fee.status === "paid"}
                          className="w-5 h-5 rounded border-border bg-bg-tertiary accent-gold-500 cursor-pointer"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">
                            {fee.label}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {fee.session}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-text-primary tabular">
                            {formatKobo(fee.amount)}
                          </p>
                          <div className="mt-1">
                            {fee.status === "paid" ? (
                              <span className="inline-flex items-center gap-1 text-xs text-success">
                                <CheckCircle2 size={12} />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-error">
                                <XCircle size={12} />
                                Unpaid
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Total & Pay */}
                  <div className="px-6 py-5 bg-bg-tertiary/50 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-text-secondary">
                        Selected Total
                      </span>
                      <span className="text-xl font-bold text-text-primary tabular">
                        {formatKobo(selectedTotal)}
                      </span>
                    </div>
                    <Button
                      onClick={handlePay}
                      disabled={selectedFees.size === 0}
                      isLoading={isProcessing}
                      className="w-full"
                      size="lg"
                      leftIcon={<CreditCard size={18} />}
                    >
                      {isProcessing
                        ? "Initializing Gateway..."
                        : `Pay ${formatKobo(selectedTotal)} with Paystack`}
                    </Button>
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Shield size={12} />
                        Secured by Paystack
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FileText size={12} />
                        Instant digital receipt
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Payment History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl bg-bg-secondary border border-border overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-border">
                    <h2 className="font-display text-lg font-semibold text-text-primary">
                      Payment History
                    </h2>
                  </div>

                  {history.length === 0 ? (
                    <div className="p-8 text-center text-sm text-text-muted">
                      No payment history recorded yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                              Reference
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                              Receipt
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {history.map((payment) => (
                            <tr
                              key={payment.id}
                              className="hover:bg-bg-tertiary/30 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-text-secondary tabular whitespace-nowrap">
                                {new Date(payment.createdAt).toLocaleDateString(
                                  "en-NG",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-text-primary">
                                {payment.feeType || "College Due"}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-text-primary tabular whitespace-nowrap">
                                {formatKobo(payment.amountKobo)}
                              </td>
                              <td className="px-6 py-4 text-xs text-text-muted tabular font-mono whitespace-nowrap">
                                {payment.reference}
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant={
                                    payment.status === "SUCCESSFUL"
                                      ? "paid"
                                      : payment.status === "FAILED"
                                        ? "error"
                                        : "warning"
                                  }
                                  dot
                                >
                                  {payment.status === "SUCCESSFUL"
                                    ? "Paid"
                                    : payment.status === "FAILED"
                                      ? "Failed"
                                      : "Pending"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                {payment.status === "SUCCESSFUL" && (
                                  <Link
                                    href={`/payments/verify?reference=${payment.reference}`}
                                    className="inline-flex items-center gap-1 text-xs text-gold-400 hover:underline cursor-pointer"
                                  >
                                    <Download size={12} />
                                    Receipt
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6"
              >
                {/* How It Works */}
                <div className="rounded-2xl bg-bg-secondary border border-border p-6">
                  <h3 className="font-display text-base font-semibold text-text-primary mb-3">
                    Payment Instructions
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Select your dues",
                        desc: "Choose college due and/or association due",
                      },
                      {
                        step: "2",
                        title: "Pay via Paystack",
                        desc: "Card, bank transfer, USSD or bank account",
                      },
                      {
                        step: "3",
                        title: "Download Receipt",
                        desc: "Official digital receipt with verification ID",
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-3">
                        <div className="w-7 h-7 shrink-0 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-gold-400">
                            {item.step}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {item.title}
                          </p>
                          <p className="text-xs text-text-muted">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support */}
                <div className="rounded-2xl bg-gold-500/5 border border-gold-500/20 p-6">
                  <h3 className="text-sm font-semibold text-gold-400 mb-2">
                    Need Payment Assistance?
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    If your bank was debited but the status remains unpaid,
                    please send your transaction reference to{" "}
                    <a
                      href="mailto:bursar@colmans.edu.ng"
                      className="text-gold-400 underline"
                    >
                      bursar@colmans.edu.ng
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
