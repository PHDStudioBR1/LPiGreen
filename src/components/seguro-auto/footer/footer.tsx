import Link from "next/link";
import { Container } from "@/components/seguro-auto/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-sa-border/60 bg-white py-12 pb-28 md:pb-12">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/images/seguros/logo-seguros-B8WMVJ8W.svg"
            alt="Seguro iGreen"
            className="h-8 w-auto opacity-80"
          />
          <p className="max-w-2xl text-sm leading-relaxed text-sa-muted">
            Produtos oferecidos por licenciado independente Igreen, representante da BP Seguradora
            S.A. regulamentado pela SUSEP 15414.659052/2024-88. Consulte condições e coberturas
            antes da contratação.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-sa-muted">
            <Link href="/seguro-auto/politicadeprivacidade" className="transition-colors hover:text-sa-primary">
              Política de privacidade
            </Link>
            <Link href="/seguro-auto/termosdeuso" className="transition-colors hover:text-sa-primary">
              Termos de uso
            </Link>
          </div>
          <p className="text-xs text-sa-muted/70">
            © 2026 representanteigreen Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
