"use client";

import { motion } from "framer-motion";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

type ClubSectionProps = {
  onQuoteClick?: () => void;
};

export function ClubSection({ onQuoteClick }: ClubSectionProps) {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <MotionBlock>
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-sa-primary to-[#0039A0] shadow-[0_24px_80px_rgba(0,70,192,0.25)]">
            <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
              <div className="text-white">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  iGreen Club
                </p>
                <h2 className="font-sa-headline text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight">
                  Benefícios exclusivos para clientes
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                  Descontos em parceiros, cashback em serviços automotivos e vantagens especiais
                  para quem protege o veículo com a iGreen.
                </p>
                <div className="mt-8">
                  <Button
                    variant="secondary"
                    className="border-white/20 bg-white text-sa-primary hover:bg-white/90"
                    onClick={() => {
                      trackSegurosQuoteClick("club");
                      onQuoteClick?.();
                    }}
                  >
                    Conhecer benefícios
                  </Button>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <motion.img
                  src="/images/seguros/igreen club.webp"
                  alt="iGreen Club — benefícios exclusivos"
                  className="max-h-72 w-auto rounded-2xl object-contain shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>
        </MotionBlock>
      </Container>
    </section>
  );
}
