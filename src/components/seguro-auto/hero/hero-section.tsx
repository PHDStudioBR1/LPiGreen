"use client";

import { motion } from "framer-motion";
import { trackSegurosQuoteClick } from "@/lib/seguro-auto/analytics";
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
    <section id="inicio" className="relative overflow-hidden bg-white pt-[68px] lg:pt-[108px]">
      <div className="pointer-events-none absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-sa-primary/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-sa-primary/[0.03] blur-3xl" />

      <Container className="relative pb-16 pt-4 sm:pb-20 sm:pt-5 lg:pb-28 lg:pt-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionBlock as="div" className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sa-primary">
              Seguro Auto iGreen
            </p>
            <h1 className="font-sa-headline text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-sa-text">
              Proteção veicular que combina com você
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-sa-muted sm:text-xl">
              Conte com um seguro digital com pagamento mensal, sem consulta ao SPC, sem fidelidade e com assistência 24h —
              contratação 100% online em minutos.
            </p>
            <div className="mt-10">
              <Button onClick={handleQuote} className="h-12 px-8 text-base">
                Fazer cotação
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
            <motion.img
              src="/images/seguros/fundo_gl_seguros_colorido_quadrado.png"
              alt="Seguro iGreen — proteção veicular"
              className="w-full h-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </MotionBlock>
        </div>
      </Container>
    </section>
  );
}
