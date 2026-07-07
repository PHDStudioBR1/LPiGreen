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

export function VideoTestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-primary/5 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Depoimentos</p>
          <h2 className="font-headline text-3xl font-black text-foreground md:text-5xl">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-muted-foreground">
            Histórias reais de quem já economiza na conta de luz e aproveita os benefícios
            exclusivos do iGreen Club.
          </p>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-6xl px-2 sm:px-8">
          <CarouselContent className="-ml-4">
            {IGREEN_VIDEO_TESTIMONIALS.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 basis-full">
                <div className="overflow-hidden rounded-3xl border border-border bg-black shadow-xl">
                  <VimeoTestimonialPlayer
                    vimeoId={testimonial.vimeoId}
                    title={`Depoimento iGreen Energy ${testimonial.id}`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden border-border bg-background sm:flex" />
          <CarouselNext className="hidden border-border bg-background sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
