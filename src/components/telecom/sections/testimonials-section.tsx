"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IGREEN_VIDEO_TESTIMONIALS } from "@/lib/video-testimonials";
import { VimeoTestimonialPlayer } from "@/components/shared/vimeo-testimonial-player";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { MotionBlock } from "@/components/telecom/ui/motion";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Depoimentos"
            title="O que nossos clientes dizem"
            description="Milhares de brasileiros já migraram para a Telecom iGreen e estão economizando todos os meses com planos inteligentes e os benefícios exclusivos do iGreen Club."
          />
        </MotionBlock>

        <MotionBlock delay={0.1}>
          <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-4xl">
            <CarouselContent className="-ml-4">
              {IGREEN_VIDEO_TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2">
                  <div className="telecom-testimonial-video">
                    <VimeoTestimonialPlayer
                      vimeoId={testimonial.vimeoId}
                      title={`Depoimento iGreen Telecom ${testimonial.id}`}
                    />
                  </div>
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
