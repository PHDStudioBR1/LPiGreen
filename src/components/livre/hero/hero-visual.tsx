"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, Leaf, LineChart, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIVRE_HERO_CTA_LABEL } from "@/lib/livre/constants";
import { scrollToLivreCta } from "@/lib/livre/scroll";

const ease = [0.22, 1, 0.36, 1] as const;

const benefits = [
  { icon: Leaf, label: "sustentabilidade" },
  { icon: Wallet, label: "praticidade" },
  { icon: LineChart, label: "previsibilidade orçamentária" },
] as const;

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <motion.div
        animate={
          prefersReducedMotion ? undefined : { y: [0, -8, 0] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className="absolute -inset-6 rounded-[2rem] bg-livre-primary/10 blur-3xl"
          aria-hidden
        />

        <div className="livre-glass-strong relative overflow-hidden rounded-[1.75rem] shadow-lv-lg">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="border-b border-white/8 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-livre-accent">
              Mercado Livre de Energia
            </p>
          </div>

          <div className="space-y-5 p-6 sm:p-7">
            <div className="rounded-2xl border border-livre-primary/20 bg-livre-primary/5 p-5">
              <p className="text-sm text-white/50">Reduza em</p>
              <p className="font-lv-headline text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                <span className="livre-hero-gradient-text">até 30%</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                a conta de energia da sua empresa sem gastar um real em investimento.
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <BarChart3 className="size-3.5 text-livre-primary" aria-hidden />
                  <span>conta de energia</span>
                </div>
                <span className="font-lv-headline text-xs font-semibold text-livre-primary">
                  até 30%
                </span>
              </div>
              <div className="flex h-24 items-end gap-2">
                <motion.div
                  className="w-full rounded-t-md bg-white/10"
                  initial={{ height: "100%" }}
                  animate={{ height: "70%" }}
                  transition={{ duration: 1.1, ease, delay: 0.6 }}
                  aria-hidden
                />
                <motion.div
                  className="w-full rounded-t-md bg-gradient-to-t from-livre-primary/80 to-livre-accent/60"
                  initial={{ height: "100%" }}
                  animate={{ height: "49%" }}
                  transition={{ duration: 1.1, ease, delay: 0.75 }}
                  aria-hidden
                />
              </div>
            </div>

            <ul className="grid gap-2 sm:grid-cols-3">
              {benefits.map(({ icon: Icon, label }, index) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.5 + index * 0.1 }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5",
                    index === 2 && "sm:col-span-1"
                  )}
                >
                  <Icon className="size-3.5 shrink-0 text-livre-primary" aria-hidden />
                  <span className="text-[11px] font-medium leading-tight text-white/70 sm:text-xs">
                    {label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.9 }}
          onClick={scrollToLivreCta}
          className="absolute -bottom-5 -right-2 z-10 cursor-pointer sm:-right-4"
          aria-label={LIVRE_HERO_CTA_LABEL}
        >
          <div className="livre-glass-strong rounded-2xl px-4 py-3 shadow-lv-glow transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-livre-primary">
            <p className="font-lv-headline text-sm font-bold leading-snug text-white">
              {LIVRE_HERO_CTA_LABEL}
            </p>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
