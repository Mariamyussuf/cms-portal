import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
  | "default"
  | "colmans"
  | "basa"
  | "nesa"
  | "matsa"
  | "paid"
  | "unpaid"
  | "upcoming"
  | "ongoing"
  | "past"
  | "warning"
  | "error";
  dot?: boolean;
}

export function Badge({
  className = "",
  variant = "default",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase transition-colors";

  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    colmans: "bg-[#0C2340]/10 text-[#0C2340] border border-[#0C2340]/20 font-bold",
    basa: "bg-blue-50 text-blue-800 border border-blue-200",
    nesa: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    matsa: "bg-amber-50 text-amber-900 border border-amber-200",
    paid: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    unpaid: "bg-red-50 text-red-800 border border-red-200",
    upcoming: "bg-[#0C2340]/10 text-[#0C2340] border border-[#0C2340]/20",
    ongoing: "bg-amber-50 text-amber-800 border border-amber-200",
    past: "bg-slate-100 text-slate-500 border border-slate-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    error: "bg-red-50 text-red-800 border border-red-200",
  };

  const dotColors = {
    default: "bg-slate-500",
    colmans: "bg-[#0C2340]",
    basa: "bg-blue-600",
    nesa: "bg-emerald-600",
    matsa: "bg-amber-700",
    paid: "bg-emerald-600",
    unpaid: "bg-red-600",
    upcoming: "bg-[#0C2340]",
    ongoing: "bg-amber-600",
    past: "bg-slate-400",
    warning: "bg-amber-600",
    error: "bg-red-600",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`}
        />
      )}
      {children}
    </span>
  );
}
