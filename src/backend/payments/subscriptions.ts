import type Stripe from 'stripe';
import { getStripeClient } from '@/backend/payments/stripe';
import { getItemBilling } from '@/lib/payments/billing';
import { applyDiscount } from '@/lib/payments/discount-codes';
import { calculateStripeProcessingFee, getItemPriceUsd, getProductEntry } from '@/lib/payments/product-catalog';
import { isCustomChargeId } from '@/lib/payments/custom-charge';

/**
 * Suscripciones automáticas de la tienda.
 *
 * En el pago del carrito (Checkout, modo `payment`) se cobra HOY todo: pagos únicos, pagos iniciales
 * y el primer mes / primer año de cada suscripción, y la tarjeta queda guardada en el cliente de Stripe.
 * Al confirmarse ese pago (webhook `checkout.session.completed`) se crea una suscripción de Stripe por
 * periodo (una mensual y otra anual si hace falta) con la misma tarjeta. Su primer cobro automático es
 * justo un mes / un año después de la compra, y luego se renueva sola cada periodo.
 *
 * Cada suscripción cobra lo mismo que se pagó hoy por esos productos (con el código de descuento si
 * aplicaba) más la comisión de procesamiento de Stripe, igual que en el carrito.
 */

type Interval = 'month' | 'year';

export type RecurringLine = { itemId: string; name: string; unitUsd: number; quantity: number };
export type RecurringPlan = { interval: Interval; lines: RecurringLine[]; netUsd: number; feeUsd: number };

const round = (n: number) => Math.round(n * 100) / 100;

/** Qué suscripciones salen de un carrito: una por periodo (mes / año). */
export function buildRecurringPlans(itemIds: string[], discountCode: string | null): RecurringPlan[] {
  const counts = new Map<string, number>();
  for (const id of itemIds) {
    if (getProductEntry(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const plans: RecurringPlan[] = [];
  for (const interval of ['month', 'year'] as Interval[]) {
    const billing = interval === 'month' ? 'mensual' : 'anual';
    const lines: RecurringLine[] = [];
    for (const [itemId, quantity] of counts) {
      if (getItemBilling(itemId) !== billing) continue;
      const base = getItemPriceUsd(itemId, 'card');
      lines.push({
        itemId,
        name: getProductEntry(itemId)!.name,
        unitUsd: applyDiscount(itemId, base, discountCode),
        quantity,
      });
    }
    if (!lines.length) continue;
    const netUsd = round(lines.reduce((sum, l) => sum + l.unitUsd * l.quantity, 0));
    plans.push({ interval, lines, netUsd, feeUsd: calculateStripeProcessingFee(netUsd) });
  }
  return plans;
}

/** Producto de Stripe con id fijo por servicio (se crea la primera vez que se necesita). */
async function ensureProduct(stripe: Stripe, productId: string, name: string): Promise<string> {
  try {
    const existing = await stripe.products.retrieve(productId);
    if (!existing.active) await stripe.products.update(productId, { active: true });
    return existing.id;
  } catch (error: unknown) {
    if ((error as { code?: string }).code !== 'resource_missing') throw error;
    try {
      return (await stripe.products.create({ id: productId, name })).id;
    } catch (createError: unknown) {
      // Otra petición lo creó al mismo tiempo.
      if ((createError as { code?: string }).code === 'resource_already_exists') return productId;
      throw createError;
    }
  }
}

function productIdFor(itemId: string): { id: string; name: string } {
  if (isCustomChargeId(itemId)) return { id: 'tntr-cobro-personalizado', name: 'Cobro Personalizado' };
  return { id: `tntr-${itemId}`.slice(0, 200), name: getProductEntry(itemId)?.name ?? itemId };
}

/** Fecha (segundos Unix) del primer cobro automático: un mes o un año después de la compra. */
export function firstRenewalAt(purchasedAtSec: number, interval: Interval): number {
  const d = new Date(purchasedAtSec * 1000);
  if (interval === 'month') {
    const day = d.getUTCDate();
    d.setUTCMonth(d.getUTCMonth() + 1);
    // 31 de enero → 28/29 de febrero, no 3 de marzo.
    if (d.getUTCDate() !== day) d.setUTCDate(0);
  } else {
    const month = d.getUTCMonth();
    d.setUTCFullYear(d.getUTCFullYear() + 1);
    // 29 de febrero → 28 de febrero del año siguiente.
    if (d.getUTCMonth() !== month) d.setUTCDate(0);
  }
  return Math.floor(d.getTime() / 1000);
}

/**
 * Crea las suscripciones de un pago del carrito ya cobrado. Se puede llamar varias veces con la
 * misma sesión (reintentos del webhook): si ya existen, no las duplica.
 */
export async function createSubscriptionsForCheckoutSession(session: Stripe.Checkout.Session): Promise<string[]> {
  const stripe = getStripeClient();
  if (!stripe) return [];
  if (session.mode !== 'payment' || session.payment_status !== 'paid') return [];
  if (session.metadata?.subscriptions !== '1') return [];

  const itemIds = (session.metadata?.item_ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  const discountCode = session.metadata?.discount_code || null;
  const plans = buildRecurringPlans(itemIds, discountCode);
  if (!plans.length) return [];

  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  if (!customerId || !paymentIntentId) {
    throw new Error(`Sesión ${session.id}: falta el cliente o el pago para crear las suscripciones`);
  }
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const paymentMethodId =
    typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.id;
  if (!paymentMethodId) throw new Error(`Sesión ${session.id}: el pago no tiene tarjeta guardada`);

  // La tarjeta con la que pagó queda como la tarjeta de cobro del cliente.
  await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });

  const existing = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
  const created: string[] = [];
  for (const plan of plans) {
    const already = existing.data.find(
      (sub) => sub.metadata?.checkout_session === session.id && sub.metadata?.interval === plan.interval,
    );
    if (already) {
      created.push(already.id);
      continue;
    }

    const items: Stripe.SubscriptionCreateParams.Item[] = [];
    for (const line of plan.lines) {
      const product = productIdFor(line.itemId);
      items.push({
        quantity: line.quantity,
        price_data: {
          currency: 'usd',
          product: await ensureProduct(stripe, product.id, product.name),
          unit_amount: Math.round(line.unitUsd * 100),
          recurring: { interval: plan.interval },
        },
        metadata: { item_id: line.itemId },
      });
    }
    if (plan.feeUsd > 0) {
      items.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          product: await ensureProduct(stripe, 'tntr-comision-stripe', 'Comisión de Procesamiento y Pasarela (Stripe)'),
          unit_amount: Math.round(plan.feeUsd * 100),
          recurring: { interval: plan.interval },
        },
      });
    }

    const subscription = await stripe.subscriptions.create(
      {
        customer: customerId,
        items,
        default_payment_method: paymentMethodId,
        // El primer periodo ya se pagó hoy en el carrito: el primer cobro automático es al cumplirse el periodo.
        trial_end: firstRenewalAt(session.created, plan.interval),
        trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
        description: plan.lines.map((l) => (l.quantity > 1 ? `${l.name} ×${l.quantity}` : l.name)).join(' + ').slice(0, 500),
        metadata: {
          checkout_session: session.id,
          interval: plan.interval,
          user_id: session.metadata?.user_id || '',
          item_ids: plan.lines.map((l) => l.itemId).join(',').slice(0, 500),
          discount_code: discountCode || '',
          net_usd: String(plan.netUsd),
          processing_fee_usd: String(plan.feeUsd),
        },
      },
      { idempotencyKey: `tntr-sub-${session.id}-${plan.interval}` },
    );
    created.push(subscription.id);
  }
  return created;
}
