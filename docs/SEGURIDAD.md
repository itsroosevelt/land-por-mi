# Checklist de seguridad (plantilla Next.js + Firebase + Stripe)

Cambios de seguridad aplicados en este proyecto, para replicarlos en otros que usen la misma plantilla.
Ordenados por gravedad. Cada punto indica cómo **comprobar** si el otro proyecto lo tiene.

---

## 1. 🔴 APIs del staff abiertas a cualquiera

**Problema:** `/api/staff/cases`, `/api/staff/entitlements`, `/api/staff/referrals`,
`/api/staff/restore-cases` y `/api/whatsapp/send` respondían sin pedir nada. Cualquiera podía ver
todos los expedientes, marcarse compras como pagadas o enviar WhatsApps con tu cuenta.

**Comprobar:** `curl -i https://TU-DOMINIO/api/staff/cases` → si devuelve datos (200), está abierto.

**Solución:** sesión de staff firmada por el servidor.

1. Crear `src/backend/auth/staff-session.ts` (copiar de este repo). Hace:
   - `isValidStaffPassword(password)`: compara con `STAFF_PASSWORD` usando `timingSafeEqual`.
   - `createStaffSessionToken()`: `<expiración>.<HMAC-SHA256(expiración, STAFF_SESSION_SECRET)>`.
   - `isStaffRequest(request)`: lee la cookie `pormi_staff_session` y verifica firma y expiración.
   - Cookie: `httpOnly`, `secure` en producción, `sameSite: 'lax'`, 12 horas.
2. Crear `src/app/api/staff/login/route.ts`:
   - `POST` → valida la contraseña y pone la cookie.
   - `GET` → `{ authenticated }` (para saber si ya hay sesión al cargar el panel).
   - `DELETE` → borra la cookie (cerrar sesión).
3. Al inicio de **cada** handler de `/api/staff/*` y `/api/whatsapp/send`:
   ```ts
   if (!isStaffRequest(req)) return staffUnauthorized();
   ```
4. Variables nuevas (en `.env.local` y en Vercel):
   ```
   STAFF_PASSWORD=...
   STAFF_SESSION_SECRET=<texto aleatorio largo, p. ej. `openssl rand -base64 48`>
   ```

## 2. 🔴 Contraseña del staff escrita en el código del navegador

**Problema:** `src/app/staff/page.tsx` comparaba `passwordInput === '...'` en el cliente y guardaba
`sessionStorage.setItem('udreamms_staff_auth','true')`. La contraseña se veía en el JS publicado y
bastaba con escribir ese valor en `sessionStorage` para entrar.

**Comprobar:** `grep -rn "passwordInput ===" src/app/staff` o buscar la contraseña en `.next/static`.

**Solución:** en `src/app/staff/page.tsx`:
- `handleLogin` → `POST /api/staff/login` con `{ password }`.
- Al cargar → `GET /api/staff/login` para saber si hay sesión (no usar `sessionStorage`).
- `handleLogout` → `DELETE /api/staff/login`.
- Las llamadas del panel a `/api/staff/*` no cambian: la cookie viaja sola (mismo dominio).

## 3. 🔴 APIs del portal sin verificar quién llama

**Problema:** `/api/portal/chat`, `/applicants`, `/submission`, `/upload` y `/referrals` recibían un
`email` en la URL o el body y lo creían. Cualquiera podía leer el chat o los documentos de otro
cliente, subir archivos a su nombre o escribir como "staff" en el chat.

**Comprobar:** `curl -i "https://TU-DOMINIO/api/portal/chat?email=alguien@x.com&viewer=client"` → si
responde 200 sin token, está abierto.

**Solución:**
1. Crear `src/backend/auth/portal-user.ts` (copiar de este repo):
   - `getPortalUser(request)`: lee `Authorization: Bearer <idToken>` y lo verifica con
     `admin.auth().verifyIdToken()`.
   - `requirePortalAccess(request, email)`: permite si es staff (cookie) **o** si el token es válido
     **y** su email coincide con el `email` pedido. Si no: 401 / 403.
2. En cada handler de `/api/portal/*`, después de leer el email:
   ```ts
   const denied = await requirePortalAccess(req, email);
   if (denied) return denied;
   ```
   - En el `POST` del chat, además: si `sender === 'staff'` exige `isStaffRequest(req)`.
   - En referidos: filtrar por el email de la sesión, no por un `userId` que manda el cliente.
3. Crear `src/lib/auth-fetch.ts` (`authFetch`): igual que `fetch` pero agrega el token de
   `auth.currentUser.getIdToken()`.
4. Reemplazar en el portal todos los `fetch('/api/portal/...')` por `authFetch(...)`:
   `portal/proceso/page.tsx`, `portal/proceso/components/FormularioConsular.tsx`,
   `portal/referidos/page.tsx`, `components/portal/PortalLiveChat.tsx`.
   (Las llamadas del panel de staff a `/api/portal/*` siguen con `fetch` normal: usan la cookie.)

## 4. 🔴 El navegador podía marcarse compras como pagadas

**Problema:** `PortalContext.completeDatabasePurchase` hacía `updateDoc(users/{uid}, { purchased_*: true })`
desde el navegador, y las reglas de Firestore lo permitían. Cualquiera podía desbloquearse todo sin pagar.

**Solución:**
- Las compras las registra **solo el servidor** después de verificar el pago
  (`/api/payments/stripe/confirm-session`, webhook de Stripe, pago QR) en `unlock-purchase.ts`.
- `completeDatabasePurchase` ya no escribe en Firestore: solo limpia el carrito y cierra el checkout.
- Reglas de Firestore (punto 5) que bloquean esos campos desde el navegador.

## 5. 🔴 Reglas de Firestore incompletas

**Problema:** las reglas no tenían `users`, así que en una base nueva el login fallaba, y en la
antigua dependían de reglas abiertas.

**Solución** (`firestore.rules`, copiar de este repo):
- `users/{uid}`: solo el dueño lee; al crear solo puede escribir
  `uid, email, displayName, photoURL, lastLogin, role ('client'), createdAt`; al actualizar solo los
  campos de perfil (`affectedKeys().hasOnly([...])`). Nunca `purchased_*`, `role` ni `status`.
- `solicitudes_visas`, `staff_hidden_cases`, `referrals`, `portal_chats`, `cards`,
  `pendingPurchases`, `visaCryptoSessions`: `allow read, write: if false` (solo servidor).
- Todo lo no listado queda cerrado por defecto.

Publicar:
```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage --project TU-PROYECTO
```

**Comprobar:** Firebase Console → Firestore → Rules. Si ves `allow read, write: if true` o
`request.time < timestamp.date(...)` (modo prueba), está abierto.

## 5b. 🔴 Llaves por correo que chocaban entre clientes

**Problema:** los ids de documentos y carpetas se armaban con
`email.replace(/[^a-zA-Z0-9]/g, '_')`, así que `juan.perez@x.com` y `juan_perez@x.com` daban la misma
llave y **compartían expediente, chat y carpeta de documentos**.

**Comprobar:** `grep -rn "replace(/\[^a-zA-Z0-9\]/g, '_')" src`

**Solución:** `src/backend/auth/email-key.ts` → `emailKey(email)` = SHA-256 del correo normalizado.
Usarlo en todo id/carpeta de cliente (expediente, chat, documentos, compras pendientes, staff) y migrar
los documentos existentes a la llave nueva.

## 5c. 🔴 Registrarse con el correo de otra persona

**Problema:** al crear cuenta con correo y contraseña no se verificaba el correo; alguien podía
registrarse con el correo de un cliente y ver sus datos o recibir sus compras.

**Solución:**
- Al registrarse: `sendEmailVerification(user)`.
- Servidor: `requirePortalAccess` rechaza tokens con `email_verified !== true` (403 `email_not_verified`);
  `/api/payments/apply-pending` también.
- Portal: pantalla "Verifica tu correo" (`VerifyEmailScreen`) si `user.emailVerified === false`.
- Google ya entrega el correo verificado.

## 5d. 🟠 Enlaces permanentes a documentos

**Problema:** los archivos se servían con un token de descarga fijo; si se reenviaba el enlace, cualquiera
podía abrirlo para siempre.

**Solución:** guardar el archivo **sin** `firebaseStorageDownloadTokens` y entregar enlaces firmados de
1 hora (`file.getSignedUrl({ action: 'read', expires })`) cada vez que se consulta el expediente.

## 6. 🟠 Modo de prueba del login solo en desarrollo

Si el otro proyecto tiene un "bypass" de login, que dependa de **dos** condiciones:
```ts
process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true'
```
Así nunca se activa en producción aunque la variable exista. No cargues
`NEXT_PUBLIC_DEV_AUTH_BYPASS` en Vercel.

## 7. 🟠 Secretos y configuración

- `.env.local` en `.gitignore` (comprobar: `git check-ignore .env.local`).
- `FIREBASE_PRIVATE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STAFF_*` **sin**
  `NEXT_PUBLIC_` (las `NEXT_PUBLIC_*` se publican en el navegador).
- Webhook de Stripe propio de cada dominio, con su propio `whsec_…`.
- Dominio de producción en Firebase → Authentication → Authorized domains.
- Si alguna clave se compartió por chat o correo, **rotarla** (Firebase: nueva clave de cuenta de
  servicio y borrar la anterior; Stripe: "Roll key").

## 8. 🟡 Revisar después

- Código de desbloqueo del portal escrito en el cliente (`udreamms_bypass` en `PortalContext.tsx`):
  solo cambia la interfaz, pero conviene quitarlo.
- `confirm-session` usa `session.metadata.user_id` que manda el cliente al crear el pago: solo
  permite regalarle la compra a otro usuario (no obtenerla gratis), pero se puede limitar.

---

### Prueba rápida después de aplicar todo

```bash
B=https://TU-DOMINIO
curl -s -o /dev/null -w "%{http_code}\n" $B/api/staff/cases                                # 401
curl -s -o /dev/null -w "%{http_code}\n" "$B/api/portal/chat?email=x@x.com&viewer=client"  # 401
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H 'Content-Type: application/json' -d '{}' $B/api/whatsapp/send  # 401
```

### Archivos para copiar de este repo

| Archivo | Para qué |
|---|---|
| `src/backend/auth/staff-session.ts` | Sesión de staff (cookie firmada) |
| `src/backend/auth/portal-user.ts` | Verificar token del cliente y su email |
| `src/app/api/staff/login/route.ts` | Iniciar / comprobar / cerrar sesión de staff |
| `src/lib/auth-fetch.ts` | `fetch` del portal con token |
| `firestore.rules` | Reglas de Firestore |
