"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function StickyHeader({ onCTAClick }: { onCTAClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 py-3 flex items-center justify-between",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">iG</span>
        </div>
        <span className="font-headline font-bold text-xl text-primary">iGreen Energy</span>
      </div>
      <Button 
        onClick={onCTAClick}
        className="rounded-full font-bold shadow-lg bg-primary hover:bg-primary/90 transition-all"
      >
        Faça parte da transição energética
      </Button>
    </header>
  );
}
