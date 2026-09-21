"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { OfficialReceipt, type OfficialReceiptData } from "@/components/payments/official-receipt";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const simulated = searchParams.get("simulated") === "true";

  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );
  const [receiptData, setReceiptData] = useState<OfficialReceiptData | null>(null);
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
        if (data.success && data.receipt) {
          setStatus("success");
          setReceiptData(data.receipt);
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {status === "verifying" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center rounded-2xl bg-bg-secondary border border-border p-12 max-w-md mx-auto"
        >
          <Loader2
            size={48}
            className="animate-spin text-gold-400 mx-auto mb-4"
          />
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Verifying Payment...
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Please wait while we confirm your transaction and generate your official stamped receipt.
          </p>
        </motion.div>
      )}

      {status === "success" && receiptData && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <OfficialReceipt
            receipt={receiptData}
            onBack={() => router.push("/payments")}
          />
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-bg-secondary border border-border p-8 text-center max-w-lg mx-auto"
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
      <div className="print:hidden">
        <SiteHeader />
      </div>
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
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
