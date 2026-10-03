# Base de datos (Firestore) — Por Mí | The New Technological Republic

Proyecto de Firebase: **`the-new-republic-1`**. Base de datos: `(default)`.

Firestore no tiene tablas ni esquemas fijos: cada colección se crea sola la primera vez que el código
guarda un documento en ella. Este archivo describe la forma que el código espera en cada colección.

- Reglas de seguridad: [`firestore.rules`](../firestore.rules)
- Índices compuestos: [`firestore.indexes.json`](../firestore.indexes.json)
- Publicar reglas e índices:
  `npx firebase-tools deploy --only firestore:rules,firestore:indexes --project the-new-republic-1`

> **Quién escribe qué.** Las rutas `/api/*` usan **Firebase Admin**, que no pasa por las reglas.
> El navegador solo puede escribir su propio perfil (`users/{uid}`, campos de perfil) y `contacts`.
> Todo lo relacionado con pagos, compras, expedientes y chats lo escribe únicamente el servidor.

---

## `users/{uid}` — perfil del cliente

Lo crea el login (Google, correo o teléfono) y el portal lo escucha en tiempo real.

| Campo | Tipo | Escribe | Descripción |
|---|---|---|---|
| `uid`, `email`, `displayName`, `photoURL` | string | navegador | Datos del perfil (email en minúsculas) |
| `lastLogin`, `createdAt` | timestamp | navegador | Fechas de acceso y registro |
| `role` | `'client'` | navegador (solo al crear) | Siempre `client` desde el navegador |
| `purchased_servicio_*` | boolean | **servidor** | Servicio de la tienda pagado (p. ej. `purchased_servicio_diseno_web`) |
| `purchased_*` (planes de visa) | boolean | **servidor** | Compras del modelo anterior (visas, libros, cursos) |
| `updatedAt` | string ISO | servidor | Última actualización hecha por el servidor |

Los nombres `purchased_servicio_*` se generan del id del catálogo
(`servicio-diseno-web` → `purchased_servicio_diseno_web`), ver `src/backend/payments/unlock-purchase.ts`.

## `pendingPurchases/{emailKey}` — compras pagadas antes de tener cuenta

Si alguien paga con un correo que todavía no tiene cuenta, la compra queda aquí y se aplica al
registrarse (`/api/payments/apply-pending`).

| Campo | Tipo | Descripción |
|---|---|---|
| `email` | string | Correo del comprador (minúsculas) |
| `items` | map `{ itemId: true }` | Productos pendientes de aplicar |
| `lastSource` | `'stripe' \| 'crypto' \| 'manual'` | Origen del último pago |
| `lastReferenceId` | string \| null | Id de la sesión de Stripe o del pago cripto |
| `createdAt`, `updatedAt` | string ISO | |

## `expedientes/{emailKey}` — tarjetas del cliente (Mi proceso / expediente del staff)

Un documento por cliente (`emailKey` = correo en minúsculas con símbolos → `_`). Se lee y escribe
solo por `/api/expediente` y `/api/expediente/files`. Campos de cada tarjeta: `src/lib/expediente-cards.ts`.

| Campo | Tipo | Descripción |
|---|---|---|
| `email` | string | Correo del cliente |
| `cards.{cardId}` | map | `cardId` = `datos-personales` o el id del servicio (`servicio-crear-empresa-usa`, …) |
| `cards.{cardId}.fields` | map `{ campo: texto }` | Datos de la tarjeta (cliente y staff, botón Editar) |
| `cards.{cardId}.status` | `'pendiente' \| 'en_progreso' \| 'entregado'` | Estado del servicio (solo staff) |
| `cards.{cardId}.activatedByStaff` | boolean | Tarjeta abierta por el staff sin compra (regalo / pago externo) |
| `cards.{cardId}.files` | array de `{ id, name, url, path, contentType, size, uploadedAt }` | Documentos (solo staff sube/borra). Archivos en Storage: `expedientes/{emailKey}/{cardId}/` |
| `cards.{cardId}.updatedAt`, `updatedBy` | string, `'staff' \| 'client'` | Última edición |

Una tarjeta de servicio está **abierta** si el cliente la compró (`purchased_servicio_*` en `users`) o si
`activatedByStaff` es `true`. "Datos Personales" siempre está abierta.

## `solicitudes_visas/{caseId}` — expedientes del staff

Una tarjeta por persona/postulante. El nombre de la colección viene del modelo anterior (visas) y se
mantiene para no perder compatibilidad; hoy representa el **expediente del cliente** en el panel de staff.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | `case_<email>_<tipo>_<applicantId>` |
| `applicantId` | string | Id de la tarjeta dentro del expediente |
| `name`, `email`, `phone` | string | Datos de contacto |
| `status` | string | **Etapa** del expediente: `nuevos` o una etapa de servicio (`registro_empresa`, `identidad_visual`, `diseno_web`, …). Lista completa en `src/app/staff/types.ts` (`STAGE_BY_SERVICE`) |
| `formData` | map | Respuestas del formulario del cliente |
| `notes` | string | Notas del staff |
| `visaType`, `schoolState`, `schoolName` | string | Campos heredados del modelo de visas |
| `submittedAt`, `createdAt`, `updatedAt` | string | Fechas |

Etapas antiguas de visa (`i20_entregado`, `sevis`, …) se muestran como "Usuarios Registrados".

## `staff_hidden_cases/{caseId}`

Marca un expediente como oculto/eliminado en el panel de staff (el id es el mismo del expediente).

## `portal_chats/{chatId}` — chat cliente ↔ staff (Sarah)

| Campo | Tipo | Descripción |
|---|---|---|
| `id`, `clientEmail`, `clientName` | string | |
| `messages` | array de `{ id, text, sender: 'client' \| 'staff', timestamp }` | Conversación |
| `lastMessage`, `lastSender` | string | Resumen para listados |
| `unreadByStaff`, `unreadByClient` | number | Contadores de no leídos |
| `createdAt`, `updatedAt` | string ISO | |

## `referrals/{referralId}` — programa de referidos

| Campo | Tipo | Descripción |
|---|---|---|
| `referralName`, `referralPhone`, `referralEmail` | string | Persona referida |
| `referrerId`, `referrerName`, `referrerEmail` | string | Quién la refirió |
| `status` | `'pendiente' \| 'contactado' \| 'proceso_iniciado' \| 'pagado' \| 'descartado'` | |
| `rewardPaid` | boolean | Si ya se pagó la recompensa |
| `rewardAmount` | number | USD |
| `notes`, `createdAt`, `updatedAt` | string | |

## Pagos con cripto (QR en Solana)

Ver `src/backend/payments/firestore-schema.ts` para los tipos completos.

- `visaCryptoSessions/{sessionId}` — sesión de checkout.
  - `paymentRequests/{requestId}` — solicitud de pago QR (`pending` → `paid` | `expired`).
- `visaCryptoComprobantes/{requestId}` — comprobante del pago confirmado en la cadena.

## Colecciones heredadas

- `contacts/{id}` — formularios de aplicación/onboarding por enlace (`/application/[id]`, `/onboarding/[id]`).
- `cards`, `kanban-groups/{id}/cards`, `chatbots` — módulos antiguos (CRM/WhatsApp, chatbots).

## Storage

Bucket: `the-new-republic-1.firebasestorage.app` (documentos y archivos subidos desde el portal).
Reglas: [`storage.rules`](../storage.rules).
