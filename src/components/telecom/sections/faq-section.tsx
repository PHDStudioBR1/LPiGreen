"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackTelecomFaqExpand } from "@/lib/telecom/analytics";
import { TELECOM_FAQ } from "@/lib/telecom/data";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { MotionBlock } from "@/components/telecom/ui/motion";

export function FaqSection() {
  return (
    <section id="faq" className="relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            eyebrow="FAQ"
            title="Perguntas frequentes"
            description="Tire suas dúvidas sobre planos, portabilidade e funcionamento da operadora."
          />
        </MotionBlock>

        <MotionBlock delay={0.1} className="mx-auto max-w-3xl">
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            onValueChange={(value) => {
              if (value) trackTelecomFaqExpand(value);
            }}
          >
            {TELECOM_FAQ.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] px-6 backdrop-blur-sm data-[state=open]:border-[#00e676]/25 data-[state=open]:bg-white/[0.06]"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-white hover:no-underline [&[data-state=open]]:text-[#00e676]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-white/55">
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
