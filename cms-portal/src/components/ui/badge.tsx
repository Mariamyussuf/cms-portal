type BadgeVariant =
  | "default"
  | "basa"
  | "nesa"
  | "matsa"
  | "colmans"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "upcoming"
  | "ongoing"
  | "past"
  | "paid"
  | "unpaid";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-bg-elevated text-text-secondary border-border",
  basa: "bg-basa/10 text-basa border-basa/20",
  nesa: "bg-nesa/10 text-nesa border-nesa/20",
  matsa: "bg-matsa/10 text-matsa border-matsa/20",
  colmans: "bg-gold-500/10 text-gold-400 border-gold-500/20",
  success: "bg-success/10 text-success border-success/20",
  error: "bg-error/10 text-error border-error/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-info/10 text-info border-info/20",
  upcoming: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  ongoing: "bg-success/10 text-success border-success/20",
  past: "bg-bg-elevated text-text-muted border-border",
  paid: "bg-success/10 text-success border-success/20",
  unpaid: "bg-error/10 text-error border-error/20",
};

const dotColors: Partial<Record<BadgeVariant, string>> = {
  basa: "bg-basa",
  nesa: "bg-nesa",
  matsa: "bg-matsa",
  colmans: "bg-gold-500",
  success: "bg-success",
  error: "bg-error",
  upcoming: "bg-blue-400",
  ongoing: "bg-success",
  paid: "bg-success",
  unpaid: "bg-error",
};

export function Badge({
  variant = "default",
  children,
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-xs font-medium
        border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && dotColors[variant] && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
