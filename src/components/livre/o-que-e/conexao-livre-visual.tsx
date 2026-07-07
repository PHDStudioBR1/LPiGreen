"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Handshake,
  Leaf,
  Lock,
  Sun,
  TrendingDown,
  UtilityPole,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type ConexaoLivreVisualProps = {
  className?: string;
};

export function ConexaoLivreVisual({ className }: ConexaoLivreVisualProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-livre-primary/8 blur-3xl"
        aria-hidden
      />

      <div className="relative space-y-5">
        {/* Comparação visual: cativo vs livre */}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch sm:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease }}
            className="livre-glass rounded-lv-xl border border-white/8 p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lv-lg border border-white/10 bg-white/5 text-white/50">
                <Lock className="size-4" aria-hidden />
              </div>
              <div>
                <p className="font-lv-headline text-sm font-semibold leading-snug text-white/70">
                  Cliente cativo da distribuidora
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-4">
              <Building2 className="size-8 text-white/40" aria-hidden />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <Lock className="size-3.5 shrink-0 text-white/30" aria-hidden />
                <span className="text-xs text-white/50">Distribuidora</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.15 }}
            className="hidden items-center justify-center sm:flex"
            aria-hidden
          >
            <div className="flex size-10 items-center justify-center rounded-full border border-livre-primary/30 bg-livre-primary/10">
              <ArrowRight className="size-4 text-livre-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="relative overflow-hidden rounded-lv-xl border border-livre-primary/25 bg-gradient-to-br from-livre-primary/10 via-livre-bg-elevated to-livre-bg-surface p-5 shadow-lv-glow sm:p-6"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/40 to-transparent"
              aria-hidden
            />
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lv-lg border border-livre-primary/30 bg-livre-primary/15 text-livre-primary">
                <Handshake className="size-4" aria-hidden />
              </div>
              <div>
                <p className="font-lv-headline text-sm font-semibold leading-snug text-livre-text">
                  Negociar diretamente o fornecedor e o preço da energia
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-livre-primary/15 bg-livre-primary/5 p-4">
              <Building2 className="size-8 text-livre-accent" aria-hidden />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-livre-primary/30 to-transparent" />
              <div className="flex w-full items-center justify-center gap-2">
                <Handshake className="size-3.5 text-livre-primary" aria-hidden />
                <span className="text-xs font-medium text-livre-text/80">ACL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="size-3 text-livre-primary" aria-hidden />
                <Sun className="size-3 text-livre-accent" aria-hidden />
                <TrendingDown className="size-3 text-livre-primary" aria-hidden />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ilustração da rede elétrica */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease, delay: 0.2 }}
          className="livre-glass overflow-hidden rounded-lv-xl border border-white/8"
        >
          <div className="border-b border-white/8 px-5 py-3">
            <div className="flex items-center gap-2">
              <Zap className="size-3.5 text-livre-accent" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-livre-accent">
                Infraestrutura local
              </p>
            </div>
          </div>

          <div className="relative px-5 py-6 sm:px-8 sm:py-8">
            <PowerGridIllustration animate={!prefersReducedMotion} />

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <UtilityPole className="size-3.5 text-livre-muted" aria-hidden />
                <span className="text-xs text-livre-muted">Postes</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <svg
                  viewBox="0 0 16 16"
                  className="size-3.5 text-livre-muted"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M1 8h14M8 1v14" strokeLinecap="round" />
                  <path d="M3 5h10M3 11h10" strokeLinecap="round" opacity="0.5" />
                </svg>
                <span className="text-xs text-livre-muted">Fios</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-livre-primary/20 bg-livre-primary/10 px-3 py-1.5">
                <Zap className="size-3.5 text-livre-primary" aria-hidden />
                <span className="text-xs font-medium text-livre-primary">Mesma rede</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PowerGridIllustration({ animate }: { animate: boolean }) {
  return (
    <svg
      viewBox="0 0 400 120"
      className="mx-auto w-full max-w-md"
      role="img"
      aria-label="Ilustração da rede elétrica com postes, fios e distribuidora local"
    >
      <defs>
        <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(100,255,218,0.2)" />
          <stop offset="50%" stopColor="rgba(0,200,83,0.5)" />
          <stop offset="100%" stopColor="rgba(100,255,218,0.2)" />
        </linearGradient>
      </defs>

      {/* Fios principais */}
      <line x1="20" y1="30" x2="380" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <line x1="20" y1="50" x2="380" y2="50" stroke="url(#wire-gradient)" strokeWidth="2" />
      <line x1="20" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* Postes */}
      {[60, 140, 220, 300, 340].map((x, i) => (
        <g key={x}>
          <rect x={x - 3} y="30" width="6" height="70" rx="1" fill="rgba(255,255,255,0.15)" />
          <line x1={x - 12} y1="38" x2={x + 12} y2="38" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          {animate && (
            <motion.circle
              cx={x}
              cy="50"
              r="3"
              fill="#00C853"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
          )}
        </g>
      ))}

      {/* Empresa */}
      <rect x="168" y="82" width="64" height="32" rx="6" fill="rgba(15,45,53,0.9)" stroke="rgba(0,200,83,0.4)" strokeWidth="1.5" />
      <rect x="180" y="90" width="12" height="12" rx="2" fill="rgba(100,255,218,0.3)" />
      <rect x="196" y="90" width="12" height="12" rx="2" fill="rgba(100,255,218,0.3)" />
      <rect x="212" y="90" width="12" height="12" rx="2" fill="rgba(100,255,218,0.3)" />
      <text x="200" y="108" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="system-ui">
        Sua empresa
      </text>

      {/* Conexão vertical empresa → rede */}
      <line x1="200" y1="82" x2="200" y2="70" stroke="rgba(0,200,83,0.6)" strokeWidth="2" strokeDasharray="3 2" />

      {/* Distribuidora */}
      <rect x="12" y="88" width="56" height="26" rx="5" fill="rgba(53,105,116,0.6)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="40" y="104" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="system-ui">
        Distribuidora
      </text>

      {/* Fluxo de energia animado */}
      {animate && (
        <motion.circle
          r="4"
          fill="#64FFDA"
          initial={{ cx: 68, cy: 50 }}
          animate={{ cx: [68, 200, 332], cy: 50 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}
    </svg>
  );
}
