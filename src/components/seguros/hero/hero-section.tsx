"use client";

import Image from "next/image";
import { Check, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SEGUROS_HERO_BADGES, SEGUROS_WHATSAPP_URL } from "@/lib/seguros/constants";
import { fadeLeft } from "@/components/seguros/ui/motion";

type HeroSectionProps = {
  onQuoteClick: () => void;
};

export function HeroSection({ onQuoteClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <Image
        src="/images/seguros/fundo_hero_pc.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeLeft}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl space-y-8"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full seguros-glass text-seguros-accent text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-seguros-primary animate-pulse" />
              Seguro iGreen — 100% digital
            </div>

            <h1 className="font-seguros-headline text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-seguros-text leading-[1.08]">
              Cansado de ter seu seguro{" "}
              <span className="text-seguros-primary">negado ou caro demais?</span>
            </h1>

            <p className="text-lg sm:text-xl text-seguros-muted max-w-xl leading-relaxed">
              Seguro para carro, moto e caminhão sem consulta SPC/Serasa, sem análise de perfil e sem
              fidelidade.
            </p>

            <ul className="flex flex-wrap gap-2">
              {SEGUROS_HERO_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium seguros-glass text-seguros-text"
                >
                  <Check className="w-4 h-4 text-seguros-primary shrink-0" />
                  {badge}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onQuoteClick}
                className="seguros-btn-primary h-14 sm:h-16 px-8 rounded-2xl text-lg font-extrabold w-full sm:w-auto"
              >
                Fazer Cotação Gratuita
              </button>
              <a
                href={SEGUROS_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="seguros-btn-outline h-14 sm:h-16 px-8 rounded-2xl text-lg font-bold inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
