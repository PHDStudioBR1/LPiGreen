"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function StickyHeader({ onCTAClick }: { onCTAClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 w-full min-w-0",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md translate-y-0"
          : "-translate-y-full"
      )}
    >
      <div className="flex items-center gap-2 min-w-0 shrink">
        <div className="w-8 h-8 shrink-0 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">iG</span>
        </div>
        <span className="font-headline font-bold text-lg sm:text-xl text-primary truncate">
          iGreen Energy
        </span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Button
          onClick={onCTAClick}
          className="shrink-0 rounded-full font-bold shadow-lg bg-primary hover:bg-primary/90 transition-all text-sm sm:text-base px-4 sm:px-6 py-2"
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

