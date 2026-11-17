import {
  Globe, Settings, Receipt, Palette, TrendingUp, Megaphone, Building2, FileText, Users,
  Landmark, MapPin, Phone, Calculator, BadgeCheck, ShoppingCart, CreditCard, Search,
  Presentation, Coins, GraduationCap, LayoutDashboard, Smartphone, Briefcase, MessageCircle, Wrench,
  ShieldCheck,
} from "lucide-react";

/**
 * Servicios para empresas: fuente única para la tienda pública (/tienda) y la del portal (/portal/tienda).
 * Cada `id` debe existir en PRODUCT_CATALOG (src/lib/payments/product-catalog.ts), que es lo que cobra Stripe.
 *
 * Cómo se cobra cada servicio (`billing`): cada tarjeta tiene UN solo tipo de cobro.
 *  - Pago único ............ billing: "unico"
 *  - Suscripción mensual ... billing: "mensual"  (price = lo que se paga cada mes)
 *  - Suscripción anual ..... billing: "anual"    (price = lo que se paga cada año)
 * Un servicio con pago inicial + mensualidad son DOS tarjetas: la de pago inicial (unico) y la
 * de suscripción (mensual/anual), unidas con `pairedWith`. Así cada suscripción es un producto
 * propio que se puede cobrar de forma recurrente.
 */
export type BillingType = "unico" | "mensual" | "anual";
export type BillingPeriod = "mes" | "año";

export type BusinessService = {
  id: string; // debe existir en PRODUCT_CATALOG (src/lib/payments/product-catalog.ts)
  name: string;
  description: string;
  /** Lo que se paga al comprar (primer pago). */
  price: number;
  /** Precio de referencia en el mercado de EE. UU. (se muestra tachado). Debe ser un precio real comparable. */
  marketPrice: number;
  billing: BillingType;
  /**
   * Tarjeta que va con esta: la suscripción de un pago inicial, o el pago inicial de una suscripción.
   * Se muestra como aviso en la tarjeta; cada una se compra y se cobra por separado.
   */
  pairedWith?: string;
  /** El precio final puede ser mayor según el alcance. */
  fromPrice?: boolean;
  /** Costo adicional que se explica aparte (p. ej. actualizaciones o suscripciones de terceros). */
  extraNote?: string;
  /**
   * El código de descuento aplica a TODOS los pagos del servicio (pago inicial, pago único,
   * mensualidades y suscripciones). Lo pone la sección (`discountAllPayments`): no lo marques a mano.
   */
  discountAppliesToRecurring?: boolean;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  iconColor: string;
  features: string[];
};

export const formatUsd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** " / mes", " / año" o "" según cómo se cobra el precio principal. */
export function pricePeriodSuffix(service: BusinessService): string {
  if (service.billing === "mensual") return " / mes";
  if (service.billing === "anual") return " / año";
  return "";
}

/** Etiqueta del tipo de cobro: "Pago único", "Pago inicial", "Suscripción mensual", "Suscripción anual". */
export function billingLabel(service: BusinessService): string {
  if (service.billing === "mensual") return "Suscripción mensual";
  if (service.billing === "anual") return "Suscripción anual";
  return service.pairedWith ? "Pago inicial" : "Pago único";
}

/** Periodo de una suscripción: "mes", "año" o null si es pago único. */
export function billingPeriod(service: BusinessService): BillingPeriod | null {
  if (service.billing === "mensual") return "mes";
  if (service.billing === "anual") return "año";
  return null;
}

/**
 * Resumen corto para el carrito: "Pago único", "Primer mes · se renueva cada mes"…
 * `discountPercent` (0–1) es el del código aplicado: baja el pago de hoy si es único o inicial,
 * y las mensualidades y suscripciones solo en las secciones Web y aplicaciones, Publicidad, Para crecer y Escalada mundial.
 */
export function billingSummary(service: BusinessService, discountPercent = 0): string {
  const off = (n: number) => Math.round(n * (1 - discountPercent) * 100) / 100;
  const once = service.pairedWith ? "Pago inicial" : "Pago único";
  if (service.billing === "unico" && discountPercent > 0) return `${once} · ${formatUsd(off(service.price))}`;
  if (service.billing === "mensual" && service.discountAppliesToRecurring && discountPercent > 0) {
    return `${formatUsd(off(service.price))} / mes · se renueva cada mes`;
  }
  if (service.billing === "anual" && service.discountAppliesToRecurring && discountPercent > 0) {
    return `${formatUsd(off(service.price))} / año · se renueva cada año`;
  }
  if (service.billing === "mensual") return "Primer mes · se renueva cada mes";
  if (service.billing === "anual") return "Primer año · se renueva cada año";
  return once;
}

const NO_AD_BUDGET = "No incluye el presupuesto de los anuncios: lo define y paga el cliente";

/** Campañas en una plataforma: tarjeta de configuración (pago inicial) + tarjeta de gestión mensual. */
const adCampaign = (id: string, platform: string, iconColor: string, badgeColor: string): BusinessService[] => [
  {
    id,
    name: `Configuración de Campañas en ${platform}`,
    description: `Configuramos tu cuenta publicitaria y tus primeras campañas en ${platform}. Pago inicial. La gestión mensual va en su propia tarjeta. No incluye el presupuesto de los anuncios.`,
    price: 500,
    marketPrice: 1500,
    billing: "unico",
    pairedWith: `${id}-mensual`,
    badge: "Publicidad",
    badgeColor,
    icon: Megaphone,
    iconColor,
    features: [
      "Pago inicial: $500 USD",
      `Configuración de la cuenta publicitaria en ${platform}`,
      "Creación de las primeras campañas",
      NO_AD_BUDGET,
    ],
  },
  {
    id: `${id}-mensual`,
    name: `Gestión Mensual de Campañas en ${platform}`,
    description: `Gestionamos y optimizamos tus campañas en ${platform} cada mes. Suscripción mensual. No incluye el presupuesto de los anuncios.`,
    price: 500,
    marketPrice: 1500,
    billing: "mensual",
    pairedWith: id,
    badge: "Publicidad",
    badgeColor,
    icon: Megaphone,
    iconColor,
    features: [
      "Suscripción mensual: $500 USD / mes",
      `Gestión y optimización de tus campañas en ${platform}`,
      "Reporte de resultados",
      NO_AD_BUDGET,
    ],
  },
];

/** Web y aplicaciones en mensualidades: tarjeta de pago inicial + tarjeta de mensualidad. */
const softwareService = (
  id: string,
  name: string,
  description: string,
  marketPrice: number,
  monthlyMarketPrice: number,
  badge: string,
  icon: React.ElementType,
  features: string[],
  fee = 500, // pago inicial y mensualidad
): BusinessService[] => [
  {
    id,
    name: `${name} · Pago Inicial`,
    description: `${description} Pago inicial; la mensualidad va en su propia tarjeta.`,
    price: fee,
    marketPrice,
    billing: "unico",
    pairedWith: `${id}-mensual`,
    badge,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon,
    iconColor: "bg-blue-50 text-blue-600",
    features: [`Pago inicial: ${formatUsd(fee)} USD`, ...features],
  },
  {
    id: `${id}-mensual`,
    name: `${name} · Mensualidad`,
    description: `La mensualidad de ${name} en mensualidades: desarrollo, mantenimiento y soporte cada mes. Suscripción mensual.`,
    price: fee,
    marketPrice: monthlyMarketPrice,
    billing: "mensual",
    pairedWith: id,
    badge,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Wrench,
    iconColor: "bg-blue-50 text-blue-600",
    features: [`Suscripción mensual: ${formatUsd(fee)} USD / mes`, "Mantenimiento y actualizaciones", "Soporte y cambios"],
  },
];

/** Variante "Pago único" de un servicio de Web y aplicaciones: se paga todo de una vez. */
const oneTimeSoftware = (
  id: string,
  name: string,
  description: string,
  price: number,
  marketPrice: number,
  badge: string,
  icon: React.ElementType,
  features: string[],
): BusinessService => ({
  id,
  name: `${name} · Pago Único`,
  description,
  price,
  marketPrice,
  billing: "unico",
  badge,
  badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  icon,
  iconColor: "bg-emerald-50 text-emerald-600",
  features: [`Pago único: ${formatUsd(price)} USD`, "Sin pagos mensuales por el desarrollo", ...features, "Mantenimiento opcional: $500 USD / mes"],
});

const SERVICES: BusinessService[] = [
  // ── Para arrancar la empresa ──
  {
    id: "servicio-crear-empresa-usa",
    name: "Crear Empresa en EE. UU. + EIN + DUNS",
    description: "Constituimos tu empresa en Estados Unidos, obtenemos su EIN ante el IRS y la registramos en DUNS. Pago inicial de $450 USD; la renovación anual va en su propia tarjeta. No incluye el pago al estado por crearla.",
    price: 450,
    marketPrice: 700,
    billing: "unico",
    pairedWith: "servicio-renovacion-empresa",
    badge: "Empresa USA",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Building2,
    iconColor: "bg-indigo-50 text-indigo-600",
    features: [
      "Pago inicial: $450 USD",
      "Constitución de la empresa",
      "EIN (Número de Identificación Fiscal)",
      "Registro en DUNS",
      "No incluye la tarifa del estado",
    ],
  },
  {
    id: "servicio-renovacion-empresa",
    name: "Renovación Anual de Empresa",
    description: "Renovamos cada año el registro de tu empresa en Estados Unidos, desde el segundo año. Suscripción anual. No incluye la tarifa del estado.",
    price: 50,
    marketPrice: 150,
    billing: "anual",
    pairedWith: "servicio-crear-empresa-usa",
    badge: "Empresa USA",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Building2,
    iconColor: "bg-indigo-50 text-indigo-600",
    features: ["Suscripción anual: $50 USD / año", "Desde el segundo año de tu empresa", "Renovación del registro de la empresa", "No incluye la tarifa del estado"],
  },
  {
    id: "servicio-agente-registrado",
    name: "Agente Registrado y Dirección Comercial",
    description: "Agente registrado y dirección comercial en Estados Unidos para tu empresa. Suscripción anual.",
    price: 400,
    marketPrice: 700,
    billing: "anual",
    badge: "Empresa USA",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: MapPin,
    iconColor: "bg-indigo-50 text-indigo-600",
    features: ["Suscripción anual: $400 USD / año", "Agente registrado", "Dirección comercial en EE. UU.", "Recepción de documentos oficiales"],
  },
  {
    id: "servicio-cuenta-bancaria",
    name: "Cuenta Bancaria Empresarial en EE. UU.",
    description: "Te acompañamos en la apertura de la cuenta bancaria de tu empresa. Un solo pago por cada cuenta bancaria. La aprobación final depende del banco.",
    price: 200,
    marketPrice: 500,
    billing: "unico",
    badge: "Empresa USA",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Landmark,
    iconColor: "bg-indigo-50 text-indigo-600",
    features: ["Pago único: $200 USD por cuenta bancaria", "Preparación de documentos", "Acompañamiento en la solicitud", "No incluye el depósito inicial"],
  },
  {
    id: "servicio-telefono-whatsapp",
    name: "Teléfono Comercial de EE. UU. + WhatsApp Business",
    description: "Número de teléfono comercial de Estados Unidos configurado con WhatsApp Business, con el plan telefónico incluido. Suscripción mensual.",
    price: 100,
    marketPrice: 150,
    billing: "mensual",
    badge: "Comunicación",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Phone,
    iconColor: "bg-sky-50 text-sky-600",
    features: ["Suscripción mensual: $100 USD / mes", "Número de EE. UU.", "WhatsApp Business configurado", "Plan telefónico incluido"],
  },
  {
    id: "servicio-identidad-visual",
    name: "Identidad Visual: Logo + Manual de Marca",
    description: "Tu logo y tu manual de marca (colores, tipografías y uso del logo) para que tu negocio se vea profesional. Cada actualización posterior del manual cuesta $50 USD.",
    price: 1000,
    marketPrice: 3000,
    billing: "unico",
    extraNote: "Cada actualización del manual: $50 USD",
    badge: "Marca",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    icon: Palette,
    iconColor: "bg-pink-50 text-pink-600",
    features: ["Pago único: $1,000 USD", "Diseño de logo", "Manual de marca: colores, tipografías y uso del logo", "Cada actualización del manual: $50 USD"],
  },
  {
    id: "servicio-registro-marca",
    name: "Registro de Marca (Trademark)",
    description: "Protegemos tu marca ante la USPTO. No incluye la tasa oficial (aprox. $350 por clase).",
    price: 500,
    marketPrice: 1000,
    billing: "unico",
    badge: "Marca",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    icon: BadgeCheck,
    iconColor: "bg-pink-50 text-pink-600",
    features: ["Pago único: $500 USD", "Búsqueda de disponibilidad", "Solicitud ante la USPTO", "No incluye la tasa oficial"],
  },
  {
    id: "servicio-impuestos-personales",
    name: "Impuestos Personales",
    description: "Preparación y presentación de tu declaración anual de impuestos personal. Suscripción anual.",
    price: 200,
    marketPrice: 250,
    billing: "anual",
    badge: "Impuestos",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: FileText,
    iconColor: "bg-amber-50 text-amber-600",
    features: ["Suscripción anual: $200 USD / año", "Declaración personal", "Revisión de documentos", "Presentación de la declaración"],
  },

  // ── Para vender ──
  {
    id: "servicio-meta-business",
    name: "Configuración de Meta Business Suite",
    description: "Configuramos tu Meta Business Suite para administrar Facebook e Instagram de tu negocio. Pago inicial; el mantenimiento mensual va en su propia tarjeta.",
    price: 500,
    marketPrice: 800,
    billing: "unico",
    pairedWith: "servicio-meta-business-mensual",
    badge: "Meta",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Settings,
    iconColor: "bg-sky-50 text-sky-600",
    features: ["Pago inicial: $500 USD", "Cuenta comercial de Meta", "Conexión de Facebook e Instagram", "Configuración de accesos"],
  },
  {
    id: "servicio-meta-business-mensual",
    name: "Mantenimiento de Meta Business Suite",
    description: "Mantenemos al día tu Meta Business Suite cada mes: accesos, conexiones y ajustes. Suscripción mensual.",
    price: 20,
    marketPrice: 50,
    billing: "mensual",
    pairedWith: "servicio-meta-business",
    badge: "Meta",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Settings,
    iconColor: "bg-sky-50 text-sky-600",
    features: ["Suscripción mensual: $20 USD / mes", "Revisión de accesos y conexiones", "Ajustes de la cuenta"],
  },
  {
    id: "servicio-pasarela-pagos",
    name: "Instalación de Pasarela de Pagos",
    description: "Instalamos Stripe, PayPal y cobros con stablecoins para que recibas pagos. Pago inicial; el mantenimiento mensual va en su propia tarjeta. No incluye las comisiones de cada pasarela.",
    price: 500,
    marketPrice: 1000,
    billing: "unico",
    pairedWith: "servicio-pasarela-pagos-mensual",
    badge: "Ventas",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CreditCard,
    iconColor: "bg-blue-50 text-blue-600",
    features: ["Pago inicial: $500 USD", "Stripe y PayPal", "Cobros con stablecoins", "No incluye comisiones"],
  },
  {
    id: "servicio-pasarela-pagos-mensual",
    name: "Mantenimiento de Pasarela de Pagos",
    description: "Mantenemos funcionando tus cobros con Stripe, PayPal y stablecoins cada mes. Suscripción mensual. No incluye las comisiones de cada pasarela.",
    price: 20,
    marketPrice: 50,
    billing: "mensual",
    pairedWith: "servicio-pasarela-pagos",
    badge: "Ventas",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CreditCard,
    iconColor: "bg-blue-50 text-blue-600",
    features: ["Suscripción mensual: $20 USD / mes", "Revisión de tus cobros", "Soporte de la pasarela", "No incluye comisiones"],
  },
  {
    id: "servicio-seo-local",
    name: "Google Business Profile + Search Console + Analytics + SEO",
    description: "Configuramos Google Business Profile, Google Search Console y Google Analytics, y posicionamos tu negocio en Google (SEO). Pago inicial; el mantenimiento mensual va en su propia tarjeta.",
    price: 500,
    marketPrice: 1200,
    billing: "unico",
    pairedWith: "servicio-seo-local-mensual",
    badge: "Google",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Search,
    iconColor: "bg-emerald-50 text-emerald-600",
    features: ["Pago inicial: $500 USD", "Google Business Profile", "Google Search Console", "Google Analytics", "SEO"],
  },
  {
    id: "servicio-seo-local-mensual",
    name: "Mantenimiento de Google Business + SEO",
    description: "Mantenemos al día tu Google Business Profile, Search Console, Analytics y SEO cada mes. Suscripción mensual.",
    price: 20,
    marketPrice: 100,
    billing: "mensual",
    pairedWith: "servicio-seo-local",
    badge: "Google",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Search,
    iconColor: "bg-emerald-50 text-emerald-600",
    features: ["Suscripción mensual: $20 USD / mes", "Actualización de tu perfil de Google", "Revisión de Search Console y Analytics", "Ajustes de SEO"],
  },

  {
    id: "servicio-automatizacion-whatsapp",
    name: "Automatización de Respuestas para WhatsApp, Instagram, Messenger y Comentarios",
    description: "Configuramos respuestas automáticas en WhatsApp, Instagram, Messenger y en los comentarios de tus publicaciones para atender a tus clientes al instante.",
    price: 500,
    marketPrice: 1500,
    billing: "unico",
    badge: "Automatización",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: MessageCircle,
    iconColor: "bg-emerald-50 text-emerald-600",
    features: ["Pago único: $500 USD", "Respuestas automáticas en WhatsApp", "Respuestas automáticas en Instagram (mensajes directos)", "Respuestas automáticas en Facebook Messenger", "Respuestas automáticas a comentarios en Facebook e Instagram", "Mensajes de bienvenida y preguntas frecuentes", "Configurado con la información de tu negocio"],
  },

  // ── Web y aplicaciones ──
  ...softwareService(
    "servicio-diseno-web",
    "Diseño Web",
    "Tu sitio web profesional para presentar tu negocio y vender en línea.",
    2500,
    1000,
    "Sitio Web",
    Globe,
    ["Diseño a la medida de tu marca", "Adaptado a celulares"],
  ),
  ...softwareService(
    "servicio-plataforma-web",
    "Plataforma Web",
    "Una plataforma web a la medida de tu negocio: usuarios, paneles y procesos en línea.",
    5000,
    2000,
    "Plataforma",
    LayoutDashboard,
    ["Plataforma a la medida", "Acceso con usuarios", "Funciona en computadora y celular"],
    1000,
  ),
  ...softwareService(
    "servicio-app-ios",
    "App iOS",
    "Tu aplicación para iPhone y iPad, publicada en la App Store.",
    8000,
    1000,
    "iOS",
    Smartphone,
    ["App para iPhone y iPad", "Publicación en la App Store", "No incluye la cuenta de desarrollador de Apple"],
  ),
  ...softwareService(
    "servicio-app-android",
    "App Android",
    "Tu aplicación para celulares Android, publicada en Google Play.",
    8000,
    1000,
    "Android",
    Smartphone,
    ["App para Android", "Publicación en Google Play", "No incluye la cuenta de desarrollador de Google Play"],
  ),
  ...softwareService(
    "servicio-tienda-online",
    "Tienda en Línea (E-commerce)",
    "Tu tienda en línea con Shopify o WooCommerce, lista para vender. No incluye el plan de la plataforma ni el dominio.",
    4000,
    2000,
    "Ventas",
    ShoppingCart,
    ["Shopify o WooCommerce", "Catálogo de productos", "No incluye plan ni dominio"],
    1000,
  ),

  oneTimeSoftware(
    "servicio-diseno-web-unico",
    "Diseño Web",
    "Tu sitio web profesional pagado de una sola vez, sin mensualidades por el desarrollo. El mantenimiento mensual es opcional.",
    6000,
    10000,
    "Sitio Web",
    Globe,
    ["Diseño a la medida de tu marca", "Adaptado a celulares"],
  ),
  oneTimeSoftware(
    "servicio-plataforma-web-unico",
    "Plataforma Web",
    "Tu plataforma web a la medida pagada de una sola vez, sin mensualidades por el desarrollo. El mantenimiento mensual es opcional.",
    12000,
    20000,
    "Plataforma",
    LayoutDashboard,
    ["Plataforma a la medida", "Acceso con usuarios", "Funciona en computadora y celular"],
  ),
  oneTimeSoftware(
    "servicio-app-ios-unico",
    "App iOS",
    "Tu app para iPhone y iPad pagada de una sola vez, sin mensualidades por el desarrollo. El mantenimiento mensual es opcional.",
    6000,
    15000,
    "iOS",
    Smartphone,
    ["App para iPhone y iPad", "Publicación en la App Store", "No incluye la cuenta de desarrollador de Apple"],
  ),
  oneTimeSoftware(
    "servicio-app-android-unico",
    "App Android",
    "Tu app para Android pagada de una sola vez, sin mensualidades por el desarrollo. El mantenimiento mensual es opcional.",
    6000,
    15000,
    "Android",
    Smartphone,
    ["App para Android", "Publicación en Google Play", "No incluye la cuenta de desarrollador de Google Play"],
  ),
  oneTimeSoftware(
    "servicio-tienda-online-unico",
    "Tienda en Línea (E-commerce)",
    "Tu tienda en línea pagada de una sola vez, sin mensualidades por el desarrollo. El mantenimiento mensual es opcional. No incluye el plan de la plataforma ni el dominio.",
    12000,
    15000,
    "Ventas",
    ShoppingCart,
    ["Shopify o WooCommerce", "Catálogo de productos", "No incluye plan ni dominio"],
  ),
  {
    id: "servicio-mantenimiento-web-apps",
    name: "Mantenimiento de Web y Apps",
    description: "Mantenimiento mensual de tu sitio web, plataforma, tienda en línea o app: actualizaciones, soporte y cambios. Suscripción mensual.",
    price: 500,
    marketPrice: 1000,
    billing: "mensual",
    badge: "Soporte",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Wrench,
    iconColor: "bg-blue-50 text-blue-600",
    features: ["Suscripción mensual: $500 USD / mes", "Actualizaciones y seguridad", "Soporte y cambios", "Para webs, plataformas, tiendas y apps"],
  },
  {
    id: "servicio-kyc-instalacion",
    name: "Instalación de KYC (Verificación de Identidad)",
    description: "Instalamos la verificación de identidad (KYC) de tus clientes en tu web, plataforma o app. Pago inicial; la suscripción mensual va en su propia tarjeta.",
    price: 1000,
    marketPrice: 3000,
    billing: "unico",
    pairedWith: "servicio-kyc-mensual",
    badge: "KYC",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: ShieldCheck,
    iconColor: "bg-indigo-50 text-indigo-600",
    features: ["Pago inicial: $1,000 USD", "Verificación de identidad de tus clientes", "Integración en tu web, plataforma o app", "Configuración del flujo de verificación"],
  },
  {
    id: "servicio-kyc-mensual",
    name: "Suscripción de KYC",
    description: "Mantenemos funcionando la verificación de identidad (KYC) de tus clientes cada mes. Suscripción mensual.",
    price: 50,
    marketPrice: 150,
    billing: "mensual",
    pairedWith: "servicio-kyc-instalacion",
    badge: "KYC",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: ShieldCheck,
    iconColor: "bg-indigo-50 text-indigo-600",
    features: ["Suscripción mensual: $50 USD / mes", "Mantenimiento del KYC", "Soporte y ajustes"],
  },

  // ── Publicidad ──
  ...adCampaign("servicio-campana-publicitaria", "Facebook", "bg-blue-50 text-blue-600", "bg-blue-50 text-blue-700 border-blue-200"),
  ...adCampaign("servicio-campana-x", "X", "bg-slate-100 text-slate-700", "bg-slate-100 text-slate-700 border-slate-200"),
  ...adCampaign("servicio-campana-google", "Google", "bg-emerald-50 text-emerald-600", "bg-emerald-50 text-emerald-700 border-emerald-200"),
  ...adCampaign("servicio-campana-tiktok", "TikTok", "bg-pink-50 text-pink-600", "bg-pink-50 text-pink-700 border-pink-200"),

  // ── Para crecer ──
  {
    id: "servicio-administracion-empresarial",
    name: "Administración Empresarial",
    description: "Administramos tu empresa cada mes. Suscripción mensual de $500 USD, más la suscripción a Roosevelt Super Intelligence según el plan que elijas.",
    price: 500,
    marketPrice: 1500,
    billing: "mensual",
    extraNote: "+ suscripción a Roosevelt Super Intelligence según el plan que elijas",
    badge: "Gestión",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Briefcase,
    iconColor: "bg-violet-50 text-violet-600",
    features: [
      "Suscripción mensual: $500 USD / mes",
      "Administración mensual de tu empresa",
      "Roosevelt Super Intelligence: suscripción adicional según el plan que elijas",
    ],
  },
  {
    id: "servicio-contabilidad",
    name: "Contabilidad / Bookkeeping",
    description: "Llevamos la contabilidad de tu empresa cada mes, lista para tus impuestos. Suscripción mensual.",
    price: 500,
    marketPrice: 1000,
    billing: "mensual",
    badge: "Finanzas",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Calculator,
    iconColor: "bg-amber-50 text-amber-600",
    features: ["Suscripción mensual: $500 USD / mes", "Registro de ingresos y gastos", "Conciliación bancaria", "Reportes mensuales"],
  },
  {
    id: "servicio-nomina",
    name: "Servicio de Pago de Nómina",
    description: "Gestionamos el pago de nómina de tu empresa cada mes. Suscripción mensual.",
    price: 500,
    marketPrice: 1000,
    billing: "mensual",
    badge: "Finanzas",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    icon: Users,
    iconColor: "bg-teal-50 text-teal-600",
    features: ["Suscripción mensual: $500 USD / mes", "Cálculo y pago de nómina", "Pago a empleados según tu planilla"],
  },
  {
    id: "servicio-impuestos-estatales",
    name: "Impuestos Estatales Mensuales",
    description: "Preparamos y presentamos cada mes las declaraciones de impuestos estatales de tu empresa. Suscripción mensual.",
    price: 500,
    marketPrice: 1000,
    billing: "mensual",
    badge: "Impuestos",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Landmark,
    iconColor: "bg-amber-50 text-amber-600",
    features: ["Suscripción mensual: $500 USD / mes", "Declaración estatal cada mes", "Cálculo de los impuestos a pagar", "No incluye el pago de los impuestos"],
  },
  {
    id: "servicio-taxes-empresa",
    name: "Taxes de Empresa",
    description: "Preparación y presentación de la declaración anual de impuestos de tu empresa. Suscripción anual.",
    price: 1000,
    marketPrice: 2500,
    billing: "anual",
    badge: "Impuestos",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Receipt,
    iconColor: "bg-amber-50 text-amber-600",
    features: ["Suscripción anual: $1,000 USD / año", "Declaración anual de impuestos de la empresa", "Revisión de facturas y documentos", "Presentación ante el IRS"],
  },

  // ── Escalada mundial ──
  {
    id: "servicio-redes-sociales",
    name: "Redes Sociales: Creación de Contenido y Viralización",
    description: "Creamos el contenido de tus redes sociales y lo hacemos viral con una estrategia pensada para vender. Suscripción mensual.",
    price: 2000,
    marketPrice: 5000,
    billing: "mensual",
    badge: "Redes",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: TrendingUp,
    iconColor: "bg-emerald-50 text-emerald-600",
    features: ["Suscripción mensual: $2,000 USD / mes", "Creación de contenido", "Estrategia de viralización", "Contenido enfocado en ventas"],
  },
  {
    id: "servicio-plan-negocios",
    name: "Plan de Negocios + Pitch Deck",
    description: "Un plan de negocios completo y bien hecho, junto con la presentación para inversionistas.",
    price: 2000,
    marketPrice: 5000,
    billing: "unico",
    badge: "Inversión",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Presentation,
    iconColor: "bg-violet-50 text-violet-600",
    features: ["Pago único: $2,000 USD", "Plan de negocios completo", "Pitch deck", "Preparación para inversionistas"],
  },
  {
    id: "servicio-tokenizacion",
    name: "Tokenización Empresarial",
    description: "Creamos el token de tu empresa o proyecto. Incluye llamada de diagnóstico; no incluye asesoría legal ni auditoría del contrato.",
    price: 5000,
    marketPrice: 15000,
    billing: "unico",
    badge: "Inversión",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    icon: Coins,
    iconColor: "bg-violet-50 text-violet-600",
    features: ["Pago único: $5,000 USD", "Llamada de diagnóstico", "Creación del token", "No incluye asesoría legal ni auditoría"],
  },
  {
    id: "servicio-mentoria",
    name: "Mentoría Empresarial 1 a 1",
    description: "Acompañamiento personalizado 1 a 1 para crear y hacer crecer tu empresa.",
    price: 10000,
    marketPrice: 20000,
    billing: "unico",
    badge: "Mentoría",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: GraduationCap,
    iconColor: "bg-amber-50 text-amber-600",
    features: ["Pago único: $10,000 USD", "Sesiones 1 a 1", "Plan de acción para tu empresa", "Seguimiento personalizado"],
  },
];

/** Tienda (pública y del portal): todos los servicios, del más barato al más caro. */
export const PORTAL_SERVICES = [...SERVICES].sort((a, b) => a.price - b.price);

/** Alias histórico: hoy la tienda pública y la del portal muestran lo mismo. */
export const BUSINESS_SERVICES = PORTAL_SERVICES;

/** Secciones de la tienda. Dentro de cada sección se ordena del más barato al más caro. */
const PORTAL_SECTION_DEFINITIONS: {
  title: string;
  subtitle: string;
  ids: string[];
  keepOrder?: boolean;
  /** El código de descuento aplica a todos los pagos de la sección, también a mensualidades y suscripciones. */
  discountAllPayments?: boolean;
  /** Igual que `discountAllPayments`, pero solo para estos servicios de la sección. */
  discountAllPaymentsFor?: string[];
}[] = [
  {
    title: "Para arrancar la empresa",
    discountAllPaymentsFor: [
      "servicio-telefono-whatsapp",
      "servicio-impuestos-personales",
      "servicio-agente-registrado",
    ],
    subtitle: "Todo lo legal, fiscal y de marca para que tu empresa exista en Estados Unidos.",
    // Del más barato al más caro, con cada pago inicial junto a su suscripción.
    keepOrder: true,
    ids: [
      "servicio-telefono-whatsapp",
      "servicio-cuenta-bancaria",
      "servicio-impuestos-personales",
      "servicio-agente-registrado",
      "servicio-crear-empresa-usa",
      "servicio-renovacion-empresa",
      "servicio-registro-marca",
      "servicio-identidad-visual",
    ],
  },
  {
    title: "Para vender",
    subtitle: "Presencia digital y herramientas para atraer clientes y cobrar.",
    keepOrder: true,
    ids: [
      "servicio-meta-business",
      "servicio-meta-business-mensual",
      "servicio-pasarela-pagos",
      "servicio-pasarela-pagos-mensual",
      "servicio-seo-local",
      "servicio-seo-local-mensual",
      "servicio-automatizacion-whatsapp",
    ],
  },
  {
    title: "Web y aplicaciones",
    subtitle: "Págalo en mensualidades o de una sola vez. Aquí tu código de descuento aplica al pago inicial y también a las mensualidades.",
    // Primero los pagos únicos (pago completo), después las mismas opciones en mensualidades
    // (pago inicial junto a su mensualidad), el mantenimiento y el KYC al final.
    keepOrder: true,
    discountAllPayments: true,
    ids: [
      "servicio-diseno-web-unico",
      "servicio-app-ios-unico",
      "servicio-app-android-unico",
      "servicio-plataforma-web-unico",
      "servicio-tienda-online-unico",
      "servicio-diseno-web",
      "servicio-diseno-web-mensual",
      "servicio-app-ios",
      "servicio-app-ios-mensual",
      "servicio-app-android",
      "servicio-app-android-mensual",
      "servicio-plataforma-web",
      "servicio-plataforma-web-mensual",
      "servicio-tienda-online",
      "servicio-tienda-online-mensual",
      "servicio-mantenimiento-web-apps",
      "servicio-kyc-instalacion",
      "servicio-kyc-mensual",
    ],
  },
  {
    title: "Publicidad",
    discountAllPayments: true,
    subtitle: "Campañas en cada plataforma. El presupuesto de los anuncios lo define y paga el cliente.",
    keepOrder: true,
    ids: [
      "servicio-campana-publicitaria",
      "servicio-campana-publicitaria-mensual",
      "servicio-campana-x",
      "servicio-campana-x-mensual",
      "servicio-campana-google",
      "servicio-campana-google-mensual",
      "servicio-campana-tiktok",
      "servicio-campana-tiktok-mensual",
    ],
  },
  {
    title: "Para crecer",
    discountAllPayments: true,
    subtitle: "Organiza tu administración, tus finanzas y tu equipo a medida que tu empresa crece.",
    ids: [
      "servicio-administracion-empresarial",
      "servicio-contabilidad",
      "servicio-nomina",
      "servicio-impuestos-estatales",
      "servicio-taxes-empresa",
    ],
  },
  {
    title: "Escalada mundial",
    discountAllPayments: true,
    subtitle: "Lleva tu empresa al siguiente nivel: redes, inversionistas, tokenización y mentoría.",
    ids: [
      "servicio-redes-sociales",
      "servicio-plan-negocios",
      "servicio-tokenizacion",
      "servicio-mentoria",
    ],
  },
];

// Secciones con descuento en todos los pagos: se marca cada uno de sus servicios.
for (const section of PORTAL_SECTION_DEFINITIONS) {
  const ids = section.discountAllPayments ? section.ids : section.discountAllPaymentsFor ?? [];
  for (const service of PORTAL_SERVICES) {
    if (ids.includes(service.id)) service.discountAppliesToRecurring = true;
  }
}

export const PORTAL_SERVICE_SECTIONS = PORTAL_SECTION_DEFINITIONS.map((section) => ({
  title: section.title,
  subtitle: section.subtitle,
  services: section.keepOrder
    ? section.ids.flatMap((id) => PORTAL_SERVICES.filter((service) => service.id === id))
    : PORTAL_SERVICES.filter((service) => section.ids.includes(service.id)),
}));
