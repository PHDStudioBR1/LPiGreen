"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ctaGlowClasses } from "@/lib/cro-cta";

const GALLERY = [
  {
    src: "/images/hero/solar-1.png",
    alt: "Fazenda solar em operação com placas fotovoltaicas",
  },
  {
    src: "/images/hero/solar-2.png",
    alt: "Painéis solares para geração de energia limpa",
  },
  {
    src: "/images/hero/solar-3.png",
    alt: "Usina fotovoltaica com foco em sustentabilidade",
  },
  {
    src: "/images/hero/solar-4.png",
    alt: "Energia solar renovável em escala comercial",
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
            <span className="truncate text-white">[ NOVO MARCO 2026: OPERAÇÃO GLOBAL INICIADA ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.4rem] xl:text-7xl font-headline font-black text-white leading-[1.12] break-words">
            Lidere a Transição Energética. Construa sua Renda Recorrente Vitalícia com a{" "}
            <span className="text-primary">iGreen Energy.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-xl leading-relaxed">
            Torne-se o <strong className="text-white">iFood da Energia</strong>. Conecte clientes a fazendas solares
            usando apenas o seu telemóvel e receba{" "}
            <strong className="text-white">comissões todos os meses</strong>.{" "}
            <strong className="text-white">Zero stock. Zero obras.</strong>{" "}
            <strong className="text-white">Sem que o seu cliente invista 1 cêntimo.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <Button
              size="lg"
              onClick={onCTAClick}
              className={`h-14 sm:h-16 px-6 sm:px-8 text-lg sm:text-xl font-black rounded-2xl w-full sm:w-auto text-center text-primary-foreground ${ctaGlowClasses}`}
            >
              <span className="sm:hidden">Quero Ser um Licenciado iGreen</span>
              <span className="hidden sm:inline">Quero Ser um Licenciado iGreen</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onCTAClick}
              className="h-14 sm:h-16 px-6 sm:px-8 text-lg sm:text-xl font-bold rounded-2xl w-full sm:w-auto border-white/25 text-white bg-white/5 hover:bg-white/10 hover:text-white"
            >
              Quero ser um Licenciado
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-zinc-400 text-base sm:text-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5 shrink-0" />
              <span>Sem investimento em infraestrutura ou placas.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5 shrink-0" />
              <span>Negócio 100% Digital via App (iGreen Connect).</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5 shrink-0" />
              <span>Ganhos Imediatos e Recorrência Mensal.</span>
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
          <p className="mt-4 text-center text-sm text-zinc-500">
            Operação real: expansão comercial, tecnologia e recorrência via iGreen Connect
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
