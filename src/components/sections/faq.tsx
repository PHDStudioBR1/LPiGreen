"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const FAQS = [
  {
    q: "Como faço para me tornar licenciado iGreen?",
    a: "Preencha o formulário de interesse ou fale com o time de expansão. Você passará por cadastro, validação de região e onboarding com treinamentos e acesso ao app e materiais oficiais.",
  },
  {
    q: "Preciso de escritório ou equipe para começar?",
    a: "Não necessariamente. Muitos licenciados começam prospectando de forma independente, com foco em mobile. Conforme sua rede cresce, você pode estruturar equipe e metas maiores.",
  },
  {
    q: "Quais são as fontes de ganho disponíveis?",
    a: "O ecossistema inclui Green (economia de energia), Telecom (planos recorrentes), projetos Livre/Solar de maior ticket e bônus de Expansão com novos licenciados. O plano de negócios detalha percentuais e regras vigentes.",
  },
  {
    q: "O modelo é regulamentado?",
    a: "Sim. A oferta de energia limpa na rede segue a Lei 14.300/2022 e a regulação da ANEEL. Isso reforça a seriedade da proposta para você e para o cliente final.",
  },
  {
    q: "Como funcionam viagens e premiações?",
    a: "A iGreen reconhece o desempenho com experiências como cruzeiro, snow e viagens internacionais, conforme metas do plano de carreira (Sênior a Acionista). Detalhes são comunicados nos canais oficiais e eventos.",
  },
  {
    q: "Posso conciliar com outro trabalho?",
    a: "Sim. A flexibilidade é um dos atrativos: você define ritmo e canais, priorizando o que funciona melhor na sua região e perfil.",
  },
] as const;

export function FAQSection() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-foreground">
              Dúvidas frequentes — Licenciados
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Transparência para você decidir com segurança.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-border rounded-2xl px-4 md:px-6 bg-card shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="text-left font-bold py-5 hover:no-underline hover:text-primary transition-colors text-sm md:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-sm md:text-base">
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
