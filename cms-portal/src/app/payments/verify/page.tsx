"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  ArrowRight,
  ShieldCheck,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

function formatKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const simulated = searchParams.get("simulated") === "true";

  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );
  const [paymentData, setPaymentData] = useState<{
    reference: string;
    amountKobo: number;
    feeType?: string;
    receipt?: { receiptNo: string; issuedAt: string };
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setErrorMessage("No transaction reference supplied.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, simulated }),
        });

        const data = await res.json();
        if (data.success && data.payment) {
          setStatus("success");
          setPaymentData(data.payment);
        } else {
          setStatus("failed");
          setErrorMessage(data.error || "Payment verification failed.");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
        setErrorMessage("Network error verifying payment.");
      }
    }

    verify();
  }, [reference, simulated]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
      {status === "verifying" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center rounded-2xl bg-bg-secondary border border-border p-10"
        >
          <Loader2
            size={48}
            className="animate-spin text-gold-400 mx-auto mb-4"
          />
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Verifying Payment...
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Please wait while we confirm your transaction with the payment
            gateway.
          </p>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-bg-secondary border border-border overflow-hidden shadow-2xl shadow-gold-500/5"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-bg-secondary to-emerald-950/20 border-b border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-emerald-400" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <ShieldCheck size={14} />
              Payment Confirmed
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              Payment Successful!
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Your dues have been recorded and your digital receipt is ready.
            </p>
          </div>

          {/* Receipt Body */}
          <div className="p-8 space-y-6">
            <div className="rounded-xl bg-bg-tertiary/70 border border-border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Receipt Number</span>
                <span className="font-mono text-text-primary font-semibold">
                  {paymentData?.receipt?.receiptNo || "REC-PENDING"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Reference</span>
                <span className="font-mono text-text-primary text-xs">
                  {paymentData?.reference}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Fee Type</span>
                <span className="text-text-primary">
                  {paymentData?.feeType || "College / Association Due"}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-border">
                <span className="font-medium text-text-primary">
                  Total Paid
                </span>
                <span className="font-bold text-gold-400 text-lg tabular">
                  {paymentData?.amountKobo
                    ? formatKobo(paymentData.amountKobo)
                    : "₦0"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                leftIcon={<Printer size={16} />}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
              <Link href="/payments" className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Return to Portal
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-bg-secondary border border-border p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mx-auto mb-4">
            <XCircle size={36} className="text-error" />
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Verification Failed
          </h2>
          <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
            {errorMessage ||
              "We could not verify this transaction. If you were debited, please contact the administrator."}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/payments")}
            >
              Back to Payments
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/contact")}
            >
              Contact Support
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <Loader2 className="animate-spin text-gold-400" size={32} />
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
