"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ctaGlowClasses } from "@/lib/cro-cta";

interface EligibilitySectionProps {
  onCTAClick: () => void;
}

export function EligibilitySection({ onCTAClick }: EligibilitySectionProps) {
  return (
    <section className="py-20 md:py-28 bg-primary/5 dark:bg-zinc-900/50 border-y border-primary/15">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground leading-tight">
            Acesso imediato à Plataforma iGreen Connect
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Uma franquia tradicional no setor solar custaria dezenas de milhares de reais. Torne-se um
            Licenciado iGreen, tenha seu negócio próprio e acesso a todo o ecossistema por um valor
            incomparável. <span className="font-bold text-foreground">12x de R$ 197,41</span> (ou R$ 1.997,00 à
            vista. Licença válida por 1 ano).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center pt-2">
            <Button
              size="lg"
              onClick={onCTAClick}
              className={`h-16 px-10 text-xl font-black rounded-2xl shadow-xl whitespace-normal md:whitespace-nowrap text-center w-full max-w-full sm:w-auto h-auto min-h-16 md:min-h-0 md:h-16 py-3 md:py-0 text-primary-foreground ${ctaGlowClasses}`}
            >
              Garantir Minha Licença
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onCTAClick}
              className="h-16 px-10 text-lg font-bold rounded-2xl w-full max-w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
            >
              Conhecer o Plano de Negócios
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
