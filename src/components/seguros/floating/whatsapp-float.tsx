"use client";

import { MessageCircle } from "lucide-react";
import { SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={SEGUROS_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-50 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#25D366] text-white seguros-whatsapp-pulse shadow-2xl transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle size={28} fill="currentColor" />
    </a>
  );
}
