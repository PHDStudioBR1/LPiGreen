"use client";

import {
  CreditCard,
  Gift,
  Signal,
  Smartphone,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { TelecomClubBenefit } from "@/lib/telecom/data";

const ICON_MAP: Record<TelecomClubBenefit["icon"], LucideIcon> = {
  gift: Gift,
  wallet: Wallet,
  signal: Signal,
  "credit-card": CreditCard,
  smartphone: Smartphone,
  users: Users,
};

type ClubBenefitCardProps = {
  benefit: TelecomClubBenefit;
};

export function ClubBenefitCard({ benefit }: ClubBenefitCardProps) {
  const Icon = ICON_MAP[benefit.icon];

  return (
    <article className="group h-full rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#00e676]/25 hover:bg-white/[0.06] sm:p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#00e676]/15 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5 text-[#00e676]" />
      </div>
      <h3 className="font-tc-headline text-sm font-bold text-white sm:text-base">
        {benefit.title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-white/55 sm:text-sm">
        {benefit.description}
      </p>
    </article>
  );
}
