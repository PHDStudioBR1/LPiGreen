"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackSegurosFaqExpand } from "@/lib/seguros/analytics";
import { SEGUROS_FAQ } from "@/lib/seguros/data";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

export function FaqSection() {
  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="FAQ"
            title="Perguntas frequentes"
            description="Tire suas dúvidas sobre coberturas, contratação e funcionamento do seguro."
          />
        </MotionBlock>

        <MotionBlock delay={0.1} className="mx-auto max-w-3xl">
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            onValueChange={(value) => {
              if (value) trackSegurosFaqExpand(value);
            }}
          >
            {SEGUROS_FAQ.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="overflow-hidden rounded-2xl border border-sa-border/60 bg-white px-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] data-[state=open]:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-sa-text hover:no-underline [&[data-state=open]]:text-sa-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-sa-muted">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </MotionBlock>
      </Container>
    </section>
  );
}
