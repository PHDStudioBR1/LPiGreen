import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-4 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-seguros-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-seguros-headline text-2xl sm:text-4xl md:text-5xl font-extrabold text-seguros-text leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-seguros-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
