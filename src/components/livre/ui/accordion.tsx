"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { MotionStagger, MotionItem } from "./motion";

export type LivreAccordionItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

type LivreAccordionProps = {
  items: LivreAccordionItem[];
  className?: string;
  defaultValue?: string;
};

export function LivreAccordion({ items, className, defaultValue }: LivreAccordionProps) {
  return (
    <MotionStagger className={cn("mx-auto max-w-3xl", className)}>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultValue}
        className="w-full"
      >
        {items.map((item) => (
          <MotionItem key={item.id}>
            <AccordionItem
              value={item.id}
              className="border-b border-livre-petrol-500/60"
            >
              <AccordionTrigger
                className={cn(
                  "py-5 text-left font-lv-headline text-base font-semibold text-livre-text",
                  "hover:text-livre-primary hover:no-underline",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-livre-primary",
                  "[&[data-state=open]]:text-livre-primary",
                  "[&>svg]:text-livre-primary"
                )}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-livre-muted sm:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          </MotionItem>
        ))}
      </Accordion>
    </MotionStagger>
  );
}

export {
  Accordion as LivreAccordionRoot,
  AccordionItem as LivreAccordionItemPrimitive,
  AccordionTrigger as LivreAccordionTrigger,
  AccordionContent as LivreAccordionContent,
};
