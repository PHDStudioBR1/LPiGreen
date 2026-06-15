"use client";

import { motion } from "framer-motion";
import { SEGUROS_BENEFITS } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionStagger, fadeUp } from "@/components/seguros/ui/motion";

export function BenefitsSection() {
  return (
    <section id="beneficios" className="seguros-section">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Vantagens"
          title="Benefícios que fazem a diferença"
          description="Tudo o que você precisa para proteger seu veículo sem burocracia."
          className="mb-10 sm:mb-14"
        />

        <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {SEGUROS_BENEFITS.map((benefit) => (
            <motion.article
              key={benefit.id}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="group seguros-glass rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-seguros-primary/40 sm:p-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-seguros-primary/15 flex items-center justify-center mb-4 group-hover:bg-seguros-primary/25 transition-colors">
                <benefit.icon className="w-6 h-6 text-seguros-primary" />
              </div>
              <h3 className="font-seguros-headline text-lg font-bold text-seguros-text mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-seguros-muted leading-relaxed">{benefit.description}</p>
            </motion.article>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
