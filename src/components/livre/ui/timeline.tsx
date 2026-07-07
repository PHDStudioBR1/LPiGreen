"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { MotionItem, MotionStagger } from "./motion";
import { LivreIconBox } from "./icon-box";

export type LivreTimelineStep = {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};

type LivreTimelineProps = {
  steps: LivreTimelineStep[];
  className?: string;
  columns?: 3 | 4;
};

const columnStyles = {
  3: {
    grid: "lg:grid-cols-3",
    line: "lg:left-[calc(16.67%-1px)] lg:inset-x-[16.67%]",
  },
  4: {
    grid: "lg:grid-cols-4",
    line: "lg:left-[calc(12.5%-1px)] lg:inset-x-[12.5%]",
  },
} as const;

export function LivreTimeline({ steps, className, columns = 3 }: LivreTimelineProps) {
  const styles = columnStyles[columns];

  return (
    <MotionStagger
      className={cn(
        "relative grid gap-8 lg:gap-12",
        styles.grid,
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute left-5 top-0 hidden h-full w-0.5 bg-livre-primary/30 lg:block lg:w-auto lg:h-0.5 lg:top-7 lg:bottom-auto",
          styles.line
        )}
      />

      {steps.map((step, index) => (
        <MotionItem key={step.id} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
          <div className="relative z-10 flex shrink-0 flex-col items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-full bg-livre-primary font-lv-headline text-sm font-bold text-livre-petrol-900">
              {index + 1}
            </span>
            {step.icon && (
              <LivreIconBox icon={step.icon} variant="surface" size="sm" />
            )}
          </div>

          <div className="pt-1 lg:pt-4">
            <h3 className="font-lv-headline text-lg font-semibold text-livre-text">{step.title}</h3>
            {step.description && (
              <p className="mt-2 text-sm leading-relaxed text-livre-muted sm:text-base">
                {step.description}
              </p>
            )}
          </div>

          {index < steps.length - 1 && (
            <div
              aria-hidden
              className="absolute bottom-0 left-5 top-10 w-0.5 -translate-x-1/2 bg-livre-primary/20 lg:hidden"
            />
          )}
        </MotionItem>
      ))}
    </MotionStagger>
  );
}
