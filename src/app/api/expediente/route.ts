import { NextRequest, NextResponse } from 'next/server';
import { requirePortalAccess } from '@/backend/auth/portal-user';
import { isStaffRequest } from '@/backend/auth/staff-session';
import {
  VALID_CARD_IDS,
  getExpedienteView,
  isCardUnlocked,
  updateStoredCard,
  type StoredCard,
} from '@/backend/expediente';
import { CARD_STATUS_LABELS, sanitizeCardFields, type CardStatus } from '@/lib/expediente-cards';

/** Tarjetas del expediente de un cliente (el propio cliente o el staff). */
export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get('email')?.toLowerCase().trim();
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
  const denied = await requirePortalAccess(req, email);
  if (denied) return denied;

  try {
    return NextResponse.json({ cards: await getExpedienteView(email) });
  } catch (error: unknown) {
    console.error('[API] expediente GET:', error);
    return NextResponse.json({ error: 'No se pudo cargar el expediente.' }, { status: 500 });
  }
}

/**
 * Edita una tarjeta.
 * - fields: cliente (si la tarjeta está abierta) o staff.
 * - status y activated: solo staff.
 */
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
  const cardId = typeof body.cardId === 'string' ? body.cardId : '';
  if (!email || !VALID_CARD_IDS.has(cardId)) {
    return NextResponse.json({ error: 'Datos inválidos (email, cardId).' }, { status: 400 });
  }
  const denied = await requirePortalAccess(req, email);
  if (denied) return denied;

  const isStaff = isStaffRequest(req);
  const patch: StoredCard = {};

  try {
    if (body.fields !== undefined) {
      if (!isStaff && !(await isCardUnlocked(email, cardId))) {
        return NextResponse.json({ error: 'Esta tarjeta está bloqueada.' }, { status: 403 });
      }
      patch.fields = sanitizeCardFields(cardId, body.fields);
    }
    if (body.status !== undefined || body.activated !== undefined) {
      if (!isStaff) {
        return NextResponse.json({ error: 'Solo el staff puede cambiar el estado o activar tarjetas.' }, { status: 403 });
      }
      if (body.status !== undefined) {
        if (!(body.status in CARD_STATUS_LABELS)) {
          return NextResponse.json({ error: 'Estado inválido.' }, { status: 400 });
        }
        patch.status = body.status as CardStatus;
      }
      if (body.activated !== undefined) patch.activatedByStaff = Boolean(body.activated);
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No hay cambios.' }, { status: 400 });
    }
    patch.updatedBy = isStaff ? 'staff' : 'client';
    await updateStoredCard(email, cardId, patch);
    return NextResponse.json({ cards: await getExpedienteView(email) });
  } catch (error: unknown) {
    console.error('[API] expediente PATCH:', error);
    return NextResponse.json({ error: 'No se pudo guardar.' }, { status: 500 });
  }
}
