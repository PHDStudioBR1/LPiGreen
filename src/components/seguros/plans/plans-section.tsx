"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { SEGUROS_PLANS } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionStagger, fadeUp } from "@/components/seguros/ui/motion";

type PlansSectionProps = {
  onQuoteClick: () => void;
};

export function PlansSection({ onQuoteClick }: PlansSectionProps) {
  return (
    <section id="planos" className="py-20 md:py-28 bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Planos"
          title="Escolha o plano ideal"
          description="Três opções para cada perfil e orçamento. Sem surpresas."
          className="mb-14"
        />

        <MotionStagger className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {SEGUROS_PLANS.map((plan) => (
            <motion.article
              key={plan.id}
              variants={fadeUp}
              className={`relative flex flex-col rounded-3xl p-8 seguros-glass transition-all duration-300 ${
                plan.highlighted
                  ? "md:scale-105 md:-my-4 seguros-glow border-seguros-primary/40 z-10"
                  : "hover:border-seguros-primary/25"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-seguros-primary text-seguros-bg text-xs font-extrabold tracking-wider">
                  {plan.badge}
                </span>
              )}

              <h3 className="font-seguros-headline text-2xl font-extrabold text-seguros-text">
                {plan.name}
              </h3>
              <p className="text-seguros-muted text-sm mt-2 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="font-seguros-headline text-4xl font-extrabold text-seguros-primary">
                  {plan.price}
                </span>
                <span className="text-seguros-muted">{plan.priceNote}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-seguros-muted">
                    <Check className="w-4 h-4 text-seguros-primary shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={onQuoteClick}
                className={`w-full h-12 rounded-xl font-bold transition-all ${
                  plan.highlighted
                    ? "seguros-btn-primary"
                    : "seguros-btn-outline"
                }`}
              >
                Contratar {plan.name}
              </button>
            </motion.article>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
