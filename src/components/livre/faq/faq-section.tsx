"use client";

import {
  LivreAccordion,
  LivreSection,
  LivreSectionHeader,
  MotionItem,
  type LivreAccordionItem,
} from "@/components/livre/ui";

const FAQ_ITEMS: LivreAccordionItem[] = [
  {
    id: "sem-energia",
    question: "Vou ficar sem energia?",
    answer: (
      <>
        <p>Não.</p>
        <p className="mt-3">A distribuidora continua responsável pela rede.</p>
      </>
    ),
  },
  {
    id: "encerramento-operacoes",
    question: "E se a iGreen ou Comerc encerrarem suas operações?",
    answer: (
      <p>
        O consumidor permanece protegido pela legislação e retorna ao mercado
        cativo.
      </p>
    ),
  },
  {
    id: "instalacao-eletrica",
    question: "Precisa trocar a instalação elétrica?",
    answer: (
      <>
        <p>Na maioria dos casos não.</p>
        <p className="mt-3">É apenas uma alteração contratual.</p>
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <LivreSection
      id="faq"
      aria-labelledby="faq-heading"
      animate={false}
      className="relative overflow-hidden bg-livre-bg-default"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/3 size-80 rounded-full bg-livre-accent/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <MotionItem>
          <LivreSectionHeader
            id="faq-heading"
            eyebrow="FAQ"
            title="Perguntas frequentes"
            description="Respostas diretas às principais dúvidas sobre a migração para o mercado livre de energia."
          />
        </MotionItem>

        <MotionItem>
          <div className="relative overflow-hidden rounded-lv-2xl border border-livre-petrol-500/60 bg-gradient-to-b from-livre-bg-surface/90 to-livre-bg-elevated px-5 shadow-lv-md sm:px-8 lg:px-10">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
              aria-hidden
            />
            <LivreAccordion items={FAQ_ITEMS} defaultValue="sem-energia" />
          </div>
        </MotionItem>
      </div>
    </LivreSection>
  );
}
