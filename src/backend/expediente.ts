import { emailKey } from '@/backend/auth/email-key';
import { admin, requireAdminDb } from '@/backend/firebase/admin';
import { PORTAL_SERVICES } from '@/lib/business-services';
import { DATOS_PERSONALES_ID, type CardStatus } from '@/lib/expediente-cards';

/** Colección: expedientes/{emailKey} — tarjetas del cliente (ver docs/DATABASE.md). */
export const EXPEDIENTES_COLLECTION = 'expedientes';

export interface ExpedienteFile {
  id: string;
  name: string;
  url: string;
  path: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

export interface StoredCard {
  fields?: Record<string, string>;
  status?: CardStatus;
  activatedByStaff?: boolean;
  files?: ExpedienteFile[];
  updatedAt?: string;
  updatedBy?: 'staff' | 'client';
}

/** Lo que recibe el navegador por cada tarjeta. */
export interface CardView {
  id: string;
  unlocked: boolean;
  purchased: boolean;
  activatedByStaff: boolean;
  status: CardStatus;
  fields: Record<string, string>;
  files: ExpedienteFile[];
  updatedAt: string | null;
  updatedBy: 'staff' | 'client' | null;
}

export const VALID_CARD_IDS = new Set<string>([DATOS_PERSONALES_ID, ...PORTAL_SERVICES.map((s) => s.id)]);

export function expedienteKey(email: string): string {
  return emailKey(email);
}

export function expedienteBucket() {
  const name = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  return name ? admin.storage().bucket(name) : admin.storage().bucket();
}

/** Enlace de descarga temporal (1 hora): si alguien reenvía el enlace, deja de funcionar. */
const SIGNED_URL_MINUTES = 60;
async function withSignedUrls(files: ExpedienteFile[]): Promise<ExpedienteFile[]> {
  return Promise.all(
    files.map(async (file) => {
      try {
        const [url] = await expedienteBucket()
          .file(file.path)
          .getSignedUrl({ action: 'read', expires: Date.now() + SIGNED_URL_MINUTES * 60 * 1000 });
        return { ...file, url };
      } catch {
        return { ...file, url: '' };
      }
    })
  );
}

export function purchaseFlagFor(serviceId: string): string {
  return `purchased_${serviceId.replace(/-/g, '_')}`;
}

/** Compras del cliente (purchased_servicio_*) leídas de users, buscando por correo. */
async function getPurchasedServiceIds(email: string): Promise<Set<string>> {
  const db = requireAdminDb();
  const snap = await db.collection('users').where('email', '==', email.toLowerCase().trim()).limit(5).get();
  const purchased = new Set<string>();
  snap.forEach((doc) => {
    const data = doc.data();
    for (const service of PORTAL_SERVICES) {
      if (data[purchaseFlagFor(service.id)] === true) purchased.add(service.id);
    }
  });
  return purchased;
}

export async function getStoredCards(email: string): Promise<Record<string, StoredCard>> {
  const doc = await requireAdminDb().collection(EXPEDIENTES_COLLECTION).doc(expedienteKey(email)).get();
  return (doc.exists ? (doc.data()?.cards as Record<string, StoredCard>) : null) || {};
}

export async function isCardUnlocked(email: string, cardId: string): Promise<boolean> {
  if (cardId === DATOS_PERSONALES_ID) return true;
  const [stored, purchased] = await Promise.all([getStoredCards(email), getPurchasedServiceIds(email)]);
  return purchased.has(cardId) || stored[cardId]?.activatedByStaff === true;
}

export async function getExpedienteView(email: string): Promise<CardView[]> {
  const [stored, purchased] = await Promise.all([getStoredCards(email), getPurchasedServiceIds(email)]);
  const views = [...VALID_CARD_IDS].map((id) => {
    const card = stored[id] || {};
    const isPurchased = purchased.has(id);
    const activated = card.activatedByStaff === true;
    return {
      id,
      unlocked: id === DATOS_PERSONALES_ID || isPurchased || activated,
      purchased: isPurchased,
      activatedByStaff: activated,
      status: card.status || 'pendiente',
      fields: card.fields || {},
      files: card.files || [],
      updatedAt: card.updatedAt || null,
      updatedBy: card.updatedBy || null,
    };
  });
  // Los enlaces guardados nunca se envían: se generan enlaces temporales en cada consulta.
  return Promise.all(views.map(async (v) => (v.files.length ? { ...v, files: await withSignedUrls(v.files) } : v)));
}

/** Actualiza (merge) una tarjeta del expediente. */
export async function updateStoredCard(email: string, cardId: string, patch: StoredCard) {
  const ref = requireAdminDb().collection(EXPEDIENTES_COLLECTION).doc(expedienteKey(email));
  await ref.set(
    {
      email: email.toLowerCase().trim(),
      updatedAt: new Date().toISOString(),
      cards: { [cardId]: { ...patch, updatedAt: new Date().toISOString() } },
    },
    { merge: true }
  );
}
