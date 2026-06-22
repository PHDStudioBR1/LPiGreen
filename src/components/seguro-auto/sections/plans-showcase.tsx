"use client";

import { cn } from "@/lib/utils";
import { SEGUROS_PLANS } from "@/lib/seguros/data";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { PremiumCard } from "@/components/seguro-auto/ui/premium-card";
import { MotionBlock, MotionStagger, MotionItem } from "@/components/seguro-auto/ui/motion";

export function PlansShowcase() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Planos"
            title="Opções sob medida para cada necessidade"
            description="Escolha o nível de proteção ideal para o seu veículo, com coberturas claras e assistência quando você precisar."
          />
        </MotionBlock>

        <MotionStagger className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {SEGUROS_PLANS.map((plan) => (
            <MotionItem key={plan.id}>
              <PremiumCard
                padding="lg"
                className={cn(
                  "h-full",
                  plan.highlighted && "border-sa-primary/30 ring-1 ring-sa-primary/20"
                )}
              >
                {plan.badge && (
                  <span className="mb-4 inline-block rounded-full bg-sa-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sa-primary">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-sa-headline text-2xl font-bold text-sa-text">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-sa-muted">{plan.description}</p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sa-primary" />
                      <div>
                        <p className="text-sm font-semibold text-sa-text">{feature.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-sa-muted">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </PremiumCard>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
