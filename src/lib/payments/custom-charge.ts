/**
 * Cobro personalizado: una tarjeta de la tienda donde se escribe un monto (precios especiales
 * acordados con el cliente que no están en la tabla de precios) y se elige si es pago único,
 * suscripción mensual o suscripción anual.
 *
 * No hay un producto fijo: el monto y el tipo de cobro viajan dentro del id del carrito,
 * p. ej. "cobro-personalizado:mensual:125000" = $1,250.00 cada mes. El servidor vuelve a leer
 * y validar ese id antes de cobrar. No admite códigos de descuento ni pago con cripto.
 */
export type CustomChargeBilling = "unico" | "mensual" | "anual";

export const CUSTOM_CHARGE_PREFIX = "cobro-personalizado";
export const CUSTOM_CHARGE_MIN_USD = 1;
export const CUSTOM_CHARGE_MAX_USD = 1_000_000;

const BILLINGS: CustomChargeBilling[] = ["unico", "mensual", "anual"];
const ID_RX = /^cobro-personalizado:(unico|mensual|anual):(\d{1,9})$/;

export const CUSTOM_CHARGE_BILLING_LABEL: Record<CustomChargeBilling, string> = {
  unico: "Pago único",
  mensual: "Suscripción mensual",
  anual: "Suscripción anual",
};

/** Id del carrito para un cobro personalizado, o null si el monto no es válido. */
export function buildCustomChargeId(billing: CustomChargeBilling, amountUsd: number): string | null {
  if (!BILLINGS.includes(billing) || !Number.isFinite(amountUsd)) return null;
  const cents = Math.round(amountUsd * 100);
  if (cents < CUSTOM_CHARGE_MIN_USD * 100 || cents > CUSTOM_CHARGE_MAX_USD * 100) return null;
  return `${CUSTOM_CHARGE_PREFIX}:${billing}:${cents}`;
}

export function parseCustomChargeId(itemId: string): { billing: CustomChargeBilling; amountUsd: number } | null {
  const m = ID_RX.exec(itemId);
  if (!m) return null;
  const cents = Number(m[2]);
  if (cents < CUSTOM_CHARGE_MIN_USD * 100 || cents > CUSTOM_CHARGE_MAX_USD * 100) return null;
  return { billing: m[1] as CustomChargeBilling, amountUsd: cents / 100 };
}

export function isCustomChargeId(itemId: string): boolean {
  return parseCustomChargeId(itemId) !== null;
}

export function customChargeName(itemId: string): string | null {
  const parsed = parseCustomChargeId(itemId);
  if (!parsed) return null;
  const amount = parsed.amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const period = parsed.billing === "mensual" ? " / mes" : parsed.billing === "anual" ? " / año" : "";
  return `Cobro Personalizado · ${CUSTOM_CHARGE_BILLING_LABEL[parsed.billing]} ($${amount}${period})`;
}
