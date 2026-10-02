import { auth } from '@/lib/firebase';

/**
 * fetch para las APIs del portal (/api/portal/*): agrega el token de Firebase del usuario
 * (`Authorization: Bearer <idToken>`), que el servidor verifica antes de responder.
 */
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = await auth?.currentUser?.getIdToken().catch(() => null);
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
