"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/livre/ui/container";
import { LivreButton } from "@/components/livre/ui/button";
import { LIVRE_HERO_CTA_LABEL } from "@/lib/livre/constants";
import { scrollToLivreCta } from "@/lib/livre/scroll";
import { HeroBackground } from "./hero-background";
import { HeroVisual } from "./hero-visual";

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-screen overflow-hidden bg-livre-bg-base"
    >
      <HeroBackground />

      <Container className="relative z-10 flex min-h-screen items-center py-20 lg:py-24">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.h1
              id="hero-heading"
              variants={itemVariants}
              className="font-lv-headline text-[clamp(1.875rem,4.2vw,3.25rem)] font-extrabold leading-[1.12] tracking-tight text-white text-balance"
            >
              Reduza em{" "}
              <span className="livre-hero-gradient-text">até 30%</span> a conta de energia da
              sua empresa sem gastar um real em investimento.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg sm:leading-relaxed text-pretty"
            >
              Migre para o Mercado Livre de Energia e garanta sustentabilidade, praticidade e
              previsibilidade orçamentária para o seu negócio.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10">
              <LivreButton
                size="lg"
                rightIcon={ArrowRight}
                onClick={scrollToLivreCta}
                className="h-14 w-full px-8 text-base sm:w-auto sm:min-w-[320px]"
              >
                {LIVRE_HERO_CTA_LABEL}
              </LivreButton>
              <p className="mt-3 text-sm text-white/50">
                Simulação 100% gratuita · Sem compromisso · Resposta em até 24h
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.25 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-livre-bg-base via-livre-bg-base/80 to-transparent"
      />
    </section>
  );
}
