"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function LegalSection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-zinc-950 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-headline font-black text-foreground">
            Regulamentação que sustenta o negócio
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A oferta de energia limpa na rede segue a{" "}
            <span className="font-bold text-foreground">Lei nº 14.300/2022</span> e as normas da{" "}
            <span className="font-bold text-foreground">ANEEL</span>. Como licenciado, você apresenta um produto
            regulado — diferencial de confiança na conversa com clientes e parceiros.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
