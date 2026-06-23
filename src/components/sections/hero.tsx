"use client"

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle } from 'lucide-react';
import { HeroVideo } from '@/components/sections/hero-video';

export function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12 sm:py-20 px-4 sm:px-6 w-full">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <>
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover dark:hidden"
              priority
              data-ai-hint={heroImage.imageHint}
            />
            <Image
              src="/hero-dark.png"
              alt="Quarto com janelas à noite"
              fill
              className="object-cover hidden dark:block"
              priority
            />
          </>
        )}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 items-center w-full max-w-full">
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left duration-1000 min-w-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-primary-foreground font-semibold text-sm dark:text-white">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="truncate">Representante iGreen Energy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-headline font-black text-white leading-tight break-words">
            Economia na conta de luz <span className="text-primary italic">sem investimento, sem burocracia e sem fidelidade</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 max-w-xl leading-relaxed min-w-0">
            A sua distribuidora (Cemig, CPFL, etc) continua a entregar a energia, mas a iGreen injeta energia limpa na
            rede e repassa-lhe o desconto.{' '}
            <strong className="text-white">Até 15% mais barato todos os meses, garantido por lei.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              size="lg"
              onClick={onCTAClick}
              className="h-14 sm:h-16 px-6 sm:px-8 text-base sm:text-xl font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto text-center dark:text-white"
            >
              <span className="sm:hidden">Quero economizar na conta de luz</span>
              <span className="hidden sm:inline">Faça parte da maior transição energética do Brasil agora</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5" />
              <span>Zero Obras</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5" />
              <span>Zero Taxa de Adesão</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary w-5 h-5" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:gap-4 animate-in fade-in slide-in-from-right duration-1000 w-full">
          {/* Vídeo acima do card "Simulação Real" — com controles Play/Pause, Volume e Timeline */}
          <HeroVideo />
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
                  *Conexão Green: economia na conta sem investimento. Valores estimados com base na média de consumo residencial.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
