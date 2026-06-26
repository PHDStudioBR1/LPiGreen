"use client";

import { motion } from "framer-motion";
import { SEGUROS_PLANS } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionStagger, fadeUp } from "@/components/seguros/ui/motion";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";

const PLANS_DISCLAIMERS = [
  {
    title: "Variabilidade de preço",
    text: "O valor final da mensalidade depende da análise do perfil de risco, incluindo fatores como CEP de pernoite, utilização de garagem e uso profissional do veículo.",
  },
  {
    title: "Indenização",
    text: "A indenização será calculada com base na Tabela FIPE vigente na data do sinistro.",
  },
  {
    title: "Regulamentação",
    text: "A iGreen é representante da BP Seguradora, conforme processo SUSEP nº 15414.659052/2024-88.",
  },
] as const;

type PlansSectionProps = {
  onQuoteClick: () => void;
};

export function PlansSection({ onQuoteClick }: PlansSectionProps) {
  return (
    <section id="planos" className="seguros-section bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Planos"
          title="Escolha o plano ideal"
          description="Três opções para cada perfil e orçamento. Sem surpresas."
          className="mb-10 sm:mb-14"
        />

        <MotionStagger className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {SEGUROS_PLANS.map((plan) => (
            <motion.article
              key={plan.id}
              variants={fadeUp}
              className={`relative flex flex-col rounded-3xl p-5 seguros-glass transition-all duration-300 sm:p-6 md:p-8 ${
                plan.highlighted
                  ? "md:scale-[1.07] md:-my-6 seguros-plan-featured z-10"
                  : "hover:border-seguros-primary/25"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-seguros-primary text-seguros-bg text-xs font-extrabold tracking-wider shadow-[0_0_24px_rgba(0,200,83,0.7),0_0_48px_rgba(0,200,83,0.35)] ring-2 ring-seguros-accent/40">
                  {plan.badge}
                </span>
              )}

              <h3 className="font-seguros-headline text-xl font-extrabold text-seguros-text sm:text-2xl">
                {plan.name}
              </h3>
              <p className="text-seguros-muted text-sm mt-2 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-start gap-2 text-sm text-seguros-muted"
                  >
                    <feature.icon className="w-4 h-4 text-seguros-primary shrink-0 mt-0.5" />
                    <span>
                      <span className="font-semibold text-seguros-text">{feature.label}</span>
                      {feature.label.endsWith("+") ? " " : ": "}
                      {feature.description}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  trackSegurosQuoteClick(`plans_${plan.id}`);
                  onQuoteClick();
                }}
                className={`w-full h-11 sm:h-12 rounded-xl font-bold transition-all ${
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

        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto space-y-4 border-t border-seguros-primary/10 pt-8 sm:pt-10">
          {PLANS_DISCLAIMERS.map((item) => (
            <div key={item.title}>
              <p className="text-[11px] font-semibold text-seguros-muted sm:text-xs mb-1">
                {item.title}
              </p>
              <p className="text-[11px] leading-relaxed text-seguros-muted/75 sm:text-xs">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
