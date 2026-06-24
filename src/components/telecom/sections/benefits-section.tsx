"use client";

import {
  Gift,
  Globe,
  Headphones,
  Layers,
  MessageCircle,
  Plane,
  Smartphone,
  SmartphoneCharging,
  Unlock,
  Users,
  Wallet,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { TELECOM_BENEFITS } from "@/lib/telecom/data";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { MotionBlock, MotionItem, MotionStagger } from "@/components/telecom/ui/motion";

const ICON_MAP: Record<string, LucideIcon> = {
  layers: Layers,
  unlock: Unlock,
  "message-circle": MessageCircle,
  gift: Gift,
  wifi: Wifi,
  wallet: Wallet,
  users: Users,
  smartphone: Smartphone,
  globe: Globe,
  plane: Plane,
  headphones: Headphones,
  "smartphone-charging": SmartphoneCharging,
};

export function BenefitsSection() {
  return (
    <section id="beneficios" className="benefits relative py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            title="Internet que acompanha seu ritmo"
            description="Mais liberdade. Mais benefícios. Mais conexão."
          />
          <p className="-mt-8 mb-12 mx-auto max-w-3xl text-center text-base leading-relaxed text-white/60 sm:text-lg md:mb-16">
            A iGreen Telecom combina tecnologia, economia e flexibilidade para oferecer uma
            experiência diferente das operadoras tradicionais.
          </p>
        </MotionBlock>

        <MotionStagger className="benefits-grid grid gap-5 lg:grid-cols-3">
          {TELECOM_BENEFITS.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon] ?? Layers;
            return (
              <MotionItem key={benefit.id}>
                <article className="group h-full rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#00e676]/25 hover:bg-white/[0.06]">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00e676]/15 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-[#00e676]" />
                    </div>
                    <span className="font-tc-headline text-2xl font-bold leading-none text-white/20 transition-colors duration-300 group-hover:text-[#00e676]/40">
                      {benefit.number}
                    </span>
                  </div>
                  <h3 className="font-tc-headline text-lg font-bold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {benefit.description}
                  </p>
                </article>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </Container>
    </section>
  );
}
