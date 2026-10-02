import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Sesión del panel de staff.
 *
 * La contraseña vive solo en el servidor (STAFF_PASSWORD). Al iniciar sesión se entrega una
 * cookie httpOnly firmada con STAFF_SESSION_SECRET; las rutas /api/staff/* la exigen.
 */
export const STAFF_COOKIE = 'pormi_staff_session';
const SESSION_HOURS = 12;

function secret(): string | null {
  return process.env.STAFF_SESSION_SECRET || null;
}

function sign(value: string, key: string): string {
  return createHmac('sha256', key).update(value).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function isValidStaffPassword(password: unknown): boolean {
  const expected = process.env.STAFF_PASSWORD;
  if (!expected || typeof password !== 'string') return false;
  return safeEqual(password, expected);
}

export function createStaffSessionToken(): string | null {
  const key = secret();
  if (!key) return null;
  const expiresAt = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expiresAt}.${sign(expiresAt, key)}`;
}

export function isStaffRequest(request: NextRequest): boolean {
  const key = secret();
  const token = request.cookies.get(STAFF_COOKIE)?.value;
  if (!key || !token) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) return false;
  if (!safeEqual(signature, sign(expiresAt, key))) return false;
  return Number(expiresAt) > Date.now();
}

/** Respuesta 401 estándar para rutas del staff. */
export function staffUnauthorized() {
  return NextResponse.json({ error: 'No autorizado. Inicia sesión en el panel de staff.' }, { status: 401 });
}

export const STAFF_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_HOURS * 60 * 60,
};
