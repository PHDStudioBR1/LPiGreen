"use client";

import { Check } from "lucide-react";
import { SEGUROS_PLANS } from "@/lib/seguros/data";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { cn } from "@/lib/utils";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { Button } from "@/components/seguro-auto/ui/button";
import { PremiumCard } from "@/components/seguro-auto/ui/premium-card";
import { MotionBlock, MotionStagger, MotionItem } from "@/components/seguro-auto/ui/motion";

type PlansSectionProps = {
  onQuoteClick?: () => void;
};

export function PlansSection({ onQuoteClick }: PlansSectionProps) {
  return (
    <section id="planos" className="bg-white py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Preços"
            title="Escolha o plano ideal"
            description="Planos mensais sem fidelidade. Cancele quando quiser, sem multa."
          />
        </MotionBlock>

        <MotionStagger className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {SEGUROS_PLANS.map((plan) => (
            <MotionItem key={plan.id}>
              <PremiumCard
                padding="lg"
                className={cn(
                  "relative flex h-full flex-col",
                  plan.highlighted &&
                    "border-sa-primary/40 shadow-[0_16px_56px_rgba(0,70,192,0.14)] ring-1 ring-sa-primary/20 lg:-mt-4 lg:mb-4"
                )}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sa-primary px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {plan.badge}
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="font-sa-headline text-xl font-bold text-sa-text">{plan.name}</h3>
                  <p className="mt-1 text-sm text-sa-muted">{plan.description}</p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="font-sa-headline text-4xl font-bold text-sa-primary">
                    {plan.price}
                  </span>
                  <span className="text-sm text-sa-muted">{plan.priceNote}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sa-primary" strokeWidth={2.5} />
                      <span className="text-sa-muted">
                        <span className="font-medium text-sa-text">{feature.label}:</span>{" "}
                        {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  fullWidth
                  variant={plan.highlighted ? "primary" : "secondary"}
                  onClick={() => {
                    trackSegurosQuoteClick(`plan_${plan.id}`);
                    onQuoteClick?.();
                  }}
                >
                  Contratar
                </Button>
              </PremiumCard>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
