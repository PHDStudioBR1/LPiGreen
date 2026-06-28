"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/seguros/use-scroll-progress";
import { trackTelecomQuoteClick } from "@/lib/telecom/analytics";
import { Button } from "@/components/telecom/ui/button";

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
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-4 rounded-full border border-telecom-border/60 bg-white/95 py-2 pl-6 pr-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md md:flex"
        >
          <p className="whitespace-nowrap text-sm font-semibold text-telecom-text">
            Pronto para se conectar?
          </p>
          <Button
            onClick={() => {
              trackTelecomQuoteClick("scroll_cta");
              onQuoteClick();
            }}
            className="h-10 px-6 text-sm"
          >
            Contratar agora
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
