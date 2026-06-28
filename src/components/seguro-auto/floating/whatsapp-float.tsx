"use client";

import { MessageCircle } from "lucide-react";
import { SEGURO_AUTO_WHATSAPP_URL } from "@/lib/seguro-auto/constants";
import { trackSeguroAutoWhatsAppClick } from "@/lib/seguro-auto/analytics";

export function WhatsAppFloat() {
  return (
    <a
      href={SEGURO_AUTO_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      onClick={() => trackSeguroAutoWhatsAppClick("float")}
      className="fixed bottom-[5.5rem] right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 sm:right-4 md:bottom-8 md:right-6 md:h-16 md:w-16"
    >
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" />
    </a>
  );
}
