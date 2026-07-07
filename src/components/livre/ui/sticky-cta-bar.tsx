"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LIVRE_CTA_LABEL } from "@/lib/livre/constants";
import { scrollToLivreCta } from "@/lib/livre/scroll";
import { LivreButton } from "./button";

const SHOW_AFTER_PX = 480;

export function LivreStickyCtaBar() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReducedMotion ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={prefersReducedMotion ? undefined : { y: "100%" }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-livre-petrol-500/60 bg-livre-bg-elevated/95 px-4 py-3 shadow-lv-navbar backdrop-blur-md lg:hidden"
          role="region"
          aria-label="Ação rápida"
        >
          <LivreButton
            size="lg"
            fullWidth
            rightIcon={ArrowRight}
            onClick={scrollToLivreCta}
            className="h-12"
          >
            {LIVRE_CTA_LABEL}
          </LivreButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
