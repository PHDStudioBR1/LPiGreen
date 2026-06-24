"use client";

import { useCallback } from "react";
import { trackTelecomNavClick, trackTelecomQuoteClick } from "@/lib/telecom/analytics";
import { TELECOM_HEADER_OFFSET } from "@/lib/telecom/constants";
import { TELECOM_CLUB_GRID_BENEFITS } from "@/lib/telecom/data";
import { Container } from "@/components/telecom/ui/container";
import { SectionHeading } from "@/components/telecom/ui/section-heading";
import { Button } from "@/components/telecom/ui/button";
import { MotionBlock, MotionItem, MotionStagger } from "@/components/telecom/ui/motion";
import { ClubPhoneMockup } from "@/components/telecom/club/club-phone-mockup";
import { ClubFloatingBadges } from "@/components/telecom/club/club-floating-badges";
import { ClubBenefitCard } from "@/components/telecom/club/club-benefit-card";
import { ClubHighlightBlock } from "@/components/telecom/club/club-highlight-block";

type ClubSectionProps = {
  onQuoteClick?: () => void;
};

export function ClubSection({ onQuoteClick }: ClubSectionProps) {
  const scrollToPlans = useCallback(() => {
    trackTelecomNavClick("planos");
    const target = document.getElementById("planos");
    if (!target) return;
    const top =
      target.getBoundingClientRect().top + window.scrollY - TELECOM_HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handleQuote = () => {
    trackTelecomQuoteClick("club");
    onQuoteClick?.();
  };

  return (
    <section id="clube" className="relative w-full overflow-hidden py-20 md:py-28 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,230,118,0.06),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        aria-hidden
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionBlock delay={0.1} className="order-1">
            <ClubFloatingBadges>
              <ClubPhoneMockup />
            </ClubFloatingBadges>
          </MotionBlock>

          <div className="order-2">
            <MotionBlock>
              <SectionHeading
                align="left"
                eyebrow="EXCLUSIVO PARA CLIENTES IGREEN"
                title={
                  <>
                    iGreen Club:
                    <br />
                    Muito mais que um aplicativo.
                  </>
                }
                description="O iGreen Club é a central completa do cliente iGreen Telecom. Um aplicativo que reúne benefícios exclusivos, cashback, descontos em milhares de lojas e controle total da sua linha em um só lugar."
                className="mb-8 md:mb-10"
              />
            </MotionBlock>

            <MotionStagger className="grid gap-4 sm:grid-cols-2">
              {TELECOM_CLUB_GRID_BENEFITS.map((benefit) => (
                <MotionItem key={benefit.id}>
                  <ClubBenefitCard benefit={benefit} />
                </MotionItem>
              ))}
            </MotionStagger>

            <MotionBlock delay={0.2} className="mt-6">
              <ClubHighlightBlock />
            </MotionBlock>

            <MotionBlock delay={0.25} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="accent" onClick={handleQuote} className="sm:flex-1">
                QUERO APROVEITAR O IGREEN CLUB
              </Button>
              <Button variant="outline" onClick={scrollToPlans} className="sm:flex-1">
                VER PLANOS DISPONÍVEIS
              </Button>
            </MotionBlock>
          </div>
        </div>
      </Container>
    </section>
  );
}
