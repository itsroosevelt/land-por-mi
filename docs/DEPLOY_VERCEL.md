# Publicar en Vercel — itspormi.com

## 1. Variables de entorno

Vercel → tu proyecto → **Settings → Environment Variables** → entorno **Production**.
Copia cada valor desde tu `.env.local` (ese archivo no se sube a GitHub).

| Variable | Notas |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `the-new-republic-1.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `the-new-republic-1` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `the-new-republic-1.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | |
| `FIREBASE_PROJECT_ID` | |
| `FIREBASE_CLIENT_EMAIL` | |
| `FIREBASE_PRIVATE_KEY` | Pégala completa, con los `\n`. Vercel acepta el valor tal cual. |
| `STRIPE_SECRET_KEY` | Clave **live** |
| `STRIPE_WEBHOOK_SECRET` | La del **webhook nuevo** de itspormi.com (paso 2) |
| `NEXT_PUBLIC_PORTAL_STRIPE_SUCCESS_URL` | `https://itspormi.com/portal?stripe=success` |
| `NEXT_PUBLIC_TREASURY_WALLET` | |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | |
| `STAFF_PASSWORD` | Contraseña del panel de staff |
| `STAFF_SESSION_SECRET` | Texto aleatorio largo (el de `.env.local` sirve) |

**No agregues** `NEXT_PUBLIC_DEV_AUTH_BYPASS` (es solo para desarrollo; en producción nunca se activa).

Las variables `NEXT_PUBLIC_*` se incrustan al compilar: si cambias alguna, vuelve a desplegar.

## 2. Webhook de Stripe para el dominio nuevo

Stripe Dashboard → **Developers → Webhooks → Add endpoint**:

- URL: `https://itspormi.com/api/payments/stripe/webhook`
- Evento: `checkout.session.completed`
- Copia el **Signing secret** (`whsec_…`) en `STRIPE_WEBHOOK_SECRET` de Vercel.

El webhook registra el pago aunque el cliente cierre la pestaña antes de volver al portal.

## 3. Dominio

- Vercel → **Settings → Domains** → agrega `itspormi.com` (y `www.itspormi.com` si lo usarás) y
  configura los DNS que indique Vercel.
- Firebase → Authentication → **Authorized domains**: `itspormi.com` (ya agregado). Si usas
  `www.itspormi.com`, agrégalo también.

## 4. Firebase (ya hecho)

- Reglas e índices de Firestore publicados.
- Reglas de Storage publicadas.
- Proveedores de login: Google, correo y teléfono activos.
