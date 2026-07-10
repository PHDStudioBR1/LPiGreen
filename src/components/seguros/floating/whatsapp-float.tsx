"use client";

import { ClipboardList } from "lucide-react";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";

type QuoteFloatProps = {
  onQuoteClick: () => void;
};

export function WhatsAppFloat({ onQuoteClick }: QuoteFloatProps) {
  return (
    <button
      type="button"
      aria-label="Abrir formulário de cotação"
      onClick={() => {
        trackSegurosQuoteClick("float");
        onQuoteClick();
      }}
      className="fixed bottom-[5.5rem] right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-seguros-primary text-white seguros-whatsapp-pulse shadow-2xl transition-transform hover:scale-110 active:scale-95 sm:right-4 md:bottom-8 md:right-6 md:h-16 md:w-16"
    >
      <ClipboardList className="h-6 w-6 md:h-7 md:w-7" />
    </button>
  );
}
