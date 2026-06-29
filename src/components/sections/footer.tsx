import Link from "next/link";
import { HOME_LOGO_SRC } from "@/lib/home/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-white py-12 pb-28 dark:bg-neutral-950 md:pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src={HOME_LOGO_SRC}
            alt="iGreen Energy"
            className="h-9 w-auto"
          />
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Serviços de energia por assinatura oferecidos por licenciado independente iGreen, em
            parceria com Vibra e Comerc Energia. Modelo 100% regulamentado pela ANEEL (Lei
            14.300/2022). Consulte condições e disponibilidade na sua região antes da contratação.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link
              href="/politicadeprivacidade"
              className="transition-colors hover:text-primary"
            >
              Política de privacidade
            </Link>
            <Link href="/termosdeuso" className="transition-colors hover:text-primary">
              Termos de uso
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/70">
            © 2026 iGreen Energy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
