"use client"

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle } from 'lucide-react';

export function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-primary-foreground font-semibold text-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Representante iGreen Energy
          </div>

          <h1 className="text-4xl md:text-6xl font-headline font-black text-white leading-tight">
            Desconto de até <span className="text-primary italic">50%</span> na sua conta de energia elétrica!
          </h1>

          <div className="space-y-4 text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
            <p>
              Sem obras, sem investimento, sem complicação e sem pagar nada por isso — tudo por conta da{' '}
              <span className="text-white font-bold underline decoration-primary">Lei nº 14.300/2022</span>.
            </p>
            <p>
              Você continua recebendo a mesma energia, da mesma distribuidora, mas paga menos. Muito menos. E isso é{' '}
              <span className="font-bold">100% legal e regulamentado</span>.
            </p>
            <p className="text-base md:text-lg text-gray-100">
              Logo abaixo você fará o teste para saber se está apto para o desconto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={onCTAClick}
              className="h-16 px-8 text-xl font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
            >
              Verificar se Estou Apto
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5" />
              <span>Zero Investimento</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5" />
              <span>Sem Fidelidade</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5" />
              <span>Cancelamento Grátis</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block animate-in fade-in slide-in-from-right duration-1000">
          <div className="glass p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
             <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-bold text-primary tracking-widest uppercase">Simulação Real</span>
                   <div className="bg-primary/10 text-primary p-2 rounded-lg font-bold">-15% OFF</div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between border-b pb-2 border-primary/10">
                      <span className="text-muted-foreground">Conta Distribuidora</span>
                      <span className="font-bold line-through text-red-500/70">R$ 500,00</span>
                   </div>
                   <div className="flex justify-between border-b pb-2 border-primary/10">
                      <span className="text-muted-foreground">Com iGreen Energy</span>
                      <span className="font-black text-2xl text-primary">R$ 425,00</span>
                   </div>
                </div>
                <p className="text-xs text-muted-foreground italic text-center">
                  *Valores estimados com base na média de consumo residencial.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
