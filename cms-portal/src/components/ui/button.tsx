"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const base =
      "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    // Variants — Oxford & Cambridge Deep Navy + Champagne Brass
    const variants = {
      primary:
        "bg-[#0C2340] hover:bg-[#0A192F] text-white shadow-md shadow-slate-900/15 hover:shadow-lg active:scale-[0.98]",
      secondary:
        "bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs active:scale-[0.98]",
      outline:
        "bg-transparent text-[#0C2340] border border-slate-300 hover:border-[#0C2340] hover:bg-slate-100 active:scale-[0.98]",
      ghost:
        "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98]",
      destructive:
        "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:scale-[0.98]",
    };

    // Sizes
    const sizes = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
