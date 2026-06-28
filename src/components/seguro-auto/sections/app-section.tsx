"use client";

import { SEGUROS_APP_DRIVER_FEATURES } from "@/lib/seguros/data";
import { trackSegurosQuoteClick } from "@/lib/seguro-auto/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

type AppSectionProps = {
  onQuoteClick?: () => void;
};

export function AppSection({ onQuoteClick }: AppSectionProps) {
  return (
    <section id="motorista-app" className="bg-sa-surface/60 py-20 md:py-28">
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
              eyebrow="Para Motoristas de App"
              title="Motorista de Uber, 99 ou iFood? Aqui você é bem-vindo."
              description="A iGreen oferece proteção também para motoristas de aplicativo. Diferente de muitos seguros tradicionais, o processo é simples e descomplicado: basta informar corretamente o uso profissional do veículo no momento da cotação para garantir sua cobertura."
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

            <div className="mt-8 space-y-3">
              <h3 className="font-sa-headline text-lg font-bold text-sa-text">
                Cotação para motoristas de app
              </h3>
              <p className="text-sm leading-relaxed text-sa-muted">
                <strong className="font-semibold text-sa-text">Importante:</strong> Ao solicitar sua
                cotação, informe que utiliza o veículo para aplicativo. O uso profissional é
                considerado no cálculo da mensalidade e a informação correta é essencial para
                garantir a validade da sua cobertura em caso de sinistro.
              </p>
            </div>

            <div className="mt-10">
              <Button
                onClick={() => {
                  trackSegurosQuoteClick("app_driver");
                  onQuoteClick?.();
                }}
              >
                Cotar para Motorista de App
              </Button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-sa-muted">
              * O prazo de até 30 dias para indenização começa a contar após a entrega completa e
              aprovação dos documentos exigidos pela seguradora.
            </p>
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
              alt="Seguro iGreen para motoristas de aplicativo"
              className="max-h-[520px] w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.12)]"
            />
          </MotionBlock>
        </div>
      </Container>
    </section>
  );
}
