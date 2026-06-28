import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
};

const paddingMap = {
  sm: "p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10",
};

export function PremiumCard({
  children,
  className,
  padding = "md",
  hover = true,
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm",
        hover &&
          "transition-all duration-300 hover:border-[#00e676]/25 hover:bg-white/[0.06]",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
