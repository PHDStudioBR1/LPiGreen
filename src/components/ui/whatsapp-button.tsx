"use client";

import { MessageCircle } from "lucide-react";

type WhatsAppButtonProps = {
  onClick?: () => void;
  href?: string;
};

export function WhatsAppButton({
  onClick,
  href = "https://wa.me/5500000000000",
}: WhatsAppButtonProps) {
  const className =
    "fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 animate-pulse-soft";

  if (onClick) {
    return (
      <button
        type="button"
        aria-label="Fale conosco no WhatsApp"
        onClick={onClick}
        className={className}
      >
        <MessageCircle size={32} fill="currentColor" />
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className={className}
    >
      <MessageCircle size={32} fill="currentColor" />
    </a>
  );
}
