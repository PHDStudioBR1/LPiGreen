"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { MotionItem } from "./motion";

const iconBoxVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lv-lg border",
  {
    variants: {
      variant: {
        default: "border-livre-primary/20 bg-livre-primary/10 text-livre-primary",
        filled:
          "border-transparent bg-gradient-to-br from-livre-primary to-livre-primary-hover text-livre-petrol-900",
        ghost: "border-transparent bg-transparent text-livre-accent",
        surface: "border-livre-petrol-500 bg-livre-bg-surface text-livre-accent",
      },
      size: {
        sm: "size-10 [&_svg]:size-4",
        md: "size-12 [&_svg]:size-5",
        lg: "size-14 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type LivreIconBoxProps = VariantProps<typeof iconBoxVariants> & {
  icon: LucideIcon;
  className?: string;
  animate?: boolean;
  label?: string;
};

export function LivreIconBox({
  icon: Icon,
  variant,
  size,
  className,
  animate = false,
  label,
}: LivreIconBoxProps) {
  const box = (
    <div
      className={cn(iconBoxVariants({ variant, size }), className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      <Icon />
    </div>
  );

  if (animate) {
    return <MotionItem variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>{box}</MotionItem>;
  }

  return box;
}

export { iconBoxVariants };
