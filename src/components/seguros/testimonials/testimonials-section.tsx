"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SEGUROS_TESTIMONIALS } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock } from "@/components/seguros/ui/motion";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="depoimentos" className="seguros-section">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Depoimentos"
          title="O que nossos clientes dizem"
          description="Histórias reais de quem encontrou proteção quando mais precisava."
          className="mb-10 sm:mb-14"
        />

        <MotionBlock>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {SEGUROS_TESTIMONIALS.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 flex-[0_0_100%] seguros-glass rounded-3xl p-5 sm:flex-[0_0_calc(50%-12px)] sm:p-6 md:p-8 lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-seguros-primary/30">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-seguros-text">{item.name}</p>
                      <p className="text-sm text-seguros-muted">{item.city}</p>
                    </div>
                  </div>

                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-seguros-primary text-seguros-primary" />
                    ))}
                  </div>

                  <p className="text-seguros-muted leading-relaxed">&ldquo;{item.comment}&rdquo;</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {SEGUROS_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Depoimento ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === selectedIndex ? "w-8 bg-seguros-primary" : "w-2 bg-seguros-muted/40"
                }`}
              />
            ))}
          </div>
        </MotionBlock>
      </div>
    </section>
  );
}
