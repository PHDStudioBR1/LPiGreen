"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEGUROS_PLANS } from "@/lib/seguros/data";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { PremiumCard } from "@/components/seguro-auto/ui/premium-card";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

export function PlansShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

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

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {SEGUROS_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
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
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-sa-headline text-3xl font-bold text-sa-primary">
                        {plan.price}
                      </span>
                      <span className="text-sm text-sa-muted">{plan.priceNote}</span>
                    </div>
                    <ul className="mt-8 space-y-4">
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
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollPrev}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sa-border bg-white text-sa-text transition-colors hover:border-sa-primary hover:text-sa-primary"
              aria-label="Plano anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {SEGUROS_PLANS.map((plan, i) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === selectedIndex ? "w-8 bg-sa-primary" : "w-1.5 bg-sa-border"
                  )}
                  aria-label={`Ir para plano ${plan.name}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={scrollNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sa-border bg-white text-sa-text transition-colors hover:border-sa-primary hover:text-sa-primary"
              aria-label="Próximo plano"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
