"use client";

import { motion } from "framer-motion";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

type HeroSectionProps = {
  onQuoteClick?: () => void;
};

export function HeroSection({ onQuoteClick }: HeroSectionProps) {
  const handleQuote = () => {
    trackSegurosQuoteClick("hero");
    onQuoteClick?.();
  };

  return (
    <section id="inicio" className="relative overflow-hidden bg-white pt-[108px] lg:pt-[120px]">
      <div className="pointer-events-none absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-sa-primary/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-sa-primary/[0.03] blur-3xl" />

      <Container className="relative pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionBlock as="div" className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sa-primary">
              Seguro Auto iGreen
            </p>
            <h1 className="font-sa-headline text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-sa-text">
              Proteção veicular que combina com você
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-sa-muted sm:text-xl">
              Conte com um seguro digital sem consulta SPC, sem fidelidade e com assistência 24h —
              contratação 100% online em minutos.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={handleQuote} className="h-12 px-8 text-base">
                Fazer cotação
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const el = document.getElementById("planos");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 px-8 text-base"
              >
                Ver planos
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-sa-muted">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sa-primary" />
                Regulamentado SUSEP
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sa-primary" />
                Sem fidelidade
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sa-primary" />
                Ativação em 24h
              </span>
            </div>
          </MotionBlock>

          <MotionBlock
            as="div"
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0 },
            }}
            delay={0.15}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(0,70,192,0.12)]">
              <motion.img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=900&fit=crop&q=80"
                alt="Veículo protegido com seguro iGreen"
                className="aspect-[4/3] w-full object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sa-primary/20 via-transparent to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-4 rounded-2xl border border-sa-border/60 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:-left-8"
            >
              <p className="text-2xl font-bold text-sa-primary">+50 mil</p>
              <p className="text-sm text-sa-muted">veículos protegidos</p>
            </motion.div>
          </MotionBlock>
        </div>
      </Container>
    </section>
  );
}
