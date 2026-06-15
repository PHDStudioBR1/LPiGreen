"use client";

import { MessageCircle } from "lucide-react";
import { SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";

type StickyMobileBarProps = {
  onQuoteClick: () => void;
};

export function StickyMobileBar({ onQuoteClick }: StickyMobileBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden seguros-glass border-t border-seguros-primary/20 p-3 safe-area-pb">
      <div className="flex gap-3">
        <a
          href={SEGUROS_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-12 rounded-xl seguros-btn-outline inline-flex items-center justify-center gap-2 font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onQuoteClick}
          className="flex-[1.4] h-12 rounded-xl seguros-btn-primary text-sm font-extrabold"
        >
          Cotação Grátis
        </button>
      </div>
    </div>
  );
}
