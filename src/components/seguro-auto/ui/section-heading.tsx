import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sa-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-sa-headline text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-sa-text">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-sa-muted sm:text-lg">{description}</p>
      )}
    </div>
  );
}
