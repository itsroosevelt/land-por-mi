import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { isStaffRequest, staffUnauthorized } from '@/backend/auth/staff-session';
import {
  VALID_CARD_IDS,
  expedienteBucket,
  expedienteKey,
  getExpedienteView,
  getStoredCards,
  updateStoredCard,
  type ExpedienteFile,
} from '@/backend/expediente';

// Vercel limita el cuerpo de la petición a ~4.5 MB; en base64 eso deja ~3 MB por archivo.
const MAX_FILE_BYTES = 3 * 1024 * 1024;

const bucket = expedienteBucket;

/** Sube un archivo a una tarjeta del expediente (solo staff). */
export async function POST(req: NextRequest) {
  if (!isStaffRequest(req)) return staffUnauthorized();
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
  const cardId = typeof body.cardId === 'string' ? body.cardId : '';
  if (!email || !VALID_CARD_IDS.has(cardId)) {
    return NextResponse.json({ error: 'Datos inválidos (email, cardId).' }, { status: 400 });
  }
  const match = /^data:([^;]+);base64,(.+)$/.exec(String(body.dataUrl || ''));
  if (!match) return NextResponse.json({ error: 'Archivo inválido.' }, { status: 400 });

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'El archivo supera 3 MB.' }, { status: 400 });
  }

  try {
    const contentType = String(body.contentType || match[1] || 'application/octet-stream');
    const safeName = String(body.fileName || 'archivo').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
    const fileId = randomUUID();
    const path = `expedientes/${expedienteKey(email)}/${cardId}/${Date.now()}-${safeName}`;
    // Sin token de descarga público: solo se accede con enlaces temporales firmados por el servidor.
    await bucket().file(path).save(buffer, { contentType });

    const file: ExpedienteFile = {
      id: fileId,
      name: String(body.fileName || safeName),
      url: '',
      path,
      contentType,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
    };
    const stored = await getStoredCards(email);
    const files = [...(stored[cardId]?.files || []), file];
    await updateStoredCard(email, cardId, { files, updatedBy: 'staff' });
    return NextResponse.json({ cards: await getExpedienteView(email) });
  } catch (error: unknown) {
    console.error('[API] expediente/files POST:', error);
    return NextResponse.json({ error: 'No se pudo subir el archivo.' }, { status: 500 });
  }
}

/** Elimina un archivo de una tarjeta (solo staff). */
export async function DELETE(req: NextRequest) {
  if (!isStaffRequest(req)) return staffUnauthorized();
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
  const cardId = typeof body.cardId === 'string' ? body.cardId : '';
  const fileId = typeof body.fileId === 'string' ? body.fileId : '';
  if (!email || !VALID_CARD_IDS.has(cardId) || !fileId) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
  }
  try {
    const stored = await getStoredCards(email);
    const current = stored[cardId]?.files || [];
    const toDelete = current.find((f) => f.id === fileId);
    if (toDelete) await bucket().file(toDelete.path).delete({ ignoreNotFound: true });
    await updateStoredCard(email, cardId, {
      files: current.filter((f) => f.id !== fileId),
      updatedBy: 'staff',
    });
    return NextResponse.json({ cards: await getExpedienteView(email) });
  } catch (error: unknown) {
    console.error('[API] expediente/files DELETE:', error);
    return NextResponse.json({ error: 'No se pudo eliminar el archivo.' }, { status: 500 });
  }
}
