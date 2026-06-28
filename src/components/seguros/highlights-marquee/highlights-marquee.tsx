"use client";

import { SEGUROS_HIGHLIGHTS_MARQUEE } from "@/lib/seguros/constants";

export type HighlightsMarqueeVariant = "seguros" | "seguro-auto";

type HighlightsMarqueeProps = {
  variant: HighlightsMarqueeVariant;
};

function MarqueeGroup({
  baseClass,
  ariaHidden,
}: {
  baseClass: string;
  ariaHidden?: boolean;
}) {
  return (
    <ul className={`${baseClass}__group`} aria-hidden={ariaHidden || undefined}>
      {SEGUROS_HIGHLIGHTS_MARQUEE.map((title) => (
        <li key={title} className={`${baseClass}__item`}>
          <span className={`${baseClass}__dot`} aria-hidden />
          <span>{title}</span>
        </li>
      ))}
    </ul>
  );
}

export function HighlightsMarquee({ variant }: HighlightsMarqueeProps) {
  const baseClass =
    variant === "seguros" ? "seguros-highlights-marquee" : "sa-highlights-marquee";

  return (
    <section className={baseClass} aria-label="Destaques do seguro iGreen">
      <div className={`${baseClass}__viewport`}>
        <div className={`${baseClass}__track`}>
          <MarqueeGroup baseClass={baseClass} />
          <MarqueeGroup baseClass={baseClass} ariaHidden />
        </div>
      </div>
    </section>
  );
}
