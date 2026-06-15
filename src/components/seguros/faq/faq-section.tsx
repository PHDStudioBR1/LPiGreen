"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEGUROS_FAQ } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock } from "@/components/seguros/ui/motion";
import { useMounted } from "@/hooks/use-mounted";

function FaqStaticFallback() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {SEGUROS_FAQ.map((item) => (
        <div
          key={item.id}
          className="seguros-glass rounded-2xl px-4 md:px-6 py-5 border border-transparent"
        >
          <p className="font-semibold text-seguros-text">{item.question}</p>
        </div>
      ))}
    </div>
  );
}

export function FaqSection() {
  const mounted = useMounted();

  return (
    <section id="faq" className="seguros-section">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="FAQ"
          title="Perguntas frequentes"
          description="Tire suas dúvidas sobre o Seguro iGreen."
          className="mb-10 sm:mb-14"
        />

        <MotionBlock className="max-w-3xl mx-auto">
          {!mounted ? (
            <FaqStaticFallback />
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {SEGUROS_FAQ.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="seguros-glass rounded-2xl px-4 md:px-6 border-none overflow-hidden data-[state=open]:border-seguros-primary/30"
                >
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold text-seguros-text transition-colors hover:no-underline hover:text-seguros-primary sm:py-5 sm:text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-seguros-muted pb-5 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </MotionBlock>
      </div>
    </section>
  );
}
