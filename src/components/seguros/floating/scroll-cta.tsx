"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/seguros/use-scroll-progress";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";

type ScrollCtaProps = {
  onQuoteClick: () => void;
};

export function ScrollCta({ onQuoteClick }: ScrollCtaProps) {
  const show = useScrollProgress(0.5);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-40 items-center gap-4 seguros-glass rounded-full pl-6 pr-2 py-2 seguros-glow"
        >
          <p className="text-seguros-text font-semibold text-sm whitespace-nowrap">
            Pronto para proteger seu veículo?
          </p>
          <button
            type="button"
            onClick={() => {
              trackSegurosQuoteClick("scroll_cta", "Cotação Grátis");
              onQuoteClick();
            }}
            className="seguros-btn-primary h-10 px-6 rounded-full text-sm font-extrabold whitespace-nowrap"
          >
            Cotação Grátis
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
