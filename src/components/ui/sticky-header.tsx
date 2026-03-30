"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ctaGlowClasses } from "@/lib/cro-cta";

export function StickyHeader({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 w-full min-w-0",
        "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-md"
      )}
    >
      <div className="flex items-center gap-2 min-w-0 shrink">
        <div className="w-8 h-8 shrink-0 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">iG</span>
        </div>
        <span className="font-headline font-bold text-lg sm:text-xl text-primary truncate">
          iGreen Energy
        </span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Button
          onClick={onCTAClick}
          className={`shrink-0 rounded-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base px-4 sm:px-6 py-2 h-auto min-h-10 ${ctaGlowClasses}`}
        >
          <span className="sm:hidden">Quero ser um Licenciado</span>
          <span className="hidden sm:inline">Conhecer o Plano de Negócios</span>
        </Button>
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

