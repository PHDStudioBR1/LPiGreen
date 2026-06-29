"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HOME_LOGO_SRC } from "@/lib/home/constants";

export function StickyHeader({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 w-full min-w-0",
        "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-md"
      )}
    >
      <div className="flex items-center min-w-0 shrink">
        <img
          src={HOME_LOGO_SRC}
          alt="iGreen Energy"
          className="h-9 w-auto sm:h-10"
        />
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Button
          onClick={onCTAClick}
          className="shrink-0 rounded-full font-bold shadow-lg bg-primary hover:bg-primary/90 transition-all text-sm sm:text-base px-4 sm:px-6 py-2 dark:text-white"
        >
          <span className="sm:hidden">Quero economizar</span>
          <span className="hidden sm:inline">
            Faça parte da transição energética
          </span>
        </Button>
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

