"use client";

import { motion } from "framer-motion";
import { SEGUROS_ASSISTANCE } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionStagger, fadeUp } from "@/components/seguros/ui/motion";

export function AssistanceSection() {
  return (
    <section id="assistencia" className="py-20 md:py-28 bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Assistência 24h"
          title="Proteção quando você mais precisa"
          description="Serviços de emergência disponíveis 24 horas, 7 dias por semana."
          className="mb-14"
        />

        <MotionStagger className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {SEGUROS_ASSISTANCE.map((item) => (
            <motion.article
              key={item.id}
              variants={fadeUp}
              className="seguros-glass rounded-3xl p-8 flex gap-6 items-start hover:border-seguros-primary/30 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-seguros-primary/25 to-seguros-secondary flex items-center justify-center shrink-0">
                <item.icon className="w-8 h-8 text-seguros-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-seguros-headline text-xl font-bold text-seguros-text mb-2">
                  {item.title}
                </h3>
                <p className="text-seguros-muted leading-relaxed">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
