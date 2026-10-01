export type LatamCountry = {
  name: string;
  code: string; // ISO 3166-1 alpha-2; la bandera está en /public/flags/<code>.svg
};

// Primero Ecuador, Colombia, Venezuela y Panamá; luego desde México hacia el sur.
export const LATAM_COUNTRIES: LatamCountry[] = [
  { name: "Ecuador", code: "ec" },
  { name: "Colombia", code: "co" },
  { name: "Venezuela", code: "ve" },
  { name: "Panamá", code: "pa" },
  { name: "México", code: "mx" },
  { name: "Guatemala", code: "gt" },
  { name: "El Salvador", code: "sv" },
  { name: "Honduras", code: "hn" },
  { name: "Nicaragua", code: "ni" },
  { name: "Costa Rica", code: "cr" },
  { name: "Cuba", code: "cu" },
  { name: "Rep. Dominicana", code: "do" },
  { name: "Haití", code: "ht" },
  { name: "Perú", code: "pe" },
  { name: "Bolivia", code: "bo" },
  { name: "Brasil", code: "br" },
  { name: "Paraguay", code: "py" },
  { name: "Uruguay", code: "uy" },
  { name: "Chile", code: "cl" },
  { name: "Argentina", code: "ar" },
];
