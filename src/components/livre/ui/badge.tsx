import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-lv-headline font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-livre-primary/10 text-livre-primary border border-livre-primary/20",
        accent: "bg-livre-accent/10 text-livre-accent border border-livre-accent/20",
        secondary: "bg-livre-secondary/20 text-livre-text border border-livre-secondary/30",
        outline: "bg-transparent text-livre-text/80 border border-white/15",
        popular: "bg-livre-primary text-livre-petrol-900 border border-livre-primary",
        trust: "bg-livre-bg-surface text-livre-accent border border-livre-petrol-500",
      },
      size: {
        sm: "rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wider",
        md: "rounded-full px-3 py-1 text-xs",
        lg: "rounded-lv-md px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type LivreBadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    icon?: ReactNode;
  };

export function LivreBadge({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: LivreBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}

export { badgeVariants };
