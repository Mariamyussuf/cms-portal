"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "gold" | "blue" | "none";
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hover = true,
  glow = "gold",
  onClick,
}: CardProps) {
  const glowClass =
    glow === "gold"
      ? "hover:shadow-[0_0_30px_rgba(184,134,11,0.12)]"
      : glow === "blue"
        ? "hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]"
        : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      className={`
        relative rounded-xl
        bg-bg-card backdrop-blur-md
        border border-border
        transition-all duration-300 ease-out
        ${hover ? "hover:border-border-hover cursor-pointer" : ""}
        ${glowClass}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`p-6 pb-0 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
