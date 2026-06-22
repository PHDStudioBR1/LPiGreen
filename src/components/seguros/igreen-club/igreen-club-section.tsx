"use client";

import Image from "next/image";
import { Leaf, Percent, Store } from "lucide-react";
import { SectionHeader } from "@/components/seguros/ui/section-header";
import { MotionBlock, fadeLeft, fadeRight } from "@/components/seguros/ui/motion";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { motion } from "framer-motion";

const CLUB_FEATURES = [
  {
    icon: Store,
    title: "Mais de 60 mil estabelecimentos",
    description:
      "Farmácias, cinemas, pizzarias, restaurantes, lojas físicas/online e muito mais.",
  },
  {
    icon: Percent,
    title: "Economia real de até 70%",
    description: "Descontos em parceiros exclusivos em todo o Brasil.",
  },
  {
    icon: Leaf,
    title: "Cashback Sustentável",
    description:
      "Indique amigos e acumule créditos para zerar sua própria conta de energia e telefone celular. (Em breve desconto na mensalidade do seguro usando o cashback).",
  },
] as const;

type IgreenClubSectionProps = {
  onQuoteClick: () => void;
};

export function IgreenClubSection({ onQuoteClick }: IgreenClubSectionProps) {
  return (
    <section id="igreen-club" className="seguros-section bg-seguros-dark/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeLeft}
            transition={{ duration: 0.6 }}
            className="relative order-2 w-full lg:order-1"
          >
            <Image
              src="/images/seguros/igreen club.webp"
              alt="iGreen Club — Clube de Benefícios"
              width={800}
              height={600}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-auto w-full rounded-3xl"
            />
          </motion.div>

          <MotionBlock variants={fadeRight} className="order-1 lg:order-2">
            <SectionHeader
              align="left"
              eyebrow="iGreen Club"
              title="O melhor e maior Clube de Benefícios do Brasil"
              description="Ao se tornar cliente iGreen seguros, você se torna um membro exclusivo e ganha acesso a diversos descontos e promoções em estabelecimentos parceiros."
              className="mb-8"
            />

            <div className="mb-8 space-y-4">
              {CLUB_FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 seguros-glass rounded-2xl p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-seguros-primary/15">
                    <Icon className="h-5 w-5 text-seguros-primary" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="block text-sm font-semibold text-seguros-text">{title}</span>
                    <p className="text-xs leading-relaxed text-seguros-muted sm:text-sm">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                trackSegurosQuoteClick("igreen_club");
                onQuoteClick();
              }}
              className="seguros-btn-primary h-12 w-full rounded-2xl px-6 text-base font-extrabold sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
            >
              Receber cotação grátis!
            </button>
          </MotionBlock>
        </div>
      </div>
    </section>
  );
}
