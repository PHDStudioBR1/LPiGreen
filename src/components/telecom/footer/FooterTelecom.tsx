import Link from "next/link";
import { TELECOM_LOGO_SRC, TELECOM_WHATSAPP_URL } from "@/lib/telecom/constants";
import { Container } from "@/components/telecom/ui/container";

const linkClassName =
  "text-sm text-zinc-400 transition-colors hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm";

/**
 * Rodapé de compliance LGPD / Guia de Conduta do Licenciado iGreen Telecom.
 */
export function FooterTelecom() {
  return (
    <footer className="relative border-t border-zinc-800 bg-zinc-950 py-12 pb-28 md:pb-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Sobre o Licenciado */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={TELECOM_LOGO_SRC}
                alt="iGreen Telecom"
                className="h-9 w-auto"
              />
            </div>
            <h3 className="font-tc-headline text-sm font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Sobre o Licenciado
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Este site é operado por{" "}
              <span className="text-zinc-200">Marcelo Narita</span>, Licenciado Autorizado iGreen
              Energy — ID <span className="text-zinc-200">121530</span>.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="font-tc-headline text-sm font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Links Rápidos
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/telecom/termosdeuso" className={linkClassName}>
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/telecom/politicadeprivacidade" className={linkClassName}>
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a
                  href={TELECOM_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  Suporte ao Cliente / Atendimento via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Avisos Legais */}
          <div className="space-y-4">
            <h3 className="font-tc-headline text-sm font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Avisos Legais
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              As informações apresentadas neste site possuem caráter informativo e comercial para a
              contratação dos planos da iGreen Telecom. Os serviços de telefonia móvel são prestados
              em modelo MVNO (Operadora Móvel Virtual) através da infraestrutura de redes homologadas
              e devidamente autorizadas pela ANATEL.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6">
          <p className="text-center text-xs leading-relaxed text-zinc-500 sm:text-left">
            © 2026 546 Digital &amp; ConexLivre. Todos os direitos reservados. iGreen Telecom® é uma
            marca registrada pertencente ao grupo iGreen Energy.
          </p>
        </div>
      </Container>
    </footer>
  );
}
