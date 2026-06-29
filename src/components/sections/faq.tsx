"use client"

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { trackHomeFaqExpand } from '@/lib/home/analytics';
import { getHomeFaqs, HOME_FAQS, type HomeFaqItem } from '@/lib/home/faq-data';

export function FAQSection() {
  const [faqs, setFaqs] = useState<HomeFaqItem[]>(HOME_FAQS);

  useEffect(() => {
    setFaqs(getHomeFaqs());
  }, []);
  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">Dúvidas Frequentes</h2>
            <p className="text-lg text-muted-foreground">Transparência total para você economizar sem medo.</p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
            onValueChange={(value) => {
              if (value) trackHomeFaqExpand(value);
            }}
          >
            {faqs.map((faq, idx) => (
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
