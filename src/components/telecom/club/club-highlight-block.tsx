"use client";

import { Check } from "lucide-react";
import { TELECOM_CLUB_HIGHLIGHT_ITEMS } from "@/lib/telecom/data";

export function ClubHighlightBlock() {
  return (
    <div className="rounded-3xl border border-[#00e676]/20 bg-gradient-to-br from-[#00e676]/[0.08] to-transparent p-5 backdrop-blur-sm sm:p-6">
      <h3 className="font-tc-headline text-base font-bold text-white sm:text-lg">
        Tudo o que você precisa. Em um único aplicativo.
      </h3>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {TELECOM_CLUB_HIGHLIGHT_ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-white/75 sm:text-sm">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[#00e676]"
              strokeWidth={2.5}
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
