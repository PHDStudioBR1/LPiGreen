"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Container } from "./container";
import { MotionBlock } from "./motion";

type LivreSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  size?: "default" | "sm";
  animate?: boolean;
  "aria-labelledby"?: string;
};

const sizeMap = {
  default: "py-16 lg:py-24",
  sm: "py-12 lg:py-16",
};

export function LivreSection({
  id,
  children,
  className,
  containerClassName,
  size = "default",
  animate = true,
  "aria-labelledby": ariaLabelledby,
}: LivreSectionProps) {
  const content = (
    <Container className={containerClassName}>{children}</Container>
  );

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(sizeMap[size], className)}
    >
      {animate ? <MotionBlock as="div">{content}</MotionBlock> : content}
    </section>
  );
}

type LivreSectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  badge?: ReactNode;
  id?: string;
  className?: string;
};

export function LivreSectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  badge,
  id,
  className,
}: LivreSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-2xl text-left",
        className
      )}
    >
      {(eyebrow || badge) && (
        <div
          className={cn(
            "mb-3 flex items-center gap-2",
            align === "center" && "justify-center"
          )}
        >
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-livre-accent">
              {eyebrow}
            </p>
          )}
          {badge}
        </div>
      )}
      <h2
        id={id}
        className="font-lv-headline text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-livre-text text-balance"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-livre-muted sm:text-lg text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
