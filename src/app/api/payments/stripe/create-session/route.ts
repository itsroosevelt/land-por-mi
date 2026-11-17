import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import {
  calculateStripeGrossTotal,
  calculateStripeProcessingFee,
  getItemPriceUsd,
  getProductEntry,
  isPurchasableItem,
} from '@/lib/payments/product-catalog';
import { getItemBilling } from '@/lib/payments/billing';
import { buildRecurringPlans } from '@/backend/payments/subscriptions';
import { PORTAL_STRIPE_SUCCESS_URL } from '@/lib/payments/stripe-links';
import {
  applyDiscount,
  getCartDiscountUsd,
  getMonthlyDiscountUsd,
  getDiscountPercent,
  normalizeDiscountCode,
} from '@/lib/payments/discount-codes';

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no está configurado. Agrega STRIPE_SECRET_KEY en el servidor.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    const itemIds = Array.isArray(body.itemIds)
      ? body.itemIds.filter((id: unknown): id is string => typeof id === 'string')
      : [];
    const customSuccessUrl =
      typeof body.successUrl === 'string' && body.successUrl.includes('://')
        ? body.successUrl
        : null;
    const customCancelUrl =
      typeof body.cancelUrl === 'string' && body.cancelUrl.includes('://')
        ? body.cancelUrl
        : null;

    const counts: Record<string, number> = {};
    for (const id of itemIds) {
      if (isPurchasableItem(id)) {
        counts[id] = (counts[id] || 0) + 1;
      }
    }
    const uniqueItemIds = Object.keys(counts);

    if (uniqueItemIds.length === 0) {
      return NextResponse.json({ error: 'El carrito no tiene productos válidos' }, { status: 400 });
    }

    const allValidItems = itemIds.filter(isPurchasableItem);
    // Código de descuento: solo baja el pago único / pago inicial de los servicios (ver discount-codes.ts).
    const discountCode = normalizeDiscountCode(body.discountCode);
    const discountPercent = getDiscountPercent(discountCode);
    const basePrice = (itemId: string) => getItemPriceUsd(itemId, 'card');
    const unitPrice = (itemId: string) => applyDiscount(itemId, basePrice(itemId), discountCode);
    const discountUsd = getCartDiscountUsd(allValidItems, basePrice, discountCode);
    const subtotalUsd = Math.round(allValidItems.reduce((sum, id) => sum + unitPrice(id), 0) * 100) / 100;
    // En las secciones con descuento en todos los pagos, el código también baja la mensualidad (se cobra aparte cada mes).
    const monthlyDiscountUsd = getMonthlyDiscountUsd(allValidItems, discountCode);
    // Suscripciones: hoy se cobra el primer mes / año, la tarjeta queda guardada y el webhook
    // crea la suscripción que cobra sola cada periodo (ver src/backend/payments/subscriptions.ts).
    const recurringPlans = buildRecurringPlans(allValidItems, discountCode);
    const hasSubscriptions = recurringPlans.length > 0;
    const periodNote = (itemId: string) => {
      const billing = getItemBilling(itemId);
      if (billing === 'mensual') return ' · se renueva sola cada mes en esta tarjeta';
      if (billing === 'anual') return ' · se renueva sola cada año en esta tarjeta';
      return '';
    };
    const lineName = (itemId: string, name: string) => `${baseLineName(itemId, name)}${periodNote(itemId)}`;
    const baseLineName = (itemId: string, name: string) => {
      if (unitPrice(itemId) >= basePrice(itemId)) return name;
      return `${name} · Código ${discountCode} (-${Math.round(discountPercent * 100)}%)`;
    };
    const processingFeeUsd = calculateStripeProcessingFee(subtotalUsd);
    const grossTotalUsd = calculateStripeGrossTotal(subtotalUsd);

    const origin = request.nextUrl.origin;
    const successBase =
      customSuccessUrl ||
      process.env.NEXT_PUBLIC_PORTAL_STRIPE_SUCCESS_URL ||
      `${origin}/portal?stripe=success`;
    const cancelUrl = customCancelUrl || `${origin}/portal?stripe=cancelled`;

    // Cliente de Stripe: se reutiliza el del mismo correo para que sus tarjetas y suscripciones queden juntas.
    let customerId: string | null = null;
    if (hasSubscriptions && email.includes('@')) {
      const found = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
      customerId = found.data[0]?.id ?? null;
    }
    const renewalText = recurringPlans
      .map((plan) => `$${(plan.netUsd + plan.feeUsd).toFixed(2)} USD cada ${plan.interval === 'month' ? 'mes' : 'año'}`)
      .join(' y ');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(customerId
        ? { customer: customerId }
        : {
            ...(email.includes('@') ? { customer_email: email } : {}),
            ...(hasSubscriptions ? { customer_creation: 'always' as const } : {}),
          }),
      ...(hasSubscriptions
        ? {
            // La tarjeta queda guardada para cobrar las suscripciones automáticamente.
            payment_intent_data: { setup_future_usage: 'off_session' as const },
            custom_text: {
              submit: {
                message: `Al pagar autorizas que tus suscripciones se cobren automáticamente en esta tarjeta: ${renewalText} (incluye la comisión de procesamiento), desde la fecha de hoy. Puedes cancelarlas cuando quieras escribiéndonos.`,
              },
            },
          }
        : {}),
      line_items: [
        ...uniqueItemIds.map((itemId) => {
          const entry = getProductEntry(itemId)!;
          const qty = counts[itemId] || 1;
          return {
            quantity: qty,
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(unitPrice(itemId) * 100),
              product_data: {
                name: lineName(itemId, entry.name),
                metadata: { item_id: itemId },
              },
            },
          };
        }),
        ...(processingFeeUsd > 0 ? [{
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(processingFeeUsd * 100),
            product_data: {
              name: 'Comisión de Procesamiento y Pasarela (Stripe)',
              description: 'Tarifa por procesamiento y gestión de transacción bancaria internacional con tarjeta',
            },
          },
        }] : []),
      ],
      metadata: {
        user_id: userId || '',
        item_ids: allValidItems.join(','),
        product_id: uniqueItemIds.length === 1 && counts[uniqueItemIds[0]] === 1 ? uniqueItemIds[0] : 'cart',
        billing_email: email.toLowerCase(),
        subtotal_usd: String(subtotalUsd),
        discount_code: discountCode || '',
        subscriptions: hasSubscriptions ? '1' : '0',
        discount_usd: String(discountUsd),
        monthly_discount_usd: String(monthlyDiscountUsd),
        processing_fee_usd: String(processingFeeUsd),
        charge_usd: String(grossTotalUsd),
      },
      success_url: `${successBase}${successBase.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'No se pudo crear la sesión de Stripe' }, { status: 500 });
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      itemIds: allValidItems,
      subtotalUsd,
      discountUsd,
      monthlyDiscountUsd,
      processingFeeUsd,
      totalUsd: grossTotalUsd,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear sesión de Stripe';
    console.error('[API] stripe/create-session error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
