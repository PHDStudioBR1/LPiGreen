"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ctaGlowClasses } from "@/lib/cro-cta";

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    alt: "Equipe colaborando em escritório moderno",
  },
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
    alt: "Profissionais em evento e convenção",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    alt: "Time celebrando resultados em reunião",
  },
  {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    alt: "Pessoa usando smartphone no trabalho",
  },
] as const;

export function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden py-14 sm:py-20 px-4 sm:px-6 w-full bg-zinc-950">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_70%_20%,hsl(var(--primary)/0.12),transparent)]" />

      <div className="container relative z-10 mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center w-full max-w-full">
        <ScrollReveal className="space-y-6 sm:space-y-8 min-w-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 backdrop-blur-sm border border-primary/35 rounded-full text-primary font-semibold text-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="truncate text-white">Oportunidade Licenciado iGreen 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-6xl font-headline font-black text-white leading-[1.12] break-words">
            Lidere a transição energética global e construa sua{" "}
            <span className="text-primary">recorrência vitalícia</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-xl leading-relaxed">
            A maior plataforma de energia sustentável do Brasil, agora em{" "}
            <span className="text-white font-bold">Expansão Internacional (2026)</span>. Monte sua rede,
            ofereça Green, Telecom e Solar — com modelo regulado e marca de peso.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <Button
              size="lg"
              onClick={onCTAClick}
              className={`h-14 sm:h-16 px-6 sm:px-8 text-base sm:text-lg font-black rounded-2xl w-full sm:w-auto text-center text-primary-foreground ${ctaGlowClasses}`}
            >
              <span className="sm:hidden">Quero ser um Licenciado</span>
              <span className="hidden sm:inline">Conhecer o Plano de Negócios</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onCTAClick}
              className="h-14 sm:h-16 px-6 sm:px-8 text-base sm:text-lg font-bold rounded-2xl w-full sm:w-auto border-white/25 text-white bg-white/5 hover:bg-white/10 hover:text-white"
            >
              Quero ser um Licenciado
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-zinc-400 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5 shrink-0" />
              <span>Regulamentação ANEEL</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5 shrink-0" />
              <span>Múltiplas fontes de renda</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5 shrink-0" />
              <span>Suporte e treinamento</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100} className="relative w-full min-w-0">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {GALLERY.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Rede real: trabalho em equipe, convenções e app iGreen Connect
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
