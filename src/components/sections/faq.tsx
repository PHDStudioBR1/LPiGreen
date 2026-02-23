"use client"

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    q: "Isso é golpe ou pirâmide?",
    a: "Absolutamente não. A geração distribuída é um modelo de negócio regulamentado pela ANEEL (Agência Nacional de Energia Elétrica) e agora pela Lei Federal 14.300/2022. Somos uma empresa real com usinas próprias."
  },
  {
    q: "Minha luz vai cair se eu assinar?",
    a: "Não. A infraestrutura de entrega (postes, fios e transformadores) continua sendo da sua distribuidora local. O sinal é o mesmo, a iGreen apenas injeta os créditos na rede para abater o seu valor."
  },
  {
    q: "Tem alguma taxa de adesão ou fidelidade?",
    a: "Não cobramos taxa de adesão nem multa por cancelamento. Você pode sair quando quiser, basta nos avisar com a antecedência prevista no contrato (geralmente 60 dias para trâmites burocráticos junto à distribuidora)."
  },
  {
    q: "Preciso fazer alguma obra ou instalar painéis?",
    a: "Nenhuma! Essa é a grande vantagem. Nós fazemos todo o investimento em grandes usinas e você apenas 'assina' uma parte dessa produção."
  },
  {
    q: "Como vou saber que o desconto foi aplicado?",
    a: "Você continuará recebendo a conta da sua distribuidora, mas nela aparecerá um campo de 'Energia Injetada' ou 'Créditos de Energia', reduzindo o valor total a ser pago."
  }
];

export function FAQSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">Dúvidas Frequentes</h2>
            <p className="text-lg text-muted-foreground">Transparência total para você economizar sem medo.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-none bg-background rounded-2xl px-6 shadow-sm overflow-hidden">
                <AccordionTrigger className="text-left font-bold py-6 hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
