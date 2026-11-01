"use client";

import { ArrowRight } from "lucide-react";
import {
  TELECOM_PROMO_ESIM_ACTIVE,
  TELECOM_PROMO_ESIM_WHATSAPP_MESSAGE,
  buildTelecomWhatsAppUrl,
} from "@/lib/telecom/constants";
import { trackTelecomWhatsAppClick } from "@/lib/telecom/analytics";
import { Container } from "@/components/telecom/ui/container";

type PromoBannerProps = {
  /** Desative a campanha sem remover o componente da página. */
  isPromoActive?: boolean;
};

/**
 * Campanha modular: 1º mês grátis na portabilidade via eSIM.
 * Para expirar: `isPromoActive={false}`, `TELECOM_PROMO_ESIM_ACTIVE = false`,
 * ou comente `<PromoBanner />` na landing.
 */
export function PromoBanner({
  isPromoActive = TELECOM_PROMO_ESIM_ACTIVE,
}: PromoBannerProps) {
  if (!isPromoActive) return null;

  const whatsappHref = buildTelecomWhatsAppUrl(TELECOM_PROMO_ESIM_WHATSAPP_MESSAGE);

  return (
    <aside
      id="promo-esim"
      aria-label="Promoção 1º mês grátis na portabilidade eSIM"
      className="relative z-20 pt-[68px] sm:pt-[72px] lg:pt-[100px]"
    >
      <Container className="pb-2 pt-3 sm:pb-3 sm:pt-4 lg:pt-5">
        <div className="telecom-promo-banner relative overflow-hidden rounded-2xl border border-[#00E676]/55 bg-[#0a120e]/95 sm:rounded-3xl">
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#00E676]/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-10 h-44 w-44 rounded-full bg-[#00E676]/12 blur-3xl"
            aria-hidden
          />

          <div className="relative px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="min-w-0 flex-1">
                <span className="telecom-promo-badge inline-flex items-center gap-1.5 rounded-full border border-[#00E676]/40 bg-[#00E676]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#00E676] sm:text-[11px]">
                  <span aria-hidden>🔥</span>
                  Oferta oficial prorrogada — tempo limitado
                </span>

                <h2 className="mt-3 font-tc-headline text-[clamp(1.2rem,3.6vw,1.85rem)] font-extrabold leading-tight tracking-tight text-white">
                  1º MÊS GRÁTIS: Traga seu número para o eSIM iGreen!
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-[15px]">
                  Ganhe 30 dias de isenção total no Plano Start (11GB). Sem taxa de adesão,
                  sem chip físico e sem fidelidade.
                </p>

                <ul className="mt-3 space-y-1.5 text-[12px] leading-snug text-white/65 sm:text-[13px]">
                  <li className="flex gap-2">
                    <span className="shrink-0" aria-hidden>
                      📱
                    </span>
                    <span>
                      Exclusivo para portabilidade e aparelhos compatíveis com eSIM.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0" aria-hidden>
                      💡
                    </span>
                    <span>
                      Dica de compatibilidade: digite{" "}
                      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-[#00E676] sm:text-xs">
                        *#06#
                      </code>{" "}
                      no discador. Se aparecer o código EID, seu celular aceita eSIM!
                    </span>
                  </li>
                </ul>
              </div>

              <div className="shrink-0 lg:max-w-[280px] xl:max-w-[320px]">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackTelecomWhatsAppClick("promo_esim_banner")}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00E676] px-5 py-3.5 text-center text-sm font-extrabold leading-snug text-[#04140a] shadow-[0_8px_28px_rgba(0,230,118,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1aff8c] hover:shadow-[0_12px_36px_rgba(0,230,118,0.45)] active:translate-y-0 sm:text-[15px] lg:px-6 lg:py-4"
                >
                  <span className="text-balance">
                    Resgatar Voucher de 1º Mês Grátis no WhatsApp
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </aside>
  );
}
