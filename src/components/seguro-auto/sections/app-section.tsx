"use client";

import { SEGUROS_APP_DRIVER_FEATURES } from "@/lib/seguros/data";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

type AppSectionProps = {
  onQuoteClick?: () => void;
};

export function AppSection({ onQuoteClick }: AppSectionProps) {
  return (
    <section className="bg-sa-surface/60 py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <MotionBlock
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <SectionHeading
              align="left"
              eyebrow="+ praticidade"
              title="Baixe o app com todo o cuidado iGreen"
              description="O aplicativo que tem tudo que você precisa: assistência 24 horas, gestão da apólice, sinistros e muito mais."
              className="mb-8 md:mb-10"
            />
            <ul className="space-y-5">
              {SEGUROS_APP_DRIVER_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.label} className="flex gap-4">
                    <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                      <Icon className="h-5 w-5 text-sa-primary" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-sa-text">{feature.label}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-sa-muted">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10">
              <Button
                onClick={() => {
                  trackSegurosQuoteClick("app");
                  onQuoteClick?.();
                }}
              >
                Cotar pelo app
              </Button>
            </div>
          </MotionBlock>

          <MotionBlock
            variants={{
              hidden: { opacity: 0, x: 32 },
              visible: { opacity: 1, x: 0 },
            }}
            delay={0.15}
            className="flex justify-center"
          >
            <img
              src="/images/seguros/Seguro-iGreen-apps.webp"
              alt="Aplicativo Seguro iGreen"
              className="max-h-[480px] w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.12)]"
            />
          </MotionBlock>
        </div>
      </Container>
    </section>
  );
}
