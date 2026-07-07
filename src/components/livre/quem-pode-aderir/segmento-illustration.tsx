"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SegmentoId =
  | "industrias"
  | "supermercados"
  | "hoteis"
  | "hospitais"
  | "condominios"
  | "academias"
  | "transformador";

type SegmentoIllustrationProps = {
  id: SegmentoId;
  className?: string;
};

const stroke = "rgba(100, 255, 218, 0.5)";
const fill = "rgba(0, 200, 83, 0.15)";
const fillStrong = "rgba(0, 200, 83, 0.35)";

export function SegmentoIllustration({ id, className }: SegmentoIllustrationProps) {
  return (
    <div
      className={cn(
        "relative flex h-28 items-center justify-center overflow-hidden rounded-lv-lg border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent sm:h-32",
        className
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,200,83,0.12),transparent_70%)]" />
      {ILLUSTRATIONS[id]}
    </div>
  );
}

const ILLUSTRATIONS: Record<SegmentoId, ReactNode> = {
  industrias: (
    <svg viewBox="0 0 120 80" className="h-16 w-auto sm:h-20" fill="none">
      <rect x="20" y="35" width="35" height="30" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <rect x="28" y="42" width="8" height="8" rx="1" fill={fillStrong} />
      <rect x="40" y="42" width="8" height="8" rx="1" fill={fillStrong} />
      <rect x="55" y="28" width="28" height="37" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <rect x="63" y="36" width="7" height="7" rx="1" fill={fillStrong} />
      <rect x="74" y="36" width="7" height="7" rx="1" fill={fillStrong} />
      <rect x="68" y="50" width="10" height="15" rx="1" fill="rgba(15,45,53,0.8)" stroke={stroke} strokeWidth="1" />
      <rect x="62" y="18" width="6" height="10" rx="1" fill="rgba(255,255,255,0.12)" />
      <rect x="72" y="14" width="5" height="14" rx="1" fill="rgba(255,255,255,0.1)" />
      <circle cx="65" cy="16" r="2" fill="#64FFDA" opacity="0.6" />
      <circle cx="75" cy="12" r="1.5" fill="#00C853" opacity="0.5" />
      <line x1="10" y1="65" x2="110" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  ),
  supermercados: (
    <svg viewBox="0 0 120 80" className="h-16 w-auto sm:h-20" fill="none">
      <rect x="25" y="30" width="70" height="35" rx="4" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <path d="M25 38h70" stroke={stroke} strokeWidth="1" opacity="0.6" />
      <rect x="35" y="42" width="50" height="18" rx="2" fill="rgba(15,45,53,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="50" cy="22" r="8" fill={fill} stroke={stroke} strokeWidth="1" />
      <path d="M46 22h8M50 18v8" stroke="#64FFDA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <rect x="78" y="48" width="14" height="10" rx="2" fill={fillStrong} stroke={stroke} strokeWidth="1" />
      <circle cx="84" cy="62" r="3" fill="rgba(255,255,255,0.2)" />
      <circle cx="90" cy="62" r="3" fill="rgba(255,255,255,0.2)" />
      <line x1="10" y1="65" x2="110" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  ),
  hoteis: (
    <svg viewBox="0 0 120 80" className="h-16 w-auto sm:h-20" fill="none">
      <rect x="30" y="25" width="60" height="40" rx="4" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <rect x="38" y="33" width="10" height="10" rx="1.5" fill={fillStrong} />
      <rect x="52" y="33" width="10" height="10" rx="1.5" fill={fillStrong} />
      <rect x="66" y="33" width="10" height="10" rx="1.5" fill={fillStrong} />
      <rect x="38" y="47" width="10" height="10" rx="1.5" fill={fillStrong} />
      <rect x="52" y="47" width="10" height="10" rx="1.5" fill={fillStrong} />
      <rect x="66" y="47" width="10" height="10" rx="1.5" fill={fillStrong} />
      <rect x="52" y="57" width="16" height="8" rx="1" fill="rgba(15,45,53,0.8)" stroke={stroke} strokeWidth="1" />
      {[42, 56, 70].map((x) => (
        <path
          key={x}
          d={`M${x} 18l2 4h-4z`}
          fill="#64FFDA"
          opacity="0.55"
        />
      ))}
      <line x1="10" y1="65" x2="110" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  ),
  hospitais: (
    <svg viewBox="0 0 120 80" className="h-16 w-auto sm:h-20" fill="none">
      <rect x="28" y="28" width="64" height="37" rx="4" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <rect x="36" y="36" width="12" height="12" rx="1.5" fill={fillStrong} />
      <rect x="72" y="36" width="12" height="12" rx="1.5" fill={fillStrong} />
      <rect x="52" y="52" width="16" height="13" rx="1" fill="rgba(15,45,53,0.8)" stroke={stroke} strokeWidth="1" />
      <circle cx="60" cy="22" r="10" fill={fillStrong} stroke={stroke} strokeWidth="1.2" />
      <path d="M60 17v10M55 22h10" stroke="#64FFDA" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="65" x2="110" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  ),
  condominios: (
    <svg viewBox="0 0 120 80" className="h-16 w-auto sm:h-20" fill="none">
      <rect x="15" y="32" width="28" height="33" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <rect x="46" y="22" width="28" height="43" rx="3" fill={fillStrong} stroke={stroke} strokeWidth="1.2" />
      <rect x="77" y="36" width="28" height="29" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2" />
      {[20, 32, 55, 67, 86, 98].map((x, i) => (
        <rect
          key={i}
          x={x}
          y={i < 2 ? 40 : i < 4 ? 30 : 44}
          width="6"
          height="6"
          rx="1"
          fill="rgba(100,255,218,0.25)"
        />
      ))}
      <line x1="10" y1="65" x2="110" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  ),
  academias: (
    <svg viewBox="0 0 120 80" className="h-16 w-auto sm:h-20" fill="none">
      <rect x="22" y="38" width="8" height="22" rx="3" fill={fillStrong} stroke={stroke} strokeWidth="1.2" />
      <rect x="90" y="38" width="8" height="22" rx="3" fill={fillStrong} stroke={stroke} strokeWidth="1.2" />
      <rect x="30" y="44" width="60" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <circle cx="60" cy="30" r="12" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <path d="M54 30c0-3 2.5-5 6-5s6 2 6 5" stroke="#64FFDA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="10" y1="65" x2="110" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  ),
  transformador: (
    <svg viewBox="0 0 120 80" className="h-16 w-auto sm:h-20" fill="none">
      <rect x="35" y="28" width="50" height="32" rx="4" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <path d="M45 38h30M45 46h30M45 54h20" stroke="rgba(100,255,218,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="72" cy="54" r="4" fill={fillStrong} stroke={stroke} strokeWidth="1" />
      <path d="M20 40h15M85 40h15" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M20 40v-8M35 32v8M85 40v-8M100 32v8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="32" r="3" fill="#00C853" opacity="0.6" />
      <circle cx="100" cy="32" r="3" fill="#64FFDA" opacity="0.6" />
      <path
        d="M55 18l5 6-5 6-5-6z"
        fill={fillStrong}
        stroke={stroke}
        strokeWidth="1"
      />
      <line x1="10" y1="65" x2="110" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  ),
};
