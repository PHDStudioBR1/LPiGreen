"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-sa-primary text-white hover:bg-sa-primary-hover shadow-[0_4px_14px_rgba(0,70,192,0.25)]",
  secondary:
    "bg-white text-sa-primary border border-sa-border hover:border-sa-primary/30 hover:bg-sa-surface",
  outline:
    "bg-transparent text-sa-text border border-sa-border hover:border-sa-primary/40 hover:text-sa-primary",
  ghost: "bg-transparent text-sa-primary hover:bg-sa-primary/5",
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
