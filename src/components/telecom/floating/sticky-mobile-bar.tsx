"use client";

import { motion } from "framer-motion";
import { trackTelecomQuoteClick } from "@/lib/telecom/analytics";
import { Button } from "@/components/telecom/ui/button";

type StickyMobileBarProps = {
  onQuoteClick: () => void;
};

export function StickyMobileBar({ onQuoteClick }: StickyMobileBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-telecom-border/60 bg-white/95 p-4 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <Button
        fullWidth
        onClick={() => {
          trackTelecomQuoteClick("sticky_mobile");
          onQuoteClick();
        }}
        className="h-12"
      >
        Contratar agora
      </Button>
    </motion.div>
  );
}
