"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="livre-hero-mesh absolute inset-0" />
      <div className="livre-hero-grid absolute inset-0 opacity-60" />

      <motion.div
        className="absolute -left-[20%] top-[10%] h-[480px] w-[480px] rounded-full bg-livre-primary/20 blur-[120px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[10%] top-[5%] h-[400px] w-[400px] rounded-full bg-livre-accent/10 blur-[100px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, -32, 0], y: [0, 20, 0], scale: [1, 1.04, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[30%] h-[320px] w-[320px] rounded-full bg-livre-petrol-600/40 blur-[90px]"
        animate={
          prefersReducedMotion
            ? undefined
            : { x: [0, 24, 0], y: [0, -16, 0] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
}
