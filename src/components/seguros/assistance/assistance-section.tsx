"use client";

import { motion } from "framer-motion";
import { SEGUROS_ASSISTANCE } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionStagger, fadeUp } from "@/components/seguros/ui/motion";

export function AssistanceSection() {
  return (
    <section id="assistencia" className="seguros-section bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Assistência 24h"
          title="Proteção quando você mais precisa"
          description="Serviços de emergência disponíveis 24 horas, 7 dias por semana."
          className="mb-10 sm:mb-14"
        />

        <MotionStagger className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {SEGUROS_ASSISTANCE.map((item) => (
            <motion.article
              key={item.id}
              variants={fadeUp}
              className="seguros-glass flex flex-col items-start gap-4 rounded-3xl p-5 transition-colors hover:border-seguros-primary/30 sm:flex-row sm:gap-6 sm:p-6 md:p-8"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-seguros-primary/25 to-seguros-secondary sm:h-16 sm:w-16">
                <item.icon className="h-7 w-7 text-seguros-primary sm:h-8 sm:w-8" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-1 font-seguros-headline text-lg font-bold text-seguros-text sm:mb-2 sm:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-seguros-muted sm:text-base">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
