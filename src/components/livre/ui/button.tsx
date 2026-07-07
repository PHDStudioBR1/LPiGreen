"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const livreEase = [0.22, 1, 0.36, 1] as const;

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-lv-headline font-semibold",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-livre-primary focus-visible:ring-offset-2 focus-visible:ring-offset-livre-bg-default",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-livre-primary text-livre-petrol-900 hover:bg-livre-primary-hover shadow-lv-glow",
        "primary-inverted":
          "bg-livre-petrol-900 text-livre-text hover:bg-livre-petrol-700",
        secondary: "bg-livre-secondary text-livre-text hover:bg-livre-secondary/80",
        outline:
          "border border-livre-primary bg-transparent text-livre-primary hover:bg-livre-primary/10",
        ghost: "bg-transparent text-livre-text/80 hover:bg-white/5 hover:text-livre-text",
        whatsapp: "bg-livre-whatsapp text-white hover:bg-[#20BD5A]",
        link: "bg-transparent text-livre-primary underline-offset-4 hover:underline rounded-none px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm [&_svg]:size-4",
        md: "h-11 px-6 text-sm [&_svg]:size-5",
        lg: "h-[52px] px-8 text-base [&_svg]:size-5",
        xl: "h-14 px-10 text-base [&_svg]:size-5",
        icon: "size-11 [&_svg]:size-5",
        "icon-lg": "size-14 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type LivreButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    fullWidth?: boolean;
  };

export function LivreButton({
  className,
  variant,
  size,
  isLoading = false,
  loadingText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth,
  disabled,
  children,
  ...props
}: LivreButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const content: ReactNode = isLoading ? (
    <>
      <Loader2 className="animate-spin" aria-hidden />
      <span>{loadingText ?? children}</span>
    </>
  ) : (
    <>
      {LeftIcon && <LeftIcon aria-hidden />}
      {children}
      {RightIcon && <RightIcon aria-hidden />}
    </>
  );

  return (
    <motion.button
      type="button"
      className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
      disabled={disabled || isLoading}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: livreEase }}
      {...(props as HTMLMotionProps<"button">)}
    >
      {content}
    </motion.button>
  );
}

export { buttonVariants };
