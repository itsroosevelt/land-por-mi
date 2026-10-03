import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth as adminAuth } from '@/backend/firebase/admin';
import { isStaffRequest } from '@/backend/auth/staff-session';

export interface PortalUser {
  uid: string;
  email: string; // en minúsculas
  /** true si el correo está verificado (Google lo verifica; correo/contraseña requiere confirmar el enlace) */
  emailVerified: boolean;
}

/**
 * Verifica el token de Firebase que el portal envía en `Authorization: Bearer <idToken>`.
 * Devuelve el usuario o null si no hay sesión válida.
 */
export async function getPortalUser(request: NextRequest): Promise<PortalUser | null> {
  const header = request.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match || !adminAuth) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    return {
      uid: decoded.uid,
      email: (decoded.email || '').toLowerCase().trim(),
      emailVerified: decoded.email_verified === true,
    };
  } catch {
    return null;
  }
}

export function portalUnauthorized() {
  return NextResponse.json({ error: 'No autorizado. Inicia sesión en la plataforma.' }, { status: 401 });
}

export function portalForbidden() {
  return NextResponse.json({ error: 'No tienes permiso para acceder a estos datos.' }, { status: 403 });
}

/**
 * Acceso a datos del portal de un cliente: lo permite si es el staff (cookie de sesión)
 * o si es el propio cliente con sesión iniciada y el correo coincide.
 * Devuelve una respuesta de error, o null si el acceso está permitido.
 */
export async function requirePortalAccess(
  request: NextRequest,
  email?: string | null
): Promise<NextResponse | null> {
  if (isStaffRequest(request)) return null;
  const user = await getPortalUser(request);
  if (!user) return portalUnauthorized();
  // Sin correo verificado no se entregan datos: evita que alguien se registre con el correo de otra persona.
  if (!user.emailVerified) {
    return NextResponse.json(
      { error: 'Verifica tu correo electrónico para acceder a tus datos.', code: 'email_not_verified' },
      { status: 403 }
    );
  }
  if (email && user.email !== email.toLowerCase().trim()) return portalForbidden();
  return null;
}
