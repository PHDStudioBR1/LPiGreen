"use client";

import Image from "next/image";
import { SEGUROS_APP_DRIVER_FEATURES } from "@/lib/seguros/data";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock, fadeLeft, fadeRight } from "@/components/seguros/ui/motion";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { motion } from "framer-motion";

type AppDriverSectionProps = {
  onQuoteClick: () => void;
};

export function AppDriverSection({ onQuoteClick }: AppDriverSectionProps) {
  return (
    <section
      id="motorista-app"
      className="seguros-section relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0D3D2A 0%, #061B12 50%, #020B07 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,83,0.12),transparent)]" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <MotionBlock variants={fadeLeft}>
            <SectionHeader
              align="left"
              eyebrow="Motorista de App"
              title="Motorista Uber, 99 ou iFood? Aqui você é aceito."
              description="Proteção completa para quem vive na estrada. Sem análise de perfil, sem consulta SPC e com boleto mensal."
              className="mb-8"
            />

            <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4">
              {SEGUROS_APP_DRIVER_FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 seguros-glass rounded-2xl p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-seguros-primary/15 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-seguros-primary" />
                  </div>
                  <span className="font-semibold text-seguros-text text-sm">{label}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                trackSegurosQuoteClick("app_driver");
                onQuoteClick();
              }}
              className="seguros-btn-primary h-12 w-full rounded-2xl px-6 text-base font-extrabold sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
            >
              Cotar para Motorista de App
            </button>
          </MotionBlock>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeRight}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl seguros-glow"
          >
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
              alt="Motorista de aplicativo com veículo"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-seguros-bg/80 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
