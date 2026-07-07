import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

const cardVariants = cva(
  "rounded-lv-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-livre-petrol-500 bg-livre-bg-elevated shadow-lv-sm",
        glass: "livre-glass shadow-lv-sm",
        featured:
          "border border-livre-primary/30 bg-gradient-to-b from-livre-bg-surface to-livre-bg-elevated shadow-lv-glow",
        outline: "border border-livre-petrol-500 bg-transparent",
        flat: "rounded-lv-lg bg-livre-bg-surface",
      },
      padding: {
        none: "",
        sm: "p-5",
        md: "p-6 sm:p-8",
        lg: "p-8 sm:p-10",
      },
      interactive: {
        true: "hover:-translate-y-0.5 hover:border-livre-primary/30 hover:shadow-lv-md motion-reduce:hover:translate-y-0",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      interactive: false,
    },
  }
);

type LivreCardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    children: ReactNode;
  };

export function LivreCard({
  className,
  variant,
  padding,
  interactive,
  children,
  ...props
}: LivreCardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

type LivreCardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function LivreCardHeader({ className, ...props }: LivreCardHeaderProps) {
  return <div className={cn("mb-4 flex flex-col gap-2", className)} {...props} />;
}

type LivreCardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function LivreCardTitle({ className, ...props }: LivreCardTitleProps) {
  return (
    <h3
      className={cn("font-lv-headline text-lg font-semibold text-livre-text sm:text-xl", className)}
      {...props}
    />
  );
}

type LivreCardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function LivreCardDescription({ className, ...props }: LivreCardDescriptionProps) {
  return (
    <p className={cn("text-sm leading-relaxed text-livre-muted sm:text-base", className)} {...props} />
  );
}

type LivreCardContentProps = HTMLAttributes<HTMLDivElement>;

export function LivreCardContent({ className, ...props }: LivreCardContentProps) {
  return <div className={cn("", className)} {...props} />;
}

type LivreCardFooterProps = HTMLAttributes<HTMLDivElement>;

export function LivreCardFooter({ className, ...props }: LivreCardFooterProps) {
  return <div className={cn("mt-6 flex items-center gap-3", className)} {...props} />;
}

export { cardVariants };
