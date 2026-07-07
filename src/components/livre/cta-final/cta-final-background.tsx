"use client";

import { motion, useReducedMotion } from "framer-motion";

export function CtaFinalBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="livre-cta-final-mesh absolute inset-0" />

      <motion.div
        className="livre-cta-orb absolute -left-32 top-1/4 h-[480px] w-[480px] rounded-full bg-livre-primary/20 blur-[100px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.12, 1], opacity: [0.5, 0.75, 0.5] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="livre-cta-orb absolute -right-24 bottom-0 h-[400px] w-[400px] rounded-full bg-livre-accent/15 blur-[90px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1.05, 1, 1.05], opacity: [0.4, 0.65, 0.4] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="livre-cta-orb absolute left-1/2 top-0 h-[320px] w-[600px] -translate-x-1/2 rounded-full bg-livre-primary/10 blur-[80px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.3, 0.55, 0.3] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-livre-accent/30 to-transparent" />
    </div>
  );
}
