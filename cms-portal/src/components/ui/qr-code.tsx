"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({
  value,
  size = 110,
  className = "",
}: QRCodeDisplayProps) {
  const [svgDataUrl, setSvgDataUrl] = useState<string>("");

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      margin: 1,
      width: size * 2, // High DPI
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setSvgDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [value, size]);

  if (!svgDataUrl) {
    return (
      <div
        className={`bg-slate-100 animate-pulse rounded border border-slate-200 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={svgDataUrl}
      alt="Verification QR Code"
      width={size}
      height={size}
      className={`block object-contain ${className}`}
    />
  );
}
