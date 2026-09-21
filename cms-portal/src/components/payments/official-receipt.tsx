"use client";

import React, { useRef } from "react";
import { Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/ui/qr-code";
import { numberToWordsNaira } from "@/lib/utils/number-to-words";

export interface OfficialReceiptData {
  receiptNo: string;
  referenceNo: string;
  studentName: string;
  department: string;
  matricNumber: string;
  level: string;
  amountKobo: number;
  amountWords?: string;
  paymentPurpose: string;
  dateTime: string;
  associationAcronym: string; // e.g. "NESA", "BASA", "MATSA", "COLMANS"
  associationFullName: string; // e.g. "NIGERIAN ECONOMICS STUDENTS' ASSOCIATION"
  associationLogoUrl?: string; // e.g. "/logo/Nesa Logo.jpeg"
  officialEmail?: string;
  presidentName?: string;
  presidentSignatureUrl?: string;
  finSecName?: string;
  finSecSignatureUrl?: string;
  themeColor?: string; // blue by default like reference
}

interface OfficialReceiptProps {
  receipt: OfficialReceiptData;
  onBack?: () => void;
  showBack?: boolean;
}

export function OfficialReceipt({
  receipt,
  onBack,
  showBack = true,
}: OfficialReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const amountInNaira = Math.floor(receipt.amountKobo / 100);
  const amountWords =
    receipt.amountWords || numberToWordsNaira(amountInNaira);

  const currentYear = new Date().getFullYear();
  const themeBorderColor = receipt.themeColor || "#1877F2";

  // Verification URL for QR Code
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://colmans.bellsuniversity.edu.ng";
  const verificationUrl = `${origin}/receipts/${receipt.referenceNo}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 print:my-0 print:max-w-none">
      {/* Screen Control Bar (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden px-2 sm:px-0">
        {showBack && onBack ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Portal
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
            <CheckCircle2 size={18} />
            Official Verified Receipt
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer size={16} />}
            className="shadow-sm"
          >
            Print Receipt
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Download size={16} />}
            className="shadow-sm"
          >
            Save as PDF
          </Button>
        </div>
      </div>

      {/* The Printable Official Receipt Sheet */}
      <div
        ref={receiptRef}
        id="official-receipt-sheet"
        className="bg-white text-slate-900 rounded-none sm:rounded-lg shadow-xl print:shadow-none mx-auto relative overflow-hidden print:w-full"
        style={{
          border: `3.5px solid ${themeBorderColor}`,
        }}
      >
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between min-h-[900px] print:min-h-0">
          <div>
            {/* Header Section */}
            <div className="grid grid-cols-[80px_1fr_80px] sm:grid-cols-[96px_1fr_96px] items-center gap-2 sm:gap-4">
              {/* Left: Bells University Logo */}
              <div className="flex justify-center items-center">
                <img
                  src="/logo/bells-logo.jpg"
                  alt="Bells University of Technology"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full"
                />
              </div>

              {/* Center: Acronym & University Details */}
              <div className="text-center px-1">
                <h1
                  className="font-black text-3xl sm:text-5xl tracking-wide uppercase leading-tight"
                  style={{ color: themeBorderColor }}
                >
                  {receipt.associationAcronym}
                </h1>
                <p className="text-[11px] sm:text-[13px] font-bold text-slate-900 tracking-wider uppercase mt-1 leading-snug">
                  {receipt.associationFullName}
                </p>
                <p className="text-[10px] sm:text-[12px] font-bold text-slate-900 tracking-wider uppercase leading-snug">
                  BELLS UNIVERSITY OF TECHNOLOGY, OTA
                </p>
                <p className="text-[10px] sm:text-[12px] font-bold text-slate-900 tracking-wider uppercase leading-snug">
                  (BELLSTECH CHAPTER)
                </p>
              </div>

              {/* Right: Association Logo */}
              <div className="flex justify-center items-center">
                <img
                  src={receipt.associationLogoUrl || "/logo/bells-logo.jpg"}
                  alt={`${receipt.associationAcronym} Logo`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full shadow-sm"
                />
              </div>
            </div>

            {/* Official Receipt Sub-header */}
            <div className="mt-5 mb-2 text-center">
              <h2 className="text-xs sm:text-sm font-bold text-slate-400 tracking-[0.25em] uppercase">
                OFFICIAL RECEIPT
              </h2>
            </div>
            <div className="border-b border-slate-300 mb-6" />

            {/* Student & Payment Metadata Lines */}
            <div className="space-y-3.5 text-sm sm:text-[15px] font-sans">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  Full Name:
                </span>
                <span className="font-bold text-slate-950 uppercase tracking-wide">
                  {receipt.studentName}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  Department:
                </span>
                <span className="font-bold text-slate-950 uppercase tracking-wide">
                  {receipt.department}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  Matric No:
                </span>
                <span className="font-bold text-slate-950 tracking-wide">
                  {receipt.matricNumber}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  Level:
                </span>
                <span className="font-bold text-slate-950">
                  {receipt.level.replace(/level/i, "").trim()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 pt-1">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  The Sum of:
                </span>
                <span className="font-bold text-slate-950 tracking-wide">
                  {amountWords}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  Being Payment For:
                </span>
                <span className="font-bold text-slate-950">
                  {receipt.paymentPurpose}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  Date and Time:
                </span>
                <span className="font-bold text-slate-950">
                  {receipt.dateTime}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-800 font-medium min-w-[160px] shrink-0">
                  Reference No:
                </span>
                <span className="font-mono font-bold text-slate-950 tracking-wider text-xs sm:text-sm">
                  {receipt.referenceNo}
                </span>
              </div>
            </div>

            {/* Official Signatures Section */}
            <div className="mt-8 border border-dashed border-slate-400 rounded-sm p-3 sm:p-5">
              <div className="grid grid-cols-2 divide-x divide-slate-300">
                {/* President Signature */}
                <div className="flex flex-col items-center justify-between text-center px-2">
                  <div className="h-16 flex items-center justify-center">
                    <img
                      src={
                        receipt.presidentSignatureUrl ||
                        "/images/signatures/president-sig.svg"
                      }
                      alt="President's Signature"
                      className="max-h-14 max-w-[130px] object-contain"
                    />
                  </div>
                  <div className="mt-1">
                    <p className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider leading-tight">
                      {receipt.associationAcronym} - BELLSTECH
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-700 leading-tight">
                      President's signature
                    </p>
                    {receipt.presidentName && (
                      <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
                        ({receipt.presidentName})
                      </p>
                    )}
                  </div>
                </div>

                {/* Financial Secretary Signature */}
                <div className="flex flex-col items-center justify-between text-center px-2">
                  <div className="h-16 flex items-center justify-center">
                    <img
                      src={
                        receipt.finSecSignatureUrl ||
                        "/images/signatures/finsec-sig.svg"
                      }
                      alt="Financial Secretary's Signature"
                      className="max-h-14 max-w-[130px] object-contain"
                    />
                  </div>
                  <div className="mt-1">
                    <p className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider leading-tight">
                      {receipt.associationAcronym} - BELLSTECH
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-700 leading-tight">
                      Financial Secretary's Signature
                    </p>
                    {receipt.finSecName && (
                      <p className="text-[9px] text-slate-500 mt-0.5 font-medium">
                        ({receipt.finSecName})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Section: QR Code + Email + Copyright */}
          <div className="mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Verification QR Code */}
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white border border-slate-200 rounded">
                <QRCodeDisplay
                  value={verificationUrl}
                  size={76}
                  className="rounded"
                />
              </div>
              <div className="text-[10px] text-slate-500 max-w-[130px] leading-tight hidden sm:block">
                Scan to verify receipt authenticity online.
              </div>
            </div>

            {/* Email and Copyright */}
            <div className="text-center sm:text-right text-xs text-slate-600 space-y-1">
              {receipt.officialEmail && (
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${receipt.officialEmail}`}
                    className="text-slate-800 hover:underline font-medium"
                  >
                    {receipt.officialEmail}
                  </a>
                </p>
              )}
              <p className="text-[11px] text-slate-500">
                © {currentYear} {receipt.associationAcronym} - All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Print Styling */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          header,
          footer,
          nav,
          button,
          .print\\:hidden {
            display: none !important;
          }

          #official-receipt-sheet {
            border: 3px solid ${themeBorderColor} !important;
            width: 100% !important;
            max-width: 780px !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-inside: avoid !important;
          }

          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
}
