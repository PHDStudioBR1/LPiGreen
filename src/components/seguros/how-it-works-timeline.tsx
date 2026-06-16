"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SEGUROS_STEPS } from "@/lib/seguros/data";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { fadeLeft, fadeRight, fadeUp, MotionStagger } from "@/components/seguros/ui/motion";

type HowItWorksTimelineProps = {
  onQuoteClick: () => void;
};

export function HowItWorksTimeline({ onQuoteClick }: HowItWorksTimelineProps) {
  return (
    <section id="como-funciona" className="seguros-section bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
          <motion.div
            className="w-full space-y-5 sm:space-y-6 lg:w-[40%] lg:shrink-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeLeft}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center rounded-full border border-green-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-green-800 sm:px-4 sm:text-xs">
              Como funciona
            </span>

            <h2 className="font-seguros-headline text-2xl font-extrabold leading-[1.15] text-gray-900 sm:text-3xl md:text-4xl lg:text-[56px] lg:leading-[1.1]">
              Seu veículo protegido em{" "}
              <span className="text-[#16a34a]">até 24 horas</span>
            </h2>

            <p className="max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
              Do cadastro à apólice ativa em 5 passos simples. Tudo 100% digital, sem burocracia.
            </p>

            <button
              type="button"
              onClick={() => {
                trackSegurosQuoteClick("how_it_works");
                onQuoteClick();
              }}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00c853] to-[#16a34a] px-4 text-base font-extrabold text-white shadow-[0_8px_32px_rgba(22,163,74,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(22,163,74,0.45)] sm:h-16 sm:w-auto sm:px-8 sm:text-lg lg:h-[72px] lg:w-[360px]"
            >
              Descobrir quanto vou pagar
              <ArrowUpRight className="h-5 w-5 shrink-0" />
            </button>
          </motion.div>

          <motion.div
            className="w-full min-w-0 lg:w-[60%] lg:flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeRight}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div
                className="absolute bottom-6 left-[7px] top-6 w-0.5 bg-[#16a34a]/40"
                aria-hidden
              />

              <MotionStagger className="flex flex-col gap-4 sm:gap-5">
                {SEGUROS_STEPS.map((step) => (
                  <motion.div
                    key={step.id}
                    variants={fadeUp}
                    transition={{ duration: 0.5 }}
                    className="relative flex items-start gap-3 sm:items-center sm:gap-5"
                  >
                    <div className="relative z-10 mt-6 shrink-0 sm:mt-0" aria-hidden>
                      <div className="h-4 w-4 rounded-full bg-[#16a34a]" />
                    </div>

                    <article className="w-full min-w-0 flex-1 rounded-[20px] border border-green-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                      <div className="flex items-start gap-3 sm:gap-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00c853] to-[#16a34a] text-lg font-extrabold text-white sm:h-[52px] sm:w-[52px] sm:text-xl">
                          {step.id}
                        </div>
                        <div className="min-w-0 pt-0.5 sm:pt-1">
                          <h3 className="mb-1 font-seguros-headline text-base font-bold text-gray-900 sm:mb-1.5 sm:text-lg">
                            {step.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
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
