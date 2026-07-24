/**
 * GTM is the primary tag router when NEXT_PUBLIC_GTM_ID is a real container id.
 * Until then, channel events still go via gtag direto.
 */
export function isGtmContainerConfigured(
  gtmId: string | undefined = process.env.NEXT_PUBLIC_GTM_ID
): boolean {
  return Boolean(gtmId && gtmId.startsWith("GTM-"));
}
