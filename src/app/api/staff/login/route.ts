import { NextRequest, NextResponse } from 'next/server';
import {
  STAFF_COOKIE,
  STAFF_COOKIE_OPTIONS,
  createStaffSessionToken,
  isStaffRequest,
  isValidStaffPassword,
} from '@/backend/auth/staff-session';

/** ¿Hay una sesión de staff válida? */
export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isStaffRequest(request) });
}

/** Inicia sesión con la contraseña del staff (validada en el servidor). */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (!isValidStaffPassword(body?.password)) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }
  const token = createStaffSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: 'El acceso de staff no está configurado (falta STAFF_SESSION_SECRET).' },
      { status: 500 }
    );
  }
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(STAFF_COOKIE, token, STAFF_COOKIE_OPTIONS);
  return response;
}

/** Cierra la sesión del staff. */
export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(STAFF_COOKIE, '', { ...STAFF_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
