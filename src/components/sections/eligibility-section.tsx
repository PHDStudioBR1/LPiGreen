"use client"

import React from 'react';
import { Button } from '@/components/ui/button';

interface EligibilitySectionProps {
  onCTAClick: () => void;
}

export function EligibilitySection({ onCTAClick }: EligibilitySectionProps) {
  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Descubra se você está apto para economizar na conta de luz
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nem todas as regiões têm vagas disponíveis no momento. Preencha o formulário e descubra em até 24h se você pode economizar com energia limpa — sem investimento, sem burocracia e sem fidelidade.
          </p>
          <Button
            size="lg"
            onClick={onCTAClick}
            className="h-16 px-10 text-xl font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-transform whitespace-normal md:whitespace-nowrap text-center w-full max-w-full md:w-auto h-auto min-h-16 md:min-h-0 md:h-16 py-3 md:py-0"
          >
            Faça parte da maior transição energética do Brasil — Verificar Agora
          </Button>
        </div>
      </div>
    </section>
  );
}

