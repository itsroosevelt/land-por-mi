export type SocialNetwork = "facebook" | "instagram" | "whatsapp" | "x" | "youtube" | "tiktok";

export type SocialLink = {
  network: SocialNetwork;
  label: string;
  imgSrc: string;
  href: string;
};

/** Enlaces generales: se usan en cualquier país que no tenga su propio enlace. */
export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { network: "facebook", label: "Facebook", imgSrc: "/assets/f.jpg", href: "https://www.facebook.com/udreamms/" },
  { network: "instagram", label: "Instagram", imgSrc: "/assets/i.jpg", href: "https://www.instagram.com/udreamms/" },
  { network: "whatsapp", label: "WhatsApp", imgSrc: "/assets/w.jpg", href: "https://wa.me/13858882799" },
  { network: "x", label: "X", imgSrc: "/assets/x.jpg", href: "https://x.com/udreamms" },
  { network: "youtube", label: "YouTube", imgSrc: "/assets/y.jpg", href: "https://www.youtube.com/@udreamms" },
  { network: "tiktok", label: "TikTok", imgSrc: "/assets/t.jpg", href: "https://www.tiktok.com/@udreamms" },
];

/**
 * Enlaces propios de cada país (código ISO en minúsculas, ver latam-countries.ts).
 * Solo pon las redes que cambian; las demás usan el enlace general.
 *
 * Ejemplo:
 *   co: {
 *     whatsapp: "https://chat.whatsapp.com/GRUPO-COLOMBIA",
 *     facebook: "https://www.facebook.com/groups/pormi-colombia",
 *   },
 */
export const COUNTRY_SOCIAL_LINKS: Record<string, Partial<Record<SocialNetwork, string>>> = {};

export function getCountrySocialLinks(countryCode: string, countryName: string): SocialLink[] {
  const overrides = COUNTRY_SOCIAL_LINKS[countryCode] ?? {};
  return DEFAULT_SOCIAL_LINKS.map((link) => {
    const custom = overrides[link.network];
    if (custom) return { ...link, href: custom };
    // Sin grupo propio, el WhatsApp general lleva el país en el mensaje para segmentar.
    if (link.network === "whatsapp") {
      return { ...link, href: `${link.href}?text=${encodeURIComponent(`Hola, soy de ${countryName} y quiero unirme a la red Por mí`)}` };
    }
    return link;
  });
}

/** Grupo de WhatsApp de la cápsula "Tengo preguntas antes de empezar". */
export const DEFAULT_QUESTIONS_LINK = "https://chat.whatsapp.com/CAeBvhShHLC7VyBy8yZzVk";

/** Grupo propio de cada país (código ISO en minúsculas); los demás usan DEFAULT_QUESTIONS_LINK. */
export const COUNTRY_QUESTIONS_LINKS: Record<string, string> = {
  ec: "https://chat.whatsapp.com/IlBVqL8K5XW76JXS23pGgt",
  ve: "https://chat.whatsapp.com/GHn4fWAjhs7Dcd21ajhD3O",
  co: "https://chat.whatsapp.com/DBqxD9iAT0S2xPZAMixrmk",
};

export function getCountryQuestionsLink(countryCode: string): string {
  return COUNTRY_QUESTIONS_LINKS[countryCode] ?? DEFAULT_QUESTIONS_LINK;
}
