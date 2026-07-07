"use client";

import { Clock, Sparkles, TrendingDown, Zap } from "lucide-react";
import { Container } from "@/components/livre/ui/container";
import { LivreBadge } from "@/components/livre/ui/badge";
import { MotionBlock, MotionItem, MotionStagger } from "@/components/livre/ui/motion";
import { CtaFinalBackground } from "./cta-final-background";
import { CtaFinalForm } from "./cta-final-form";

const TRUST_ITEMS = [
  { icon: Zap, label: "Simulação 100% gratuita" },
  { icon: Clock, label: "Resposta em até 24h" },
  { icon: TrendingDown, label: "Economia de até 30%" },
] as const;

export function CtaFinalSection() {
  return (
    <section
      id="simulacao"
      aria-labelledby="cta-final-heading"
      className="livre-cta-final-section relative overflow-hidden py-20 lg:py-32"
    >
      <CtaFinalBackground />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 xl:gap-20">
          <MotionBlock as="div" className="max-w-xl lg:max-w-none">
            <LivreBadge
              variant="popular"
              size="lg"
              icon={<Sparkles className="size-3.5" aria-hidden />}
              className="mb-6"
            >
              Última chance de economizar
            </LivreBadge>

            <h2
              id="cta-final-heading"
              className="font-lv-headline text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-balance"
            >
              <span className="livre-cta-gradient-text">
                Não deixe dinheiro na mesa
              </span>{" "}
              pagando a tarifa mais cara do governo.
            </h2>

            <p className="mt-6 text-xl font-semibold text-livre-accent sm:text-2xl">
              Peça sua análise agora.
            </p>

            <p className="mt-4 text-base leading-relaxed text-livre-muted sm:text-lg">
              Envie sua fatura e descubra quanto sua empresa pode economizar no Mercado Livre de
              Energia — sem investimento, sem burocracia.
            </p>

            <MotionStagger className="mt-10 space-y-4">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <MotionItem key={label}>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-livre-primary/15 text-livre-primary">
                      <Icon className="size-4" aria-hidden />
                    </div>
                    <span className="text-sm font-medium text-livre-text sm:text-base">{label}</span>
                  </div>
                </MotionItem>
              ))}
            </MotionStagger>
          </MotionBlock>

          <MotionBlock as="div" delay={0.15}>
            <CtaFinalForm />
          </MotionBlock>
        </div>
      </Container>
    </section>
  );
}
