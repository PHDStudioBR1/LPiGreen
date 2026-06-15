"use client";

import { HowItWorksTimeline } from "@/components/seguros/how-it-works-timeline";

type HowItWorksSectionProps = {
  onQuoteClick: () => void;
};

export function HowItWorksSection({ onQuoteClick }: HowItWorksSectionProps) {
  return <HowItWorksTimeline onQuoteClick={onQuoteClick} />;
}
