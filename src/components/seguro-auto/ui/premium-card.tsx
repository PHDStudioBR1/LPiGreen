"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-5 sm:p-6",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10",
};

export function PremiumCard({
  children,
  className,
  hover = true,
  padding = "md",
}: PremiumCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6 } : undefined}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-[1.75rem] border border-sa-border/60 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]",
        paddingMap[padding],
        hover && "transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
