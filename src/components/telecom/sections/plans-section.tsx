"use client";

import { Check } from "lucide-react";
import { trackTelecomPlanSelect, trackTelecomQuoteClick } from "@/lib/telecom/analytics";
import { TELECOM_PLANS } from "@/lib/telecom/data";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { Button } from "@/components/telecom/ui/button";
import { PremiumCard } from "@/components/telecom/ui/premium-card";
import { MotionBlock, MotionItem, MotionStagger } from "@/components/telecom/ui/motion";
import { cn } from "@/lib/utils";

type PlansSectionProps = {
  onQuoteClick?: () => void;
};

export function PlansSection({ onQuoteClick }: PlansSectionProps) {
  return (
    <section id="planos" className="relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Planos"
            title="Escolha o plano ideal para você"
            description="Preços transparentes, sem taxas escondidas e sem fidelidade. Cancele quando quiser."
          />
        </MotionBlock>

        <MotionStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TELECOM_PLANS.map((plan) => (
            <MotionItem key={plan.id}>
              <PremiumCard
                className={cn(
                  "relative flex h-full flex-col",
                  plan.highlighted && "border-[#00e676]/40 ring-2 ring-[#00e676]/20"
                )}
                hover
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00e676] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#060806]">
                    {plan.badge}
                  </span>
                )}
                <p className="text-sm font-semibold text-white/60">{plan.name}</p>
                <p className="mt-2 font-tc-headline text-3xl font-bold text-white">
                  {plan.data}
                </p>
                <p className="mt-1 text-sm text-white/50">{plan.dataDetail}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-white/55">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00e676]" strokeWidth={2.5} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-sm font-medium text-white/60">R$</span>
                  <span className="font-tc-headline text-3xl font-bold text-[#00e676]">
                    {plan.price.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-sm text-white/50">/mês</span>
                </div>
                <p className="mt-1 text-xs text-white/45">
                  Sem portabilidade: R${plan.priceWithoutPortability.toFixed(2).replace(".", ",")}
                </p>
                <Button
                  variant={plan.highlighted ? "primary" : "secondary"}
                  fullWidth
                  className="mt-6"
                  onClick={() => {
                    trackTelecomPlanSelect(plan.id);
                    trackTelecomQuoteClick(`plan_${plan.id}`);
                    onQuoteClick?.();
                  }}
                >
                  {plan.ctaLabel}
                </Button>
              </PremiumCard>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
