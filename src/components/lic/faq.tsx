"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { trackLicFaqExpand } from "@/lib/lic/analytics";

const FAQS = [
  {
    q: "Preciso ter experiência no setor elétrico?",
    a: "Não. A iGreen Academy oferece treinamentos online completos e encontros práticos semanais ao vivo. Você aprende faturando.",
  },
  {
    q: "O cliente paga algo para aderir?",
    a: "Zero. Na Conexão Green e Livre, o cliente não paga taxa de adesão, não faz obras e não precisa comprar placas. A venda é sem atrito.",
  },
  {
    q: "É seguro e legalizado?",
    a: "100% amparado pela Lei Federal nº 14.300/2022 (Marco Legal da Geração Distribuída) e Lei 9.074/95 (Mercado Livre).",
  },
  {
    q: "E se eu quiser recuperar meu investimento rápido?",
    a: "Temos a 'Missão 7 Dias': indique 2 novos licenciados na sua primeira semana e recupere 100% do valor da sua licença em bônus garantidos.",
  },
] as const;

export function FAQSection() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-black text-foreground">
              Tudo o que você precisa para começar hoje.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Quebra de objeções para você entrar com clareza e segurança.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full space-y-3"
            onValueChange={(value) => { if (value) trackLicFaqExpand(value); }}
          >
            {FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-border rounded-2xl px-4 md:px-6 bg-card shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="text-left font-bold py-5 hover:no-underline hover:text-primary transition-colors text-base md:text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-base md:text-lg">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
