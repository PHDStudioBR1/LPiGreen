import { Container } from "@/components/seguro-auto/ui/container";
import { MotionBlock } from "@/components/seguro-auto/ui/motion";

const STATS = [
  { value: "50k+", label: "Veículos protegidos" },
  { value: "24h", label: "Assistência disponível" },
  { value: "3 min", label: "Para cotar online" },
  { value: "0", label: "Consulta SPC/Serasa" },
] as const;

export function TrustBar() {
  return (
    <section className="border-y border-sa-border/60 bg-sa-surface/50 py-8">
      <Container>
        <MotionBlock>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-sa-headline text-2xl font-bold text-sa-primary sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-sa-muted sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </MotionBlock>
      </Container>
    </section>
  );
}
