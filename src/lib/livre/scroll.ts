import {
  LIVRE_CTA_SECTION_ID,
  LIVRE_HEADER_OFFSET,
  LIVRE_HEADER_OFFSET_MOBILE,
} from "./constants";

export function scrollToLivreSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const offset =
    window.innerWidth < 1024 ? LIVRE_HEADER_OFFSET_MOBILE : LIVRE_HEADER_OFFSET;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToLivreCta() {
  scrollToLivreSection(LIVRE_CTA_SECTION_ID);
}
