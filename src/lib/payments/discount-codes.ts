/**
 * Códigos de descuento de la tienda de servicios. Fuente única para las pantallas
 * (/tienda, carrito y pago del portal) y para el servidor que cobra (Stripe y cripto).
 *
 * El descuento se aplica al pago único o al pago inicial de cada servicio.
 * No se aplica a las suscripciones (mensuales o anuales), ni a las mensualidades,
 * mantenimientos o renovaciones que se cobran después. EXCEPCIÓN: en la sección
 * secciones Web y aplicaciones, Publicidad, Para crecer y Escalada mundial (servicios con `discountAppliesToRecurring`) aplica a todo:
 * pago inicial, pago único, mensualidad y suscripción de mantenimiento. Las mensualidades
 * no las cobra este sitio: el monto con descuento queda registrado en el pago
 * (Stripe / Firestore) para cobrarlas así cada mes.
 */
import { PORTAL_SERVICES } from "@/lib/business-services";

export const DISCOUNT_CODES: Record<string, number> = {
  LUXOR: 0.25,
  OCCIDENT: 0.35,
  EXCELSIOR: 0.5,
};

/** Devuelve el código en mayúsculas si existe; si no, null. */
export function normalizeDiscountCode(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const code = input.trim().toUpperCase();
  return code in DISCOUNT_CODES ? code : null;
}

export function getDiscountPercent(code: string | null | undefined): number {
  const valid = normalizeDiscountCode(code);
  return valid ? DISCOUNT_CODES[valid] : 0;
}

/** Servicios que admiten descuento en lo que se paga hoy: pagos únicos/iniciales y todo lo de Web y aplicaciones, Publicidad, Para crecer y Escalada mundial. */
const ELIGIBLE_IDS = new Set(
  PORTAL_SERVICES.filter((s) => s.billing === "unico" || s.discountAppliesToRecurring).map((s) => s.id),
);

export function isDiscountEligible(itemId: string): boolean {
  return ELIGIBLE_IDS.has(itemId);
}

const roundCents = (n: number) => Math.round(n * 100) / 100;

/** Mensualidad base de cada servicio con descuento en todos los pagos que tiene pagos mensuales. */
const RECURRING_ELIGIBLE = new Map<string, number>(
  PORTAL_SERVICES.filter((s) => s.discountAppliesToRecurring).flatMap((s): [string, number][] => {
    if (s.billing === "mensual") return [[s.id, s.price]];
    return [];
  }),
);

/** ¿El código también baja la mensualidad de este servicio? (solo Web y aplicaciones, Publicidad, Para crecer y Escalada mundial) */
export function discountAppliesToRecurring(itemId: string): boolean {
  return RECURRING_ELIGIBLE.has(itemId);
}

/** Mensualidad de un servicio con el código aplicado, o null si el servicio no tiene mensualidad con descuento. */
export function getDiscountedRecurringUsd(itemId: string, code: string | null | undefined): number | null {
  const base = RECURRING_ELIGIBLE.get(itemId);
  if (base === undefined) return null;
  return roundCents(base * (1 - getDiscountPercent(code)));
}

/** Cuánto se ahorra cada mes en mensualidades con el código. */
export function getMonthlyDiscountUsd(itemIds: string[], code: string | null | undefined): number {
  const percent = getDiscountPercent(code);
  if (!percent) return 0;
  return roundCents(itemIds.reduce((sum, id) => sum + (RECURRING_ELIGIBLE.get(id) ?? 0) * percent, 0));
}

/** Precio de un producto después del código (sin cambios si no aplica). */
export function applyDiscount(itemId: string, priceUsd: number, code: string | null | undefined): number {
  const percent = getDiscountPercent(code);
  if (!percent || !isDiscountEligible(itemId)) return priceUsd;
  return roundCents(priceUsd * (1 - percent));
}

/** Total del descuento de un carrito, dada una función de precio base por producto. */
export function getCartDiscountUsd(
  itemIds: string[],
  getPrice: (itemId: string) => number,
  code: string | null | undefined,
): number {
  return roundCents(
    itemIds.reduce((sum, id) => sum + (getPrice(id) - applyDiscount(id, getPrice(id), code)), 0),
  );
}
