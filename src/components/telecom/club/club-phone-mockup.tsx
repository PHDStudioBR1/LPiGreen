"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Gift,
  Signal,
  Users,
  Wallet,
  Wifi,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ClubPhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: [0, -10, 0] }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          opacity: { duration: 0.7, ease },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        }}
      >
        <div
          className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#0a0d0b] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          role="img"
          aria-label="Interface do aplicativo iGreen Club exibindo consumo, saldo, cashback e benefícios"
        >
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80" />

          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#0f1411] to-[#060806]">
            <div className="flex items-center justify-between px-5 pb-2 pt-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  iGreen Club
                </p>
                <p className="font-tc-headline text-sm font-bold text-white">Olá, Maria</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00e676]/15">
                <span className="text-xs font-bold text-[#00e676]">MC</span>
              </div>
            </div>

            <div className="mx-4 mb-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5 text-[#00e676]" />
                  <span className="text-[10px] font-medium text-white/60">Consumo de internet</span>
                </div>
                <span className="text-[10px] font-semibold text-[#00e676]">62%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#00e676] to-[#00c853]" />
              </div>
              <p className="mt-1.5 text-[10px] text-white/50">12,4 GB de 20 GB</p>
            </div>

            <div className="mx-4 mb-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5">
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/40">
                  Saldo acumulado
                </p>
                <p className="mt-0.5 font-tc-headline text-sm font-bold text-[#00e676]">+3,2 GB</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5">
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/40">
                  Cashback
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-[#00e676]" />
                  <p className="font-tc-headline text-sm font-bold text-white">R$ 12,50</p>
                </div>
              </div>
            </div>

            <div className="mx-4 mb-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-[#00e676]/20 bg-[#00e676]/[0.06] p-2.5">
                <Gift className="h-4 w-4 shrink-0 text-[#00e676]" />
                <div>
                  <p className="text-[9px] text-white/50">Descontos</p>
                  <p className="text-[11px] font-semibold text-white">847 ativos</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5">
                <CreditCard className="h-4 w-4 shrink-0 text-white/60" />
                <div>
                  <p className="text-[9px] text-white/50">Fatura Março</p>
                  <p className="text-[11px] font-semibold text-white">R$ 69,90</p>
                </div>
              </div>
            </div>

            <div className="mx-4 mb-4 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              <Users className="h-3.5 w-3.5 text-[#00e676]" />
              <div className="flex-1">
                <p className="text-[10px] font-medium text-white/70">Plano Família</p>
                <p className="text-[9px] text-white/40">3 linhas ativas</p>
              </div>
              <Signal className="h-3.5 w-3.5 text-white/30" />
            </div>
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-[#00e676]/10 blur-2xl"
          animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
