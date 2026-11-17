/**
 * Cómo se cobra cada producto del carrito: pago único, o suscripción que se renueva sola
 * cada mes o cada año. Lo usan el carrito (avisos) y el servidor (crear las suscripciones en Stripe).
 */
import { PORTAL_SERVICES } from "@/lib/business-services";
import { parseCustomChargeId } from "@/lib/payments/custom-charge";

export type ItemBilling = "unico" | "mensual" | "anual";

const SERVICE_BILLING = new Map(PORTAL_SERVICES.map((s) => [s.id, s.billing]));

export function getItemBilling(itemId: string): ItemBilling {
  return parseCustomChargeId(itemId)?.billing ?? SERVICE_BILLING.get(itemId) ?? "unico";
}

export function isRecurringItem(itemId: string): boolean {
  return getItemBilling(itemId) !== "unico";
}

export function cartHasRecurring(itemIds: string[]): boolean {
  return itemIds.some(isRecurringItem);
}
