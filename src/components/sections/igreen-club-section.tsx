"use client";

import Image from "next/image";
import { Leaf, Percent, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      "Indique amigos e acumule créditos para zerar sua própria conta de energia e telefone celular.",
  },
] as const;

type IgreenClubSectionProps = {
  onCTAClick: () => void;
};

export function IgreenClubSection({ onCTAClick }: IgreenClubSectionProps) {
  return (
    <section id="igreen-club" className="border-t border-border bg-white py-24 dark:bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 w-full lg:order-1">
            <Image
              src="/images/igreen club.webp"
              alt="iGreen Club — Clube de Benefícios"
              width={800}
              height={600}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="mx-auto h-auto w-full max-w-lg rounded-3xl shadow-xl"
            />
          </div>

          <div className="order-1 space-y-8 lg:order-2">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                iGreen Club
              </p>
              <h2 className="font-headline text-3xl font-black text-foreground md:text-5xl">
                O melhor e maior Clube de Benefícios do Brasil
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Ao se tornar cliente iGreen Energy, você ganha acesso ao iGreen Club — descontos e
                promoções exclusivas em estabelecimentos parceiros em todo o país.
              </p>
            </div>

            <div className="space-y-4">
              {CLUB_FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-primary/5 p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="block text-sm font-semibold text-foreground">{title}</span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={onCTAClick}
              className="h-14 w-full rounded-2xl px-8 text-base font-black sm:w-auto dark:text-white"
            >
              Quero economizar na conta de luz
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
