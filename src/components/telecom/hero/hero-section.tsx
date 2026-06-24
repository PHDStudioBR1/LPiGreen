"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Gift, Sparkles } from "lucide-react";
import { trackTelecomQuoteClick, trackTelecomSimulatorUse } from "@/lib/telecom/analytics";
import { TELECOM_TRUST_ITEMS } from "@/lib/telecom/constants";
import { Container } from "@/components/telecom/ui/container";
import { HeroPhoneMockup } from "@/components/telecom/hero/hero-phone-mockup";

type HeroSectionProps = {
  onQuoteClick?: () => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

export function HeroSection({ onQuoteClick }: HeroSectionProps) {
  const handleQuote = (location: string) => {
    trackTelecomQuoteClick(location);
    onQuoteClick?.();
  };

  const handleSimulate = () => {
    trackTelecomSimulatorUse("hero");
    handleQuote("hero_plans");
  };

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-[98px] text-white sm:pt-[100px] lg:pt-[140px]"
    >
      <Container className="relative pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-28 lg:pt-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">
          {/* Left content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 text-[#00e676]" />
              Conexão · Benefícios
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-tc-headline text-[clamp(2.25rem,5.5vw,3.65rem)] font-bold leading-[1.08] tracking-tight text-white"
            >
              Conexão que gera{" "}
              <span className="relative inline-block text-[#00e676]">
                liberdade.
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-[#00e676]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.7, delay: 0.95, ease }}
                  aria-hidden
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg leading-relaxed text-white/60 sm:text-xl"
            >
              Internet que acumula, conecta e te dá benefícios todos os dias.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-[#00e676]/25">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#00e676]/15">
                  <BarChart3 className="h-4 w-4 text-[#00e676]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00e676]">
                  Internet acumulativa
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                  Sua internet não expira. Acumule, ganhe bônus e tenha muito mais liberdade.
                </p>
              </article>

              <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-[#a78bfa]/25">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#a78bfa]/15">
                  <Gift className="h-4 w-4 text-[#a78bfa]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#a78bfa]">
                  iGreen Club
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                  Descontos exclusivos em mais de 30.000 parceiros perto de você.
                </p>
              </article>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <motion.button
                type="button"
                onClick={handleSimulate}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#00e676] px-7 text-sm font-semibold text-[#060806] shadow-[0_4px_24px_rgba(0,230,118,0.35)] transition-shadow hover:shadow-[0_6px_32px_rgba(0,230,118,0.45)]"
              >
                Conheça os planos
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <button
                type="button"
                onClick={() => handleQuote("hero_activate")}
                className="inline-flex h-12 items-center gap-1.5 px-2 text-sm font-semibold text-white/80 transition-colors hover:text-[#00e676]"
              >
                Ativar Telecom iGreen Agora
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.button
              variants={fadeUp}
              type="button"
              onClick={() => handleQuote("hero_portability")}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#00e676]/20 bg-[#00e676]/[0.06] px-4 py-2 text-xs font-medium text-[#00e676] transition-colors hover:bg-[#00e676]/10"
            >
              <span aria-hidden>💚</span>
              Portabilidade premiada: ganhe seu primeiro mês grátis
              <ArrowRight className="h-3 w-3" />
            </motion.button>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/40"
            >
              {TELECOM_TRUST_ITEMS.map((item) => (
                <span key={item.id} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#00e676]" />
                  {item.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease }}
            className="relative lg:pl-4"
          >
            <HeroPhoneMockup />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
