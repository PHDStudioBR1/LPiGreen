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
            Pronto para licenciar e liderar a expansão?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Preencha o cadastro e fale com o time: vagas e condições podem variar por região. Garanta seu lugar na maior onda de crescimento da iGreen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center pt-2">
            <Button
              size="lg"
              onClick={onCTAClick}
              className={`h-16 px-10 text-xl font-black rounded-2xl shadow-xl whitespace-normal md:whitespace-nowrap text-center w-full max-w-full sm:w-auto h-auto min-h-16 md:min-h-0 md:h-16 py-3 md:py-0 text-primary-foreground ${ctaGlowClasses}`}
            >
              Quero ser um Licenciado
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
