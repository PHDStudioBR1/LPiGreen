"use client";

import { SEGUROS_STEPS } from "@/lib/seguros/data";
import { trackSegurosQuoteClick } from "@/lib/seguro-auto/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock, MotionStagger, MotionItem } from "@/components/seguro-auto/ui/motion";

type HowItWorksSectionProps = {
  onQuoteClick?: () => void;
};

export function HowItWorksSection({ onQuoteClick }: HowItWorksSectionProps) {
  return (
    <section id="como-funciona" className="bg-sa-surface/60 py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Como funciona"
            title="Contrate em poucos passos"
            description="Do cadastro à proteção ativa, tudo acontece de forma simples e 100% digital."
          />
        </MotionBlock>

        <MotionStagger className="relative">
          <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-sa-border md:left-1/2 md:block md:-translate-x-px" />
          <div className="space-y-8 md:space-y-12">
            {SEGUROS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              return (
                <MotionItem key={step.id}>
                  <div
                    className={`flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-12 ${
                      isEven ? "" : "md:[&>div:first-child]:order-2"
                    }`}
                  >
                    <div className={`${isEven ? "md:text-right" : "md:text-left"}`}>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sa-primary text-sm font-bold text-white">
                        {step.id}
                      </span>
                      <h3 className="mt-4 font-sa-headline text-xl font-bold text-sa-text sm:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-sa-muted sm:text-base">
                        {step.description}
                      </p>
                    </div>
                    <div className={`flex ${isEven ? "md:justify-start" : "md:justify-end"}`}>
                      <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-sa-border/60 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                        <Icon className="h-9 w-9 text-sa-primary" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </MotionItem>
              );
            })}
          </div>
        </MotionStagger>

        <MotionBlock delay={0.15} className="mt-14 text-center">
          <Button
            onClick={() => {
              trackSegurosQuoteClick("how_it_works");
              onQuoteClick?.();
            }}
          >
            Começar cotação
          </Button>
        </MotionBlock>
      </Container>
    </section>
  );
}
