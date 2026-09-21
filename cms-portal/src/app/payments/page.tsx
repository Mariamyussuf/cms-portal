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
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

interface FeeItem {
  id: string;
  type: "COLLEGE_DUE" | "ASSOCIATION_DUE";
  label: string;
  amount: number; // in kobo
  status: "paid" | "unpaid";
  session: string;
  paymentLink?: string | null;
  associationName?: string;
  associationLogo?: string | null;
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
  const [claimReference, setClaimReference] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/payments/history");
        if (res.ok) {
          const data = await res.json();
          if (data.feeBreakdown && data.feeBreakdown.length > 0) {
            setFees(data.feeBreakdown);
          } else {
            // Default fallback
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
                id: "default-nesa-due",
                type: "ASSOCIATION_DUE",
                label: "NESA Association Annual Due",
                amount: 1000000,
                status: "unpaid",
                session: "2026/2027",
                paymentLink: "https://checkout.bachs.io/pay/pl_18fcf3e8c401",
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

    // If only one fee is selected and it has a direct paymentLink, we can open it!
    const selectedList = fees.filter((f) => selectedFees.has(f.id));
    if (selectedList.length === 1 && selectedList[0].paymentLink) {
      window.open(selectedList[0].paymentLink, "_blank");
      return;
    }

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

  const handleClaimReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimReference.trim()) return;
    router.push(`/payments/verify?reference=${encodeURIComponent(claimReference.trim())}&simulated=true`);
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
              Pay your college and association dues securely and generate official stamped receipts with executive signatures.
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
                      <div
                        key={fee.id}
                        className={`flex items-center gap-4 px-6 py-5 transition-colors ${
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
                          className="w-5 h-5 rounded border-border bg-bg-tertiary accent-gold-500 cursor-pointer shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">
                            {fee.label}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-text-muted">
                              {fee.session}
                            </span>
                            {fee.paymentLink && fee.status !== "paid" && (
                              <a
                                href={fee.paymentLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300 underline"
                              >
                                Pay via Direct Link
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
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
                      </div>
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
                        ? "Initializing Payment..."
                        : `Proceed to Pay ${formatKobo(selectedTotal)}`}
                    </Button>
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Shield size={12} />
                        Official Bells Portal
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FileText size={12} />
                        Stamped Digital Receipt
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
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-text-primary">
                      Payment History & Receipts
                    </h2>
                    <span className="text-xs text-text-muted">
                      Official Records
                    </span>
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
                                    href={`/receipts/${payment.reference}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 hover:underline cursor-pointer"
                                  >
                                    <Download size={13} />
                                    Official Receipt
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
                {/* Claim Stamped Receipt */}
                <div className="rounded-2xl bg-bg-secondary border border-border p-6 shadow-sm">
                  <h3 className="font-display text-base font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <FileText size={18} className="text-gold-400" />
                    Claim Stamped Receipt
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    Paid via Bachs or direct payment link? Paste your Transaction Reference below to generate your stamped official receipt.
                  </p>
                  <form onSubmit={handleClaimReceipt} className="space-y-3">
                    <Input
                      placeholder="e.g. 202413769-1759664..."
                      value={claimReference}
                      onChange={(e) => setClaimReference(e.target.value)}
                      className="font-mono text-xs"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      disabled={!claimReference.trim()}
                      leftIcon={<Search size={14} />}
                    >
                      Verify & Generate Receipt
                    </Button>
                  </form>
                </div>

                {/* How It Works */}
                <div className="rounded-2xl bg-bg-secondary border border-border p-6">
                  <h3 className="font-display text-base font-semibold text-text-primary mb-3">
                    Receipt Process
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Select or Click Due Link",
                        desc: "Pay college due or association dues via checkout link",
                      },
                      {
                        step: "2",
                        title: "Payment Confirmation",
                        desc: "Bachs confirms transaction and issues reference code",
                      },
                      {
                        step: "3",
                        title: "Instant Stamped Receipt",
                        desc: "Verified with President & Financial Secretary digital signatures",
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
                    Need Receipt Verification?
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Official receipts generated by this portal carry a cryptographic QR code for bursary and departmental clearance.
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
