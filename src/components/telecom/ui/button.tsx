"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#00e676] text-[#060806] hover:bg-[#00c853] shadow-[0_4px_14px_rgba(0,230,118,0.25)]",
  secondary:
    "bg-white/[0.06] text-white border border-white/15 hover:border-[#00e676]/30 hover:bg-white/[0.1]",
  outline:
    "bg-transparent text-white border border-white/15 hover:border-[#00e676]/40 hover:text-[#00e676]",
  ghost: "bg-transparent text-[#00e676] hover:bg-[#00e676]/10",
  accent:
    "bg-[#00e676] text-[#060806] hover:bg-[#00c853] shadow-[0_4px_14px_rgba(0,230,118,0.25)]",
};

export function Button({
  variant = "primary",
  children,
  className,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold tracking-wide transition-colors duration-200",
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
