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
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock } from "@/components/seguros/ui/motion";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="seguros-section">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Depoimentos"
          title="O que nossos clientes dizem"
          description="Histórias reais de quem encontrou a proteção ideal e ainda passou a economizar todos os meses com os benefícios exclusivos do iGreen Club."
          className="mb-10 sm:mb-14"
        />

        <MotionBlock>
          <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-4xl">
            <CarouselContent className="-ml-4">
              {IGREEN_VIDEO_TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2">
                  <div className="seguros-testimonial-video">
                    <VimeoTestimonialPlayer
                      vimeoId={testimonial.vimeoId}
                      title={`Depoimento iGreen Seguros ${testimonial.id}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="seguros-testimonials-carousel__nav hidden sm:flex" />
            <CarouselNext className="seguros-testimonials-carousel__nav hidden sm:flex" />
          </Carousel>
        </MotionBlock>
      </div>
    </section>
  );
}
