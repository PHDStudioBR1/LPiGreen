"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useExitIntent } from "@/hooks/seguros/use-exit-intent";
import { SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";

type ExitIntentPopupProps = {
  onQuoteClick: () => void;
};

export function ExitIntentPopup({ onQuoteClick }: ExitIntentPopupProps) {
  const { show, dismiss } = useExitIntent();

  const handleQuote = () => {
    dismiss();
    onQuoteClick();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-[70] max-w-md mx-auto seguros-glass rounded-3xl p-8 seguros-glow"
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-4 right-4 text-seguros-muted hover:text-seguros-text transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-seguros-primary text-sm font-bold uppercase tracking-wider mb-2">
              Espere!
            </p>
            <h3 className="font-seguros-headline text-2xl font-extrabold text-seguros-text mb-3">
              Sua cotação gratuita está a 2 minutos de distância
            </h3>
            <p className="text-seguros-muted mb-6 leading-relaxed">
              Sem consulta SPC, sem fidelidade e aprovação em minutos. Não perca essa oportunidade.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleQuote}
                className="seguros-btn-primary h-12 rounded-xl font-extrabold"
              >
                Fazer Cotação Gratuita
              </button>
              <a
                href={SEGUROS_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="seguros-btn-outline h-12 rounded-xl font-bold inline-flex items-center justify-center"
              >
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
