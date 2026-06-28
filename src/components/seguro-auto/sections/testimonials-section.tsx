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
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-sa-surface/60 py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="Depoimentos"
            title="Na voz de quem confia na iGreen"
            description="Histórias reais de quem encontrou a proteção ideal e ainda passou a economizar todos os meses com os benefícios exclusivos do iGreen Club."
          />
        </MotionBlock>

        <MotionBlock delay={0.1}>
          <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-4xl">
            <CarouselContent className="-ml-4">
              {IGREEN_VIDEO_TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2">
                  <div className="sa-testimonial-video">
                    <VimeoTestimonialPlayer
                      vimeoId={testimonial.vimeoId}
                      title={`Depoimento iGreen Seguro Auto ${testimonial.id}`}
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
