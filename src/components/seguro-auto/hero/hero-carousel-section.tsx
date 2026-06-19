"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { SEGURO_AUTO_HERO_SLIDES } from "@/lib/seguro-auto/constants";

type HeroCarouselSectionProps = {
  onQuoteClick?: () => void;
};

export function HeroCarouselSection({ onQuoteClick }: HeroCarouselSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="inicio" className="bg-sa-bg pt-[64px] lg:pt-[96px]">
      <div className="container mx-auto px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10">
        <h1 className="mb-8 max-w-3xl font-sa-headline text-[1.75rem] font-bold leading-tight text-sa-text sm:text-4xl lg:mb-10">
          Confira nossas Soluções de Seguros
        </h1>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {SEGURO_AUTO_HERO_SLIDES.map((slide, index) => (
              <article
                key={slide.id}
                className={cn(
                  "sa-hero-slide min-w-0 flex-[0_0_88%] pr-4 sm:flex-[0_0_72%] md:flex-[0_0_58%] lg:flex-[0_0_48%] lg:pr-6",
                  index === selectedIndex && "is-snapped"
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[16/9] sm:rounded-3xl">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={index < 2}
                    sizes="(max-width: 768px) 88vw, (max-width: 1024px) 72vw, 48vw"
                    className="object-cover"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
                    aria-hidden
                  />

                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:gap-4 sm:p-8">
                    <h2 className="max-w-md font-sa-headline text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[1.75rem]">
                      {slide.title}
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                      {slide.description}
                    </p>
                    <button
                      type="button"
                      onClick={onQuoteClick}
                      className="sa-btn-card mt-1 inline-flex h-11 w-fit items-center justify-center rounded-lg px-6 text-sm sm:h-12 sm:px-7 sm:text-base"
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
          <div className="flex flex-1 items-center gap-2">
            {SEGURO_AUTO_HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir para slide ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "sa-indicator",
                  index === selectedIndex ? "is-active w-10" : "w-6"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Slide anterior"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sa-border text-sa-text transition-colors hover:border-sa-primary hover:text-sa-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Próximo slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sa-border text-sa-text transition-colors hover:border-sa-primary hover:text-sa-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
