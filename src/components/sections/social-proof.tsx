"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeroVideo } from '@/components/sections/hero-video';

const TESTIMONIALS = [
  {
    name: "Maria Santos",
    location: "São Paulo",
    text: "Eu achei que era mentira. Mas resolvi tentar. Hoje eu economizo mais de R$ 180 por mês. Dinheiro que eu uso para outras coisas. E o melhor: não mudou nada na minha casa.",
  },
  {
    name: "Carlos Mendes",
    location: "Minas Gerais",
    text: "Minha conta era R$ 450. Hoje pago R$ 230. Faz 8 meses. Já economizei mais de R$ 1.700. Se eu soubesse antes, tinha feito há muito tempo.",
  },
  {
    name: "Juliana Oliveira",
    location: "Rio de Janeiro",
    text: "Além de economizar, eu ganhei R$ 5.000 em um dos sorteios. Foi surreal. Agradeço todos os dias por ter conhecido a iGreen.",
  }
];

export function SocialProofSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Mais de 500.000 clientes no Brasil — e selo Great Place to Work (GPTW 2025-2026)
          </h2>
          <p className="text-lg text-muted-foreground">
            Parceria Vibra e Comerc Energia. Veja depoimentos de quem já está economizando.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12 text-center">
          <p className="text-lg text-muted-foreground">
            Olha só o que o Ator Global <span className="font-bold">Marcio Garcia</span> disse sobre nosso trabalho:
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <div className="mb-12 overflow-hidden rounded-2.5xl border border-border shadow-lg">
            <HeroVideo videoId="1170064148" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <Card
              key={idx}
              className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-all bg-white dark:bg-neutral-800 overflow-hidden"
            >
              <CardContent className="p-8 space-y-6">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-foreground italic">"{t.text}"</p>
                <div className="pt-4 border-t border-border space-y-1">
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="h-14 px-10 rounded-2xl font-black whitespace-normal md:whitespace-nowrap text-center w-full max-w-full md:w-auto h-auto min-h-14 md:min-h-0 md:h-14 py-3 md:py-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Faça parte da maior transição energética do Brasil agora
          </Button>
        </div>
      </div>
    </section>
  );
}

