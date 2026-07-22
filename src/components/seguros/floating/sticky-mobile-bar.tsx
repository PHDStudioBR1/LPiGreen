"use client";

import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";

type StickyMobileBarProps = {
  onQuoteClick: () => void;
};

export function StickyMobileBar({ onQuoteClick }: StickyMobileBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-seguros-primary/20 p-3 seguros-glass seguros-safe-area-pb md:hidden">
      <button
        type="button"
        onClick={() => {
          trackSegurosQuoteClick("sticky_mobile", "Cotação Grátis");
          onQuoteClick();
        }}
        className="seguros-btn-primary h-11 w-full rounded-xl text-xs font-extrabold sm:h-12 sm:text-sm"
      >
        Cotação Grátis
      </button>
    </div>
  );
}
