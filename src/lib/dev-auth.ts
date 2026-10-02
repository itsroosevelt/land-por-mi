/**
 * Modo de prueba para desarrollar el portal sin iniciar sesión de verdad.
 *
 * Solo se activa si se cumplen las DOS condiciones:
 *  1. El servidor corre en desarrollo (`npm run dev`). En `next build` / producción
 *     NODE_ENV es "production" y esto siempre es false.
 *  2. `.env.local` tiene NEXT_PUBLIC_DEV_AUTH_BYPASS=true
 *
 * Con el modo activo, los botones de inicio con redes sociales llevan directo al
 * portal y el portal usa un usuario de prueba (sin Firebase).
 */
export const DEV_AUTH_BYPASS =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

export const DEV_USER = {
  uid: "dev-user",
  email: "dev@localhost.test",
  displayName: "Usuario de Prueba",
  photoURL: null as string | null,
  getIdToken: async () => "",
};
