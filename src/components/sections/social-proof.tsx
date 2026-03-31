"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ctaGlowClasses } from "@/lib/cro-cta";

const TESTIMONIALS = [
  {
    name: "Renata Alves",
    location: "São Paulo — Licenciada",
    text: "Saí do zero e hoje tenho equipe em três estados. O app e o suporte fazem toda a diferença para prospectar pelo celular.",
  },
  {
    name: "Diego Mota",
    location: "Minas Gerais — Gestor",
    text: "Green + Telecom me deram previsibilidade. Ver a economia do cliente virar comissão recorrente mudou minha vida financeira.",
  },
  {
    name: "Camila Rocha",
    location: "Rio de Janeiro — Executiva",
    text: "A convenção anual vale cada esforço: networking, reconhecimento e visão de onde a empresa vai nos próximos anos.",
  },
] as const;

const STATS = [
  { value: "+450 mil", label: "Clientes atendidos no ecossistema (2026)" },
  { value: "Brasil inteiro", label: "Presença em todo o território nacional" },
  { value: "Global", label: "Início da operação internacional em 2026" },
] as const;

export function SocialProofSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-950 overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12 md:mb-16 space-y-4 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground leading-tight">
            Social proof 2026 — números que sustentam sua decisão
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Mais de 450 mil clientes, cobertura nacional e expansão global. Você entrega soluções reais com a força da marca iGreen.
          </p>
        </ScrollReveal>

        <ScrollReveal className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-14 md:mb-20 max-w-5xl mx-auto">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-border bg-primary/5 dark:bg-primary/10 p-6 text-center"
            >
              <p className="text-2xl md:text-3xl font-black text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-snug">{s.label}</p>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="grid grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto mb-14 rounded-2xl overflow-hidden">
          <div className="relative aspect-[3/4] col-span-1">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80"
              alt="Público em convenção corporativa"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative aspect-[3/4] col-span-1">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
              alt="Equipe comemorando em evento"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative aspect-[3/4] col-span-1">
            <Image
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80"
              alt="Uso de aplicativo no smartphone"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <ScrollReveal key={idx} delayMs={idx * 90}>
              <Card className="rounded-3xl border border-border shadow-lg hover:shadow-xl transition-all bg-card h-full overflow-hidden">
                <CardContent className="p-6 md:p-8 space-y-5">
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-foreground italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="pt-4 border-t border-border space-y-1">
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <Button
            size="lg"
            className={`h-14 px-10 rounded-2xl font-black whitespace-normal md:whitespace-nowrap text-center w-full max-w-full md:w-auto h-auto min-h-14 md:min-h-0 md:h-14 py-3 md:py-0 text-primary-foreground ${ctaGlowClasses}`}
            onClick={onCTAClick}
          >
            Conhecer o Plano de Negócios
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
