"use client";

import { motion } from "framer-motion";
import { Leaf, Percent, Store } from "lucide-react";
import { trackSegurosQuoteClick } from "@/lib/seguro-auto/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

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

type ClubSectionProps = {
  onQuoteClick?: () => void;
};

export function ClubSection({ onQuoteClick }: ClubSectionProps) {
  return (
    <section id="igreen-club" className="bg-white py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <MotionBlock
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            className="flex justify-center lg:justify-start"
          >
            <motion.img
              src="/images/seguros/igreen club.webp"
              alt="iGreen Club — benefícios exclusivos"
              className="max-h-[520px] w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.12)]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            />
          </MotionBlock>

          <MotionBlock
            variants={{
              hidden: { opacity: 0, x: 32 },
              visible: { opacity: 1, x: 0 },
            }}
            delay={0.15}
          >
            <SectionHeading
              align="left"
              eyebrow="iGreen Club"
              title="O melhor e maior Clube de Benefícios do Brasil"
              description="Ao se tornar cliente iGreen seguros, você se torna um membro exclusivo e ganha acesso a diversos descontos e promoções em estabelecimentos parceiros."
              className="mb-8"
            />

            <div className="space-y-3">
              {CLUB_FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-sa-border bg-sa-surface/60 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sa-primary/10">
                    <Icon className="h-5 w-5 text-sa-primary" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="block text-sm font-semibold text-sa-text">{title}</span>
                    <p className="text-xs leading-relaxed text-sa-muted sm:text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                onClick={() => {
                  trackSegurosQuoteClick("club");
                  onQuoteClick?.();
                }}
              >
                Receber cotação grátis!
              </Button>
            </div>
          </MotionBlock>
        </div>
      </Container>
    </section>
  );
}
