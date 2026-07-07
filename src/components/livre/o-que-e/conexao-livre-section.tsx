"use client";

import {
  Building2,
  Cable,
  Handshake,
  Leaf,
  Link2,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  LivreBadge,
  LivreCard,
  LivreCardDescription,
  LivreCardTitle,
  LivreIconBox,
  LivreSection,
  LivreSectionHeader,
  MotionItem,
  MotionStagger,
} from "@/components/livre/ui";
import { ConexaoLivreVisual } from "./conexao-livre-visual";

const CONTENT = {
  intro:
    "A Conexão Livre é o serviço da iGreen que conecta sua empresa ao Ambiente de Contratação Livre (ACL).",
  transition:
    "O empresário deixa de ser cliente cativo da distribuidora e passa a negociar diretamente o fornecedor e o preço da energia.",
  sameGrid: "A rede elétrica permanece exatamente a mesma.",
  infrastructure:
    "Os postes, fios e infraestrutura continuam sendo da distribuidora local.",
  differential:
    "O diferencial é que a energia passa a ser adquirida de fontes renováveis com preço mais competitivo.",
} as const;

const INFO_CARDS = [
  {
    icon: Handshake,
    title: CONTENT.transition,
    variant: "featured" as const,
  },
  {
    icon: Zap,
    title: CONTENT.sameGrid,
    variant: "default" as const,
  },
  {
    icon: Cable,
    title: CONTENT.infrastructure,
    variant: "default" as const,
  },
] as const;

export function ConexaoLivreSection() {
  return (
    <LivreSection
      id="o-que-e"
      aria-labelledby="o-que-e-heading"
      animate={false}
      className="relative overflow-hidden bg-livre-bg-base"
    >
      <div
        className="pointer-events-none absolute inset-0 livre-hero-mesh opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-livre-primary/20 to-transparent"
        aria-hidden
      />

      <div className="relative">
        <LivreSectionHeader
          id="o-que-e-heading"
          eyebrow="Entenda"
          title="O que é a Conexão Livre"
          description={CONTENT.intro}
          badge={
            <LivreBadge variant="accent" size="sm" icon={<Link2 className="size-3" aria-hidden />}>
              ACL
            </LivreBadge>
          }
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <MotionItem>
            <ConexaoLivreVisual />
          </MotionItem>

          <MotionStagger className="flex flex-col gap-4">
            {INFO_CARDS.map(({ icon, title, variant }, index) => (
              <MotionItem key={index}>
                <LivreCard
                  variant={variant}
                  padding="md"
                  interactive
                  className="group h-full"
                >
                  <div className="flex gap-4">
                    <LivreIconBox
                      icon={icon}
                      variant={variant === "featured" ? "filled" : "default"}
                      size="lg"
                      className="transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    />
                    <div className="min-w-0 flex-1 pt-1">
                      {variant === "featured" ? (
                        <>
                          <LivreCardTitle className="text-base sm:text-lg leading-snug">
                            {title}
                          </LivreCardTitle>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-full border border-livre-primary/20 bg-livre-primary/10 px-2.5 py-1">
                              <Building2 className="size-3 text-livre-primary" aria-hidden />
                              <span className="text-[11px] font-medium text-livre-primary">
                                Sua empresa
                              </span>
                            </div>
                            <span className="text-livre-muted" aria-hidden>
                              →
                            </span>
                            <div className="flex items-center gap-1.5 rounded-full border border-livre-accent/20 bg-livre-accent/10 px-2.5 py-1">
                              <Handshake className="size-3 text-livre-accent" aria-hidden />
                              <span className="text-[11px] font-medium text-livre-accent">
                                ACL
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <LivreCardDescription className="text-base text-livre-text/85">
                          {title}
                        </LivreCardDescription>
                      )}
                    </div>
                  </div>
                </LivreCard>
              </MotionItem>
            ))}

            <MotionItem>
              <LivreCard
                variant="featured"
                padding="lg"
                className="relative overflow-hidden border-livre-primary/40"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-livre-primary/10 blur-2xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-livre-accent/10 blur-2xl"
                  aria-hidden
                />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="relative">
                      <LivreIconBox icon={Leaf} variant="filled" size="lg" />
                      <Sparkles
                        className="absolute -right-1 -top-1 size-4 text-livre-accent"
                        aria-hidden
                      />
                    </div>
                    <div className="flex flex-col gap-1 sm:hidden">
                      <RenewableIcons />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-lv-headline text-lg font-semibold leading-snug text-livre-text sm:text-xl text-balance">
                      {CONTENT.differential}
                    </p>
                    <div className="mt-4 hidden sm:block">
                      <RenewableIcons />
                    </div>
                  </div>
                </div>
              </LivreCard>
            </MotionItem>
          </MotionStagger>
        </div>
      </div>
    </LivreSection>
  );
}

function RenewableIcons() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {[
        { Icon: Leaf, label: "Renovável" },
        { Icon: Sparkles, label: "Sustentável" },
      ].map(({ Icon, label }) => (
        <div
          key={label}
          className="flex size-9 items-center justify-center rounded-lv-md border border-livre-primary/20 bg-livre-primary/10"
          title={label}
        >
          <Icon className="size-4 text-livre-primary" />
        </div>
      ))}
    </div>
  );
}
