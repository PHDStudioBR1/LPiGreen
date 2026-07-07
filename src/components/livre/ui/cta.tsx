"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { MotionBlock } from "./motion";
import { LivreButton } from "./button";

type LivreCtaProps = {
  title: ReactNode;
  description?: string;
  ctaLabel: string;
  onCtaClick?: () => void;
  microcopy?: string;
  className?: string;
  variant?: "gradient" | "outline";
  ctaLoading?: boolean;
};

export function LivreCta({
  title,
  description,
  ctaLabel,
  onCtaClick,
  microcopy,
  className,
  variant = "gradient",
  ctaLoading,
}: LivreCtaProps) {
  return (
    <MotionBlock as="section">
      <div
        className={cn(
          "relative overflow-hidden rounded-lv-2xl px-6 py-12 text-center sm:px-12 sm:py-16",
          variant === "gradient" && "livre-gradient-cta",
          variant === "outline" &&
            "border border-livre-primary/30 bg-livre-bg-elevated shadow-lv-glow",
          className
        )}
      >
        <h2
          className={cn(
            "font-lv-headline text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-balance",
            variant === "gradient" ? "text-livre-petrol-900" : "text-livre-text"
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              "mx-auto mt-4 max-w-2xl text-base sm:text-lg",
              variant === "gradient" ? "text-livre-petrol-900/80" : "text-livre-muted"
            )}
          >
            {description}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          <LivreButton
            variant={variant === "gradient" ? "primary-inverted" : "primary"}
            size="lg"
            onClick={onCtaClick}
            isLoading={ctaLoading}
            className="min-w-[240px] sm:min-w-[280px]"
          >
            {ctaLabel}
          </LivreButton>

          {microcopy && (
            <p
              className={cn(
                "text-xs sm:text-sm",
                variant === "gradient" ? "text-livre-petrol-900/70" : "text-livre-muted"
              )}
            >
              {microcopy}
            </p>
          )}
        </div>
      </div>
    </MotionBlock>
  );
}

type LivreCtaInlineProps = {
  label: string;
  onClick?: () => void;
  description?: string;
  className?: string;
};

export function LivreCtaInline({ label, onClick, description, className }: LivreCtaInlineProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 sm:flex-row sm:justify-center", className)}>
      <LivreButton size="lg" onClick={onClick}>
        {label}
      </LivreButton>
      {description && <p className="text-sm text-livre-muted">{description}</p>}
    </div>
  );
}
