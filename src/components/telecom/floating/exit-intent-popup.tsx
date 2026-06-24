"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useExitIntent } from "@/hooks/seguros/use-exit-intent";
import { trackTelecomExitIntent, trackTelecomQuoteClick } from "@/lib/telecom/analytics";
import { Button } from "@/components/telecom/ui/button";

type ExitIntentPopupProps = {
  onQuoteClick: () => void;
};

export function ExitIntentPopup({ onQuoteClick }: ExitIntentPopupProps) {
  const { show, dismiss } = useExitIntent();

  useEffect(() => {
    if (show) trackTelecomExitIntent("show");
  }, [show]);

  const handleDismiss = () => {
    trackTelecomExitIntent("dismiss");
    dismiss();
  };

  const handleQuote = () => {
    trackTelecomExitIntent("quote");
    trackTelecomQuoteClick("exit_intent");
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
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-4 right-4 top-1/2 z-[70] mx-auto max-w-md -translate-y-1/2 rounded-[1.75rem] border border-telecom-border/60 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.15)] sm:p-8"
          >
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute right-4 top-4 text-telecom-muted transition-colors hover:text-telecom-text"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-telecom-primary">
              Espere!
            </p>
            <h3 className="mb-3 font-tc-headline text-xl font-bold text-telecom-text sm:text-2xl">
              Seu plano ideal está a 2 minutos de distância
            </h3>
            <p className="mb-6 leading-relaxed text-telecom-muted">
              Sem fidelidade, eSIM instantâneo e cashback no primeiro mês. Não perca essa oportunidade.
            </p>

            <Button fullWidth onClick={handleQuote} className="h-12">
              Contratar agora — grátis
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
