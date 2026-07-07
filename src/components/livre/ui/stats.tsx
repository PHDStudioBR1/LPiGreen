"use client";

import { cn } from "@/lib/utils";
import { MotionItem, MotionStagger } from "./motion";
import type { ReactNode } from "react";

export type LivreStatItem = {
  id: string;
  value: string;
  label: string;
  description?: string;
};

type LivreStatsProps = {
  items: LivreStatItem[];
  className?: string;
  columns?: 2 | 3 | 4;
};

const columnMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

export function LivreStats({ items, className, columns = 4 }: LivreStatsProps) {
  return (
    <MotionStagger className={cn("grid gap-6", columnMap[columns], className)}>
      {items.map((item) => (
        <MotionItem key={item.id}>
          <div className="text-center md:text-left">
            <p className="font-lv-headline text-3xl font-bold tracking-tight text-livre-primary sm:text-4xl">
              {item.value}
            </p>
            <p className="mt-1 font-lv-headline text-sm font-semibold text-livre-text">{item.label}</p>
            {item.description && (
              <p className="mt-1 text-xs text-livre-muted sm:text-sm">{item.description}</p>
            )}
          </div>
        </MotionItem>
      ))}
    </MotionStagger>
  );
}

type LivreStatProps = {
  value: ReactNode;
  label: string;
  description?: string;
  className?: string;
};

export function LivreStat({ value, label, description, className }: LivreStatProps) {
  return (
    <div className={cn("text-center md:text-left", className)}>
      <p className="font-lv-headline text-3xl font-bold tracking-tight text-livre-primary sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 font-lv-headline text-sm font-semibold text-livre-text">{label}</p>
      {description && (
        <p className="mt-1 text-xs text-livre-muted sm:text-sm">{description}</p>
      )}
    </div>
  );
}
