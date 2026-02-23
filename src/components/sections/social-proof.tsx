"use client"

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Play, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TESTIMONIALS = [
  {
    name: "Ricardo Mendes",
    location: "São Paulo - SP",
    savings: "R$ 145,00/mês",
    text: "No começo achei que era bom demais pra ser verdade, mas a economia veio logo no primeiro mês. Zero burocracia!",
    avatar: PlaceHolderImages.find(img => img.id === 'testimonial-1')?.imageUrl
  },
  {
    name: "Ana Beatriz",
    location: "Belo Horizonte - MG",
    savings: "R$ 92,00/mês",
    text: "Além de economizar, fico feliz em saber que estou ajudando o planeta usando energia 100% limpa. Recomendo muito!",
    avatar: PlaceHolderImages.find(img => img.id === 'testimonial-2')?.imageUrl
  },
  {
    name: "Carlos Eduardo",
    location: "Goiânia - GO",
    savings: "R$ 310,00/mês",
    text: "Minha conta de luz da padaria caiu quase 20%. Pro meu negócio, essa economia faz uma diferença enorme no final do ano.",
    avatar: PlaceHolderImages.find(img => img.id === 'testimonial-3')?.imageUrl
  }
];

export function SocialProofSection() {
  const videoThumb = PlaceHolderImages.find(img => img.id === 'marcio-garcia');

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">Quem já usa, aprova!</h2>
          <p className="text-lg text-muted-foreground">Junte-se a milhares de brasileiros que já reduziram seus custos fixos.</p>
        </div>

        {/* Highlight Video Testimonial */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer">
            {videoThumb && (
              <Image 
                src={videoThumb.imageUrl} 
                alt={videoThumb.description} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                data-ai-hint={videoThumb.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl animate-pulse group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-2xl flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">MG</div>
               <div>
                  <p className="text-white font-bold leading-tight">Márcio Garcia</p>
                  <p className="text-white/80 text-xs">Ator e Entusiasta da Energia Limpa</p>
               </div>
            </div>
          </div>
        </div>

        {/* Text Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <Card key={idx} className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-foreground italic">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    {t.avatar && <Image src={t.avatar} alt={t.name} fill className="object-cover" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                    <p className="text-xs font-black text-primary mt-1">Economia: {t.savings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
