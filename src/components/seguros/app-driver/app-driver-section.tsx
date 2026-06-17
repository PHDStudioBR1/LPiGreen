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
              eyebrow="Para Motoristas de App"
              title="Motorista de Uber, 99 ou iFood? Aqui você é bem-vindo."
              description="A iGreen oferece proteção também para motoristas de aplicativo. Diferente de muitos seguros tradicionais, o processo é simples e descomplicado: basta informar corretamente o uso profissional do veículo no momento da cotação para garantir sua cobertura."
              className="mb-8"
            />

            <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4">
              {SEGUROS_APP_DRIVER_FEATURES.map(({ icon: Icon, label, description }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 seguros-glass rounded-2xl p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-seguros-primary/15 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-seguros-primary" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="block font-semibold text-seguros-text text-sm">{label}</span>
                    <p className="text-xs text-seguros-muted leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6 space-y-3 sm:mb-8">
              <h3 className="font-seguros-headline text-lg font-bold text-seguros-text sm:text-xl">
                Cotação para motoristas de app
              </h3>
              <p className="text-sm text-seguros-muted leading-relaxed sm:text-base">
                <strong className="font-semibold text-seguros-text">Importante:</strong> Ao solicitar
                sua cotação, informe que utiliza o veículo para aplicativo. O uso profissional é
                considerado no cálculo da mensalidade e a informação correta é essencial para garantir
                a validade da sua cobertura em caso de sinistro.
              </p>
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

            <p className="mt-4 text-xs text-seguros-muted leading-relaxed">
              * O prazo de até 30 dias para indenização começa a contar após a entrega completa e
              aprovação dos documentos exigidos pela seguradora.
            </p>
          </MotionBlock>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeRight}
            transition={{ duration: 0.6 }}
            className="relative w-full"
          >
            <Image
              src="/images/seguros/Seguro-iGreen-apps.webp"
              alt="Seguro iGreen para motoristas de aplicativo"
              width={800}
              height={600}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full rounded-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
