"use client";

import Image from "next/image";
import { Check, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SEGUROS_HERO_BADGES, SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";
import { fadeLeft } from "@/components/seguros/ui/motion";

const HERO_BG = "/images/seguros/fundo_hero_pc.png";

type HeroSectionProps = {
  onQuoteClick: () => void;
};

export function HeroSection({ onQuoteClick }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-[72px] lg:flex lg:min-h-[92vh] lg:items-center"
    >
      {/* Fundo desktop — imagem em tela cheia */}
      <Image
        src={HERO_BG}
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none hidden object-cover object-center lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-seguros-bg/50 via-transparent to-transparent lg:block"
        aria-hidden
      />

      {/* Fundo mobile — gradiente sólido, sem sobrepor o conteúdo */}
      <div className="pointer-events-none absolute inset-0 seguros-gradient-hero lg:hidden" aria-hidden />

      <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeLeft}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl space-y-5 sm:space-y-8"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold seguros-glass text-seguros-accent sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-seguros-primary" />
            Seguro iGreen — 100% digital
          </div>

          <h1 className="font-seguros-headline text-[1.75rem] font-extrabold leading-[1.1] text-seguros-text sm:text-5xl md:text-6xl xl:text-7xl">
            Cansado de ter seu seguro{" "}
            <span className="text-seguros-primary">negado ou caro demais?</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-seguros-muted sm:text-lg md:text-xl">
            Seguro para carro, moto e caminhão sem consulta SPC/Serasa, sem análise de perfil e sem
            fidelidade.
          </p>

          <ul className="flex flex-wrap gap-2">
            {SEGUROS_HERO_BADGES.map((badge) => (
              <li
                key={badge}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium seguros-glass text-seguros-text sm:px-3 sm:text-sm"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-seguros-primary sm:h-4 sm:w-4" />
                {badge}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={onQuoteClick}
              className="seguros-btn-primary h-12 w-full rounded-2xl px-6 text-base font-extrabold sm:h-16 sm:w-auto sm:px-8 sm:text-lg"
            >
              Fazer Cotação Gratuita
            </button>
            <a
              href={SEGUROS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="seguros-btn-outline inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold sm:h-16 sm:w-auto sm:px-8 sm:text-lg"
            >
              <MessageCircle className="h-5 w-5 shrink-0" />
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
