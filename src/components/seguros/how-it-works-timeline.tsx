"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SEGUROS_STEPS } from "@/lib/seguros/data";
import { fadeLeft, fadeRight, fadeUp, MotionStagger } from "@/components/seguros/ui/motion";

type HowItWorksTimelineProps = {
  onQuoteClick: () => void;
};

export function HowItWorksTimeline({ onQuoteClick }: HowItWorksTimelineProps) {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">
          {/* Coluna esquerda — 40% */}
          <motion.div
            className="w-full lg:w-[40%] lg:shrink-0 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeLeft}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-green-300 text-green-800 text-xs font-bold tracking-widest uppercase">
              Como funciona
            </span>

            <h2 className="font-seguros-headline text-[40px] lg:text-[56px] font-extrabold leading-[1.1] text-gray-900">
              Seu veículo protegido em{" "}
              <span className="text-[#16a34a]">até 24 horas</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              Do cadastro à apólice ativa em 5 passos simples. Tudo 100% digital, sem burocracia.
            </p>

            <button
              type="button"
              onClick={onQuoteClick}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-[360px] h-[72px] rounded-2xl bg-gradient-to-r from-[#00c853] to-[#16a34a] text-white font-extrabold text-lg shadow-[0_8px_32px_rgba(22,163,74,0.35)] hover:shadow-[0_12px_40px_rgba(22,163,74,0.45)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Descobrir quanto vou pagar
              <ArrowUpRight className="w-5 h-5 shrink-0" />
            </button>
          </motion.div>

          {/* Coluna direita — 60% */}
          <motion.div
            className="w-full lg:w-[60%] lg:flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeRight}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Linha vertical centralizada na coluna dos pontos */}
              <div
                className="absolute left-[7px] top-6 bottom-6 w-0.5 bg-[#16a34a]/40"
                aria-hidden
              />

              <MotionStagger className="flex flex-col gap-5">
                {SEGUROS_STEPS.map((step) => (
                  <motion.div
                    key={step.id}
                    variants={fadeUp}
                    transition={{ duration: 0.5 }}
                    className="relative flex items-center gap-5"
                  >
                    {/* Ponto na timeline */}
                    <div className="relative z-10 shrink-0" aria-hidden>
                      <div className="w-4 h-4 rounded-full bg-[#16a34a]" />
                    </div>

                    {/* Card */}
                    <article className="flex-1 w-full bg-white rounded-[20px] border border-green-100 shadow-sm p-8">
                      <div className="flex items-start gap-5">
                        <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-gradient-to-br from-[#00c853] to-[#16a34a] flex items-center justify-center text-white font-extrabold text-xl">
                          {step.id}
                        </div>
                        <div className="min-w-0 pt-1">
                          <h3 className="font-seguros-headline font-bold text-gray-900 text-lg mb-1.5">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  </motion.div>
                ))}
              </MotionStagger>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
