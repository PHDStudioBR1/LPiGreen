"use client";

import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TELECOM_TESTIMONIALS } from "@/lib/telecom/data";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { PremiumCard } from "@/components/telecom/ui/premium-card";
import { MotionBlock } from "@/components/telecom/ui/motion";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Depoimentos"
            title="O que nossos clientes dizem"
            description="Milhares de brasileiros já migraram e estão economizando com a Telecom iGreen."
          />
        </MotionBlock>

        <MotionBlock delay={0.1}>
          <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-4xl">
            <CarouselContent className="-ml-4">
              {TELECOM_TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2">
                  <PremiumCard className="flex h-full flex-col">
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-telecom-warning text-telecom-warning"
                        />
                      ))}
                    </div>
                    <blockquote className="flex-1 text-sm leading-relaxed text-white/60">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 border-t border-white/[0.08] pt-4">
                      <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-white/50">{testimonial.role}</p>
                    </div>
                  </PremiumCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </MotionBlock>
      </Container>
    </section>
  );
}
