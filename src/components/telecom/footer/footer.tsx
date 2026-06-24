import Link from "next/link";
import { Container } from "@/components/telecom/ui/container";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12 pb-28 md:pb-12">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-tc-headline text-xl font-bold tracking-tight text-white">
            Telecom<span className="text-[#00e676]">.</span>iGreen
          </span>
          <p className="max-w-2xl text-sm leading-relaxed text-white/50">
            Serviços de telefonia móvel oferecidos por MVNO devidamente autorizada pela ANATEL.
            Consulte cobertura, condições e regulamentos antes da contratação.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/50">
            <Link
              href="/telecom/politicadeprivacidade"
              className="transition-colors hover:text-[#00e676]"
            >
              Política de privacidade
            </Link>
            <Link href="/telecom/termosdeuso" className="transition-colors hover:text-[#00e676]">
              Termos de uso
            </Link>
          </div>
          <p className="text-xs text-white/40">
            © 2026 Telecom iGreen. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
