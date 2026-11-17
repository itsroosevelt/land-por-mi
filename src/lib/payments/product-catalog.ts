/**
 * Catálogo único de precios — fuente de verdad para portal, crypto y Stripe.
 * Precios tarjeta alineados con instructions-payment-student / tourist.
 * Además del catálogo fijo, `getProductEntry` acepta los cobros personalizados (custom-charge.ts).
 */
import { customChargeName, parseCustomChargeId } from '@/lib/payments/custom-charge';

export interface ProductCatalogEntry {
  name: string;
  cardPriceUsd: number;
  cryptoPriceUsd: number | null;
  stripePaymentLink: string | null;
}

export interface SchoolProductInfo {
  id: string;
  name: string;
  schoolName: string;
  state: string;
  price: number;
}

export const UTAH_SCHOOLS_CATALOG: SchoolProductInfo[] = [
  {
    id: 'aplicacion-escuela-lumos-slc',
    name: 'Aplicación - Lumos Language School (Salt Lake City)',
    schoolName: 'Lumos Language School (Salt Lake City)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-lumos-orem',
    name: 'Aplicación - Lumos Language School (Orem)',
    schoolName: 'Lumos Language School (Orem)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-uceda',
    name: 'Aplicación - Uceda School of Utah (Provo)',
    schoolName: 'Uceda School of Utah (Provo)',
    state: 'Utah',
    price: 150,
  },
  {
    id: 'aplicacion-escuela-language-on',
    name: 'Aplicación - LANGUAGE ON (Salt Lake City)',
    schoolName: 'LANGUAGE ON (Salt Lake City)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-internexus-1',
    name: 'Aplicación - Internexus Provo (Campus 1)',
    schoolName: 'Internexus Provo (Campus 1 - Provo)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-internexus-2',
    name: 'Aplicación - Internexus Provo (Campus 2)',
    schoolName: 'Internexus Provo (Campus 2 - Provo)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-american-one',
    name: 'Aplicación - American One English Schools',
    schoolName: 'American One English Schools INC (West Valley)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-inx',
    name: 'Aplicación - INX Academy (Salt Lake City)',
    schoolName: 'INX Academy (Salt Lake City)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-pace',
    name: 'Aplicación - PACE International Academy',
    schoolName: 'PACE International Academy (Orem)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-us-ling',
    name: 'Aplicación - U.S. Ling Institute (Murray)',
    schoolName: 'U.S. Ling Institute (Murray)',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-byu',
    name: 'Aplicación - Brigham Young University',
    schoolName: 'Brigham Young University - Provo',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-uvu',
    name: 'Aplicación - Utah Valley University',
    schoolName: 'Utah Valley University (Orem)',
    state: 'Utah',
    price: 115,
  },
  {
    id: 'aplicacion-escuela-uofu',
    name: 'Aplicación - University of Utah',
    schoolName: 'University of Utah (Salt Lake City)',
    state: 'Utah',
    price: 135,
  },
  {
    id: 'aplicacion-escuela-usu',
    name: 'Aplicación - Utah State University',
    schoolName: 'Utah State University (Logan)',
    state: 'Utah',
    price: 110,
  },
  {
    id: 'aplicacion-escuela-slcc',
    name: 'Aplicación - Salt Lake Community College',
    schoolName: 'Salt Lake Community College',
    state: 'Utah',
    price: 100,
  },
  {
    id: 'aplicacion-escuela-otra',
    name: 'Aplicación - Otra Escuela (Utah)',
    schoolName: 'Otra Escuela (Utah)',
    state: 'Utah',
    price: 100,
  },
];

export const PRODUCT_CATALOG: Record<string, ProductCatalogEntry> = {
  // ── Servicios para empresas (tiendas /tienda y /portal/tienda). Se cobra el primer pago. ──
  'servicio-crear-empresa-usa': { name: "Crear Empresa en EE. UU. + EIN + DUNS (pago inicial)", cardPriceUsd: 450, cryptoPriceUsd: 450, stripePaymentLink: null },
  'servicio-renovacion-empresa': { name: "Renovación Anual de Empresa (suscripción anual, 1 año)", cardPriceUsd: 50, cryptoPriceUsd: 50, stripePaymentLink: null },
  'servicio-agente-registrado': { name: "Agente Registrado y Dirección Comercial (suscripción anual, 1 año)", cardPriceUsd: 400, cryptoPriceUsd: 400, stripePaymentLink: null },
  'servicio-cuenta-bancaria': { name: "Cuenta Bancaria Empresarial en EE. UU. (pago único por cuenta)", cardPriceUsd: 200, cryptoPriceUsd: 200, stripePaymentLink: null },
  'servicio-telefono-whatsapp': { name: "Teléfono Comercial de EE. UU. + WhatsApp Business (suscripción mensual, 1 mes)", cardPriceUsd: 100, cryptoPriceUsd: 100, stripePaymentLink: null },
  'servicio-identidad-visual': { name: "Identidad Visual: Logo + Manual de Marca (pago único)", cardPriceUsd: 1000, cryptoPriceUsd: 1000, stripePaymentLink: null },
  'servicio-registro-marca': { name: "Registro de Marca (Trademark) (pago único)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-impuestos-personales': { name: "Impuestos Personales (suscripción anual, 1 año)", cardPriceUsd: 200, cryptoPriceUsd: 200, stripePaymentLink: null },
  'servicio-meta-business': { name: "Configuración de Meta Business Suite (pago inicial)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-meta-business-mensual': { name: "Mantenimiento de Meta Business Suite (suscripción mensual, 1 mes)", cardPriceUsd: 20, cryptoPriceUsd: 20, stripePaymentLink: null },
  'servicio-pasarela-pagos': { name: "Instalación de Pasarela de Pagos (pago inicial)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-pasarela-pagos-mensual': { name: "Mantenimiento de Pasarela de Pagos (suscripción mensual, 1 mes)", cardPriceUsd: 20, cryptoPriceUsd: 20, stripePaymentLink: null },
  'servicio-seo-local': { name: "Google Business Profile + Search Console + Analytics + SEO (pago inicial)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-seo-local-mensual': { name: "Mantenimiento de Google Business + SEO (suscripción mensual, 1 mes)", cardPriceUsd: 20, cryptoPriceUsd: 20, stripePaymentLink: null },
  'servicio-automatizacion-whatsapp': { name: "Automatización de Respuestas para WhatsApp, Instagram, Messenger y Comentarios (pago único)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-diseno-web': { name: "Diseño Web · Pago Inicial", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-diseno-web-mensual': { name: "Diseño Web · Mensualidad (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-plataforma-web': { name: "Plataforma Web · Pago Inicial", cardPriceUsd: 1000, cryptoPriceUsd: 1000, stripePaymentLink: null },
  'servicio-plataforma-web-mensual': { name: "Plataforma Web · Mensualidad (suscripción mensual, 1 mes)", cardPriceUsd: 1000, cryptoPriceUsd: 1000, stripePaymentLink: null },
  'servicio-app-ios': { name: "App iOS · Pago Inicial", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-app-ios-mensual': { name: "App iOS · Mensualidad (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-app-android': { name: "App Android · Pago Inicial", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-app-android-mensual': { name: "App Android · Mensualidad (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-diseno-web-unico': { name: "Diseño Web · Pago Único", cardPriceUsd: 6000, cryptoPriceUsd: 6000, stripePaymentLink: null },
  'servicio-plataforma-web-unico': { name: "Plataforma Web · Pago Único", cardPriceUsd: 12000, cryptoPriceUsd: 12000, stripePaymentLink: null },
  'servicio-app-ios-unico': { name: "App iOS · Pago Único", cardPriceUsd: 6000, cryptoPriceUsd: 6000, stripePaymentLink: null },
  'servicio-app-android-unico': { name: "App Android · Pago Único", cardPriceUsd: 6000, cryptoPriceUsd: 6000, stripePaymentLink: null },
  'servicio-tienda-online-unico': { name: "Tienda en Línea (E-commerce) · Pago Único", cardPriceUsd: 12000, cryptoPriceUsd: 12000, stripePaymentLink: null },
  'servicio-mantenimiento-web-apps': { name: "Mantenimiento de Web y Apps (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-kyc-instalacion': { name: "Instalación de KYC (Verificación de Identidad) (pago inicial)", cardPriceUsd: 1000, cryptoPriceUsd: 1000, stripePaymentLink: null },
  'servicio-kyc-mensual': { name: "Suscripción de KYC (suscripción mensual, 1 mes)", cardPriceUsd: 50, cryptoPriceUsd: 50, stripePaymentLink: null },
  'servicio-tienda-online': { name: "Tienda en Línea (E-commerce) · Pago Inicial", cardPriceUsd: 1000, cryptoPriceUsd: 1000, stripePaymentLink: null },
  'servicio-tienda-online-mensual': { name: "Tienda en Línea (E-commerce) · Mensualidad (suscripción mensual, 1 mes)", cardPriceUsd: 1000, cryptoPriceUsd: 1000, stripePaymentLink: null },
  'servicio-campana-publicitaria': { name: "Configuración de Campañas en Facebook (pago inicial)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-campana-publicitaria-mensual': { name: "Gestión Mensual de Campañas en Facebook (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-campana-x': { name: "Configuración de Campañas en X (pago inicial)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-campana-x-mensual': { name: "Gestión Mensual de Campañas en X (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-campana-google': { name: "Configuración de Campañas en Google (pago inicial)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-campana-google-mensual': { name: "Gestión Mensual de Campañas en Google (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-campana-tiktok': { name: "Configuración de Campañas en TikTok (pago inicial)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-campana-tiktok-mensual': { name: "Gestión Mensual de Campañas en TikTok (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-administracion-empresarial': { name: "Administración Empresarial (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-contabilidad': { name: "Contabilidad / Bookkeeping (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-nomina': { name: "Servicio de Pago de Nómina (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-impuestos-estatales': { name: "Impuestos Estatales Mensuales (suscripción mensual, 1 mes)", cardPriceUsd: 500, cryptoPriceUsd: 500, stripePaymentLink: null },
  'servicio-taxes-empresa': { name: "Taxes de Empresa (suscripción anual, 1 año)", cardPriceUsd: 1000, cryptoPriceUsd: 1000, stripePaymentLink: null },
  'servicio-redes-sociales': { name: "Redes Sociales: Creación de Contenido y Viralización (suscripción mensual, 1 mes)", cardPriceUsd: 2000, cryptoPriceUsd: 2000, stripePaymentLink: null },
  'servicio-plan-negocios': { name: "Plan de Negocios + Pitch Deck (pago único)", cardPriceUsd: 2000, cryptoPriceUsd: 2000, stripePaymentLink: null },
  'servicio-tokenizacion': { name: "Tokenización Empresarial (pago único)", cardPriceUsd: 5000, cryptoPriceUsd: 5000, stripePaymentLink: null },
  'servicio-mentoria': { name: "Mentoría Empresarial 1 a 1 (pago único)", cardPriceUsd: 10000, cryptoPriceUsd: 10000, stripePaymentLink: null },
  'aplicacion-escuela': {
    name: 'Aplicación a la Escuela (I-20)',
    cardPriceUsd: 100,
    cryptoPriceUsd: 100,
    stripePaymentLink: null,
  },
  ...Object.fromEntries(
    UTAH_SCHOOLS_CATALOG.map((sch) => [
      sch.id,
      {
        name: sch.name,
        cardPriceUsd: sch.price,
        cryptoPriceUsd: sch.price,
        stripePaymentLink: null,
      },
    ])
  ),
  'sevis': {
    name: 'Tarifa SEVIS (I-901)',
    cardPriceUsd: 350,
    cryptoPriceUsd: 350,
    stripePaymentLink: null,
  },
  'entrevista-embajada': {
    name: 'Cita para la Entrevista en la Embajada (MRV)',
    cardPriceUsd: 185,
    cryptoPriceUsd: 185,
    stripePaymentLink: null,
  },
  'curso-estudiante': {
    name: 'Master class express - Visa de Estudiante F-1',
    cardPriceUsd: 99.99,
    cryptoPriceUsd: 99.99,
    stripePaymentLink: null,
  },
  'libro-estudiante': {
    name: 'Libro Digital - Visa de Estudiante F-1',
    cardPriceUsd: 29.99,
    cryptoPriceUsd: 29.99,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVdckP87851w2HxenS0D',
  },
  'curso-turista': {
    name: 'Master class express - Visa de Turista B-2',
    cardPriceUsd: 99.99,
    cryptoPriceUsd: 99.99,
    stripePaymentLink: null,
  },
  'libro-turista': {
    name: 'Libro Digital - Visa de Turista B-2',
    cardPriceUsd: 29.99,
    cryptoPriceUsd: 29.99,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVdckP87851w2HxenS0D',
  },
  'plan-esencial': {
    name: 'Plan 1: Esencial - F-1',
    cardPriceUsd: 380,
    cryptoPriceUsd: 299.99,
    stripePaymentLink: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  },
  'plan-pro': {
    name: 'Plan 2: Pro - F-1',
    cardPriceUsd: 550,
    cryptoPriceUsd: 449.99,
    stripePaymentLink: 'https://buy.stripe.com/fZuaEX1GbcnoeC64PFenS0G',
  },
  'plan-elite': {
    name: 'Plan 3: Elite - F-1',
    cardPriceUsd: 3250,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  },
  'plan-allinclusive': {
    name: 'Plan 4: All-Inclusive - F-1',
    cardPriceUsd: 13000,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
  },
  'plan-turista-basico': {
    name: 'Plan 1: Turista Básico - B-2',
    cardPriceUsd: 380,
    cryptoPriceUsd: 299.99,
    stripePaymentLink: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  },
  'plan-turista-premium': {
    name: 'Plan 2: Turista Premium - B-2',
    cardPriceUsd: 3250,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  },
  'plan-turista-vip': {
    name: 'Plan 3: Experiencia VIP - B-2',
    cardPriceUsd: 13000,
    cryptoPriceUsd: null,
    stripePaymentLink: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
  },
};

export type PaymentMethodKind = 'card' | 'crypto';

export function getProductEntry(itemId: string): ProductCatalogEntry | null {
  const fixed = PRODUCT_CATALOG[itemId];
  if (fixed) return fixed;
  const custom = parseCustomChargeId(itemId);
  if (custom) {
    // Solo con tarjeta: así se puede cobrar de forma recurrente.
    return { name: customChargeName(itemId)!, cardPriceUsd: custom.amountUsd, cryptoPriceUsd: null, stripePaymentLink: null };
  }
  return null;
}

/** ¿Es un producto que se puede poner en el carrito y cobrar? (catálogo fijo o cobro personalizado) */
export function isPurchasableItem(itemId: string): boolean {
  return getProductEntry(itemId) !== null;
}

export function getItemPriceUsd(itemId: string, method: PaymentMethodKind): number {
  const entry = getProductEntry(itemId);
  if (!entry) return 0;
  if (method === 'crypto' && entry.cryptoPriceUsd != null) {
    return entry.cryptoPriceUsd;
  }
  return entry.cardPriceUsd;
}

export function getCartTotalUsd(itemIds: string[], method: PaymentMethodKind): number {
  return itemIds.reduce((sum, id) => sum + getItemPriceUsd(id, method), 0);
}

export function supportsCrypto(itemId: string): boolean {
  const entry = getProductEntry(itemId);
  return entry?.cryptoPriceUsd != null;
}

export function cartSupportsCrypto(itemIds: string[]): boolean {
  return itemIds.length > 0 && itemIds.every(supportsCrypto);
}

/** Legacy map for APIs que leen VISA_PLAN_CATALOG_USD con precio crypto por defecto */
export function buildLegacyCatalogUsd(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const [id, entry] of Object.entries(PRODUCT_CATALOG)) {
    map[id] = entry.cryptoPriceUsd ?? entry.cardPriceUsd;
  }
  return map;
}

export function buildLegacyCardCatalogUsd(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const [id, entry] of Object.entries(PRODUCT_CATALOG)) {
    map[id] = entry.cardPriceUsd;
  }
  return map;
}

/**
 * Parámetros oficiales de comisión por procesamiento con tarjeta en Stripe (3.5% + $0.30 USD internacional).
 * Permite que al pagar con tarjeta, la pasarela añada la comisión de procesamiento y The New Technological Republic reciba el valor neto real del servicio.
 */
export const STRIPE_FEE_PERCENT = 0.035; // 3.5%
export const STRIPE_FEE_FIXED_USD = 0.30; // $0.30 USD

export function calculateStripeProcessingFee(netAmountUsd: number): number {
  if (netAmountUsd <= 0) return 0;
  // Fórmula: Total = (Neto + Fijo) / (1 - Porcentaje) -> Comisión = Total - Neto
  const gross = (netAmountUsd + STRIPE_FEE_FIXED_USD) / (1 - STRIPE_FEE_PERCENT);
  const fee = gross - netAmountUsd;
  return Number(fee.toFixed(2));
}

export function calculateStripeGrossTotal(netAmountUsd: number): number {
  if (netAmountUsd <= 0) return 0;
  const fee = calculateStripeProcessingFee(netAmountUsd);
  return Number((netAmountUsd + fee).toFixed(2));
}

