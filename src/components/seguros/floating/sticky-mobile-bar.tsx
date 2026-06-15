"use client";

import { MessageCircle } from "lucide-react";
import { SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";

type StickyMobileBarProps = {
  onQuoteClick: () => void;
};

export function StickyMobileBar({ onQuoteClick }: StickyMobileBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-seguros-primary/20 p-3 seguros-glass seguros-safe-area-pb md:hidden">
      <div className="flex gap-2 sm:gap-3">
        <a
          href={SEGUROS_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="seguros-btn-outline inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-bold sm:h-12 sm:gap-2 sm:text-sm"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onQuoteClick}
          className="seguros-btn-primary h-11 flex-[1.4] rounded-xl text-xs font-extrabold sm:h-12 sm:text-sm"
        >
          Cotação Grátis
        </button>
      </div>
    </div>
  );
}
