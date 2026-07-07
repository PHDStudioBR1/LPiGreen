import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
};

export function HondaLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 140 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-auto sm:h-8", className)}
      aria-hidden
    >
      <text
        x="0"
        y="26"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="28"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="0.06em"
      >
        HONDA
      </text>
    </svg>
  );
}

export function RenaultLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto sm:h-9", className)}
      aria-hidden
    >
      <path
        d="M18 2L34 18L18 34L2 18L18 2Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="44"
        y="24"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="0.12em"
      >
        RENAULT
      </text>
    </svg>
  );
}

export function MarinhaLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 180 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-auto sm:h-10", className)}
      aria-hidden
    >
      <circle cx="16" cy="22" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M16 14V30M10 18H22M10 26H22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="36"
        y="18"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        MARINHA
      </text>
      <text
        x="36"
        y="32"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.08em"
        opacity="0.85"
      >
        DO BRASIL
      </text>
    </svg>
  );
}

export function AmbevLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-auto sm:h-8", className)}
      aria-hidden
    >
      <text
        x="0"
        y="26"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        AMBEV
      </text>
    </svg>
  );
}

export function CacauShowLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto sm:h-9", className)}
      aria-hidden
    >
      <text
        x="0"
        y="22"
        fill="currentColor"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontWeight="700"
        fontStyle="italic"
      >
        Cacau
      </text>
      <text
        x="68"
        y="22"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="18"
        fontWeight="600"
        letterSpacing="0.06em"
      >
        Show
      </text>
    </svg>
  );
}

export function BrfLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 80 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-auto sm:h-8", className)}
      aria-hidden
    >
      <text
        x="0"
        y="26"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="32"
        fontWeight="800"
        letterSpacing="0.02em"
      >
        BRF
      </text>
    </svg>
  );
}

export function GrupoMateusLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-auto sm:h-10", className)}
      aria-hidden
    >
      <text
        x="0"
        y="18"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="0.1em"
        opacity="0.85"
      >
        GRUPO
      </text>
      <text
        x="0"
        y="36"
        fill="currentColor"
        fontFamily="var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        MATEUS
      </text>
    </svg>
  );
}
