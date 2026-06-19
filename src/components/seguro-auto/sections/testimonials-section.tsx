"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEGUROS_TESTIMONIALS } from "@/lib/seguros/data";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { PremiumCard } from "@/components/seguro-auto/ui/premium-card";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);
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
    <section id="depoimentos" className="bg-sa-surface/60 py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Depoimentos"
            title="Na voz de quem confia na iGreen"
            description="Histórias reais de clientes que encontraram a proteção que precisavam."
          />
        </MotionBlock>

        <MotionBlock delay={0.1}>
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {SEGUROS_TESTIMONIALS.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                  >
                    <PremiumCard padding="lg" className="h-full">
                      <div className="mb-5 flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="text-base leading-relaxed text-sa-text">
                        &ldquo;{testimonial.comment}&rdquo;
                      </p>
                      <div className="mt-8 flex items-center gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-sa-border/60"
                        />
                        <div>
                          <p className="text-sm font-semibold text-sa-text">{testimonial.name}</p>
                          <p className="text-xs text-sa-muted">{testimonial.city}</p>
                        </div>
                      </div>
                    </PremiumCard>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollPrev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sa-border bg-white transition-colors hover:border-sa-primary hover:text-sa-primary"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {SEGUROS_TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === selectedIndex ? "w-8 bg-sa-primary" : "w-1.5 bg-sa-border"
                    )}
                    aria-label={`Ir para depoimento ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={scrollNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sa-border bg-white transition-colors hover:border-sa-primary hover:text-sa-primary"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </MotionBlock>
      </Container>
    </section>
  );
}
