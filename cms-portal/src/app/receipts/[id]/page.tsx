"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, XCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import {
  OfficialReceipt,
  type OfficialReceiptData,
} from "@/components/payments/official-receipt";

interface ReceiptPageProps {
  params: Promise<{ id: string }>;
}

export default function ReceiptViewPage({ params }: ReceiptPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [receipt, setReceipt] = useState<OfficialReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const res = await fetch(`/api/payments/receipt/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to load receipt");
        }
        const data = await res.json();
        setReceipt(data.receipt);
      } catch (err: unknown) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not retrieve the requested official receipt.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchReceipt();
    }
  }, [id]);

  return (
    <>
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <main className="min-h-screen py-8 sm:py-12 bg-bg-primary print:bg-white print:py-0">
        <div className="mx-auto max-w-4xl px-4">
          {isLoading && (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
              <Loader2 className="animate-spin text-gold-400 mb-4" size={40} />
              <p className="text-text-secondary text-sm">
                Retrieving official verified receipt...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto rounded-2xl bg-bg-secondary border border-border p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-error" />
              </div>
              <h2 className="font-display text-xl font-bold text-text-primary">
                Receipt Not Found
              </h2>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {error}
              </p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={() => router.push("/payments")}
              >
                Go to Payment Portal
              </Button>
            </motion.div>
          )}

          {!isLoading && receipt && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <OfficialReceipt
                receipt={receipt}
                onBack={() => router.push("/payments")}
              />
            </motion.div>
          )}
        </div>
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
