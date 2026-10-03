/**
 * Tarjetas del expediente del cliente ("Mi proceso" en el portal y el expediente en el staff).
 *
 * - "Datos Personales" siempre está abierta.
 * - Hay una tarjeta por cada servicio de la tienda (PORTAL_SERVICES). Se abre cuando el cliente
 *   lo compra (purchased_servicio_* en users/{uid}) o cuando el staff la activa.
 * - Cliente y staff pueden editar los campos (botón "Editar"). Solo el staff sube archivos,
 *   cambia el estado y activa/bloquea tarjetas.
 *
 * Para agregar o cambiar campos de una tarjeta, edita CARD_FIELDS. Los `key` quedan guardados
 * en Firestore: no los renombres una vez que haya datos.
 */

export type CardFieldType = 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'date';

export interface CardField {
  key: string;
  label: string;
  type?: CardFieldType; // por defecto 'text'
  placeholder?: string;
}

export const DATOS_PERSONALES_ID = 'datos-personales';

export type CardStatus = 'pendiente' | 'en_progreso' | 'entregado';

export const CARD_STATUS_LABELS: Record<CardStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  entregado: 'Entregado',
};

const notas: CardField = { key: 'notas', label: 'Notas', type: 'textarea' };

export const CARD_FIELDS: Record<string, CardField[]> = {
  [DATOS_PERSONALES_ID]: [
    { key: 'nombre_completo', label: 'Nombre completo' },
    { key: 'correo', label: 'Correo de contacto', type: 'email' },
    { key: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', placeholder: '+1 385 000 0000' },
    { key: 'pais', label: 'País' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'documento_identidad', label: 'Documento de identidad (tipo y número)' },
    { key: 'instagram_personal', label: 'Instagram personal', placeholder: '@usuario' },
    notas,
  ],

  // ── Para arrancar la empresa ──
  'servicio-crear-empresa-usa': [
    { key: 'nombre_legal', label: 'Nombre legal de la empresa' },
    { key: 'tipo_entidad', label: 'Tipo de entidad', placeholder: 'LLC, C-Corp…' },
    { key: 'estado_registro', label: 'Estado de registro', placeholder: 'Wyoming, Delaware, Florida…' },
    { key: 'numero_entidad', label: 'Número de entidad / registro estatal' },
    { key: 'fecha_constitucion', label: 'Fecha de constitución', type: 'date' },
    { key: 'ein', label: 'EIN', placeholder: '00-0000000' },
    { key: 'duns', label: 'Número DUNS' },
    { key: 'direccion_empresa', label: 'Dirección de la empresa' },
    { key: 'correo_empresa', label: 'Correo de la empresa', type: 'email' },
    { key: 'telefono_empresa', label: 'Teléfono de la empresa', type: 'tel' },
    notas,
  ],
  'servicio-agente-registrado': [
    { key: 'nombre_agente', label: 'Agente registrado' },
    { key: 'direccion_agente', label: 'Dirección del agente registrado' },
    { key: 'direccion_comercial', label: 'Dirección comercial' },
    { key: 'fecha_renovacion', label: 'Fecha de renovación', type: 'date' },
    notas,
  ],
  'servicio-cuenta-bancaria': [
    { key: 'banco', label: 'Banco' },
    { key: 'tipo_cuenta', label: 'Tipo de cuenta' },
    { key: 'estado_solicitud', label: 'Estado de la solicitud', placeholder: 'En revisión, aprobada…' },
    { key: 'ultimos_4', label: 'Últimos 4 dígitos de la cuenta' },
    { key: 'banca_en_linea', label: 'Enlace de banca en línea', type: 'url' },
    notas,
  ],
  'servicio-telefono-whatsapp': [
    { key: 'numero_comercial', label: 'Número comercial de EE. UU.', type: 'tel' },
    { key: 'proveedor_linea', label: 'Proveedor de la línea' },
    { key: 'whatsapp_business', label: 'WhatsApp Business configurado en' },
    notas,
  ],
  'servicio-identidad-visual': [
    { key: 'nombre_marca', label: 'Nombre de la marca' },
    { key: 'colores', label: 'Colores', placeholder: '#000000, #FFFFFF…' },
    { key: 'tipografias', label: 'Tipografías' },
    { key: 'estilo_referencias', label: 'Estilo y referencias', type: 'textarea' },
    notas,
  ],
  'servicio-registro-marca': [
    { key: 'nombre_marca', label: 'Marca a registrar' },
    { key: 'clases', label: 'Clases', placeholder: 'Clase 35, 42…' },
    { key: 'numero_serie_uspto', label: 'Número de serie USPTO' },
    { key: 'fecha_solicitud', label: 'Fecha de solicitud', type: 'date' },
    { key: 'estado', label: 'Estado ante la USPTO' },
    notas,
  ],
  'servicio-impuestos-personales': [
    { key: 'anio_fiscal', label: 'Año fiscal' },
    { key: 'identificacion_fiscal', label: 'SSN / ITIN (solo últimos 4 dígitos)' },
    { key: 'fecha_presentacion', label: 'Fecha de presentación', type: 'date' },
    { key: 'resultado', label: 'Reembolso o pago resultante' },
    notas,
  ],

  // ── Para vender ──
  'servicio-meta-business': [
    { key: 'business_manager_id', label: 'ID del Business Manager' },
    { key: 'pagina_facebook', label: 'Página de Facebook', type: 'url' },
    { key: 'cuenta_instagram', label: 'Cuenta de Instagram', placeholder: '@usuario' },
    { key: 'cuenta_publicitaria_id', label: 'ID de la cuenta publicitaria' },
    { key: 'pixel_id', label: 'ID del Pixel de Meta' },
    notas,
  ],
  'servicio-diseno-web': [
    { key: 'dominio', label: 'Dominio', placeholder: 'miempresa.com' },
    { key: 'url_sitio', label: 'Sitio web', type: 'url' },
    { key: 'hosting', label: 'Hosting' },
    { key: 'usuario_admin', label: 'Usuario administrador (sin contraseña)' },
    notas,
  ],
  'servicio-pasarela-pagos': [
    { key: 'stripe', label: 'Cuenta de Stripe (correo o ID)' },
    { key: 'paypal', label: 'Cuenta de PayPal' },
    { key: 'wallet_stablecoins', label: 'Wallet para stablecoins' },
    notas,
  ],
  'servicio-seo-local': [
    { key: 'perfil_google', label: 'Perfil de Google Business', type: 'url' },
    { key: 'palabras_clave', label: 'Palabras clave', type: 'textarea' },
    { key: 'zona', label: 'Ciudad o zona objetivo' },
    notas,
  ],
  'servicio-campana-publicitaria': [
    { key: 'plataforma', label: 'Plataforma', placeholder: 'Meta, Google, TikTok…' },
    { key: 'objetivo', label: 'Objetivo de la campaña' },
    { key: 'presupuesto_pauta', label: 'Presupuesto de pauta mensual' },
    { key: 'publico', label: 'Público objetivo', type: 'textarea' },
    { key: 'reportes', label: 'Enlace a reportes', type: 'url' },
    notas,
  ],
  'servicio-produccion-contenido': [
    { key: 'redes', label: 'Redes de destino' },
    { key: 'frecuencia', label: 'Frecuencia de publicación' },
    { key: 'carpeta_contenido', label: 'Carpeta del contenido', type: 'url' },
    notas,
  ],
  'servicio-email-marketing': [
    { key: 'plataforma', label: 'Plataforma de correo' },
    { key: 'remitente', label: 'Correo remitente', type: 'email' },
    { key: 'listas', label: 'Listas de contactos' },
    notas,
  ],
  'servicio-chatbot-ia': [
    { key: 'plataforma_url', label: 'Plataforma de IA', type: 'url' },
    { key: 'usuario_plataforma', label: 'Usuario en la plataforma' },
    { key: 'canales', label: 'Canales', placeholder: 'WhatsApp, sitio web…' },
    { key: 'numero_whatsapp', label: 'Número de WhatsApp conectado', type: 'tel' },
    notas,
  ],

  // ── Para crecer ──
  'servicio-contabilidad': [
    { key: 'software', label: 'Software contable' },
    { key: 'periodo', label: 'Periodo actual' },
    { key: 'reportes', label: 'Enlace a reportes', type: 'url' },
    notas,
  ],
  'servicio-nomina': [
    { key: 'numero_empleados', label: 'Número de empleados' },
    { key: 'frecuencia_pago', label: 'Frecuencia de pago', placeholder: 'Semanal, quincenal…' },
    { key: 'plataforma', label: 'Plataforma de nómina' },
    notas,
  ],
  'servicio-crm': [
    { key: 'plataforma', label: 'CRM' },
    { key: 'url', label: 'Enlace del CRM', type: 'url' },
    { key: 'usuarios', label: 'Usuarios con acceso' },
    notas,
  ],
  'servicio-taxes-empresa': [
    { key: 'anio_fiscal', label: 'Año fiscal' },
    { key: 'tipo_declaracion', label: 'Tipo de declaración', placeholder: '1065, 1120, 5472…' },
    { key: 'fecha_presentacion', label: 'Fecha de presentación', type: 'date' },
    { key: 'resultado', label: 'Resultado' },
    notas,
  ],

  // ── Escalada mundial ──
  'servicio-plan-negocios': [
    { key: 'plan_negocios', label: 'Plan de negocios', type: 'url' },
    { key: 'pitch_deck', label: 'Pitch deck', type: 'url' },
    notas,
  ],
  'servicio-redes-sociales': [
    { key: 'instagram', label: 'Instagram', placeholder: '@usuario' },
    { key: 'facebook', label: 'Facebook', type: 'url' },
    { key: 'tiktok', label: 'TikTok', placeholder: '@usuario' },
    { key: 'youtube', label: 'YouTube', type: 'url' },
    { key: 'x', label: 'X', placeholder: '@usuario' },
    { key: 'linkedin', label: 'LinkedIn', type: 'url' },
    notas,
  ],
  'servicio-tienda-online': [
    { key: 'plataforma', label: 'Plataforma', placeholder: 'Shopify, WooCommerce…' },
    { key: 'url_tienda', label: 'Tienda en línea', type: 'url' },
    { key: 'dominio', label: 'Dominio' },
    notas,
  ],
  'servicio-mentoria': [
    { key: 'horario', label: 'Horario de las sesiones' },
    { key: 'enlace_reunion', label: 'Enlace de la reunión', type: 'url' },
    { key: 'objetivos', label: 'Objetivos', type: 'textarea' },
    notas,
  ],
  'servicio-tokenizacion': [
    { key: 'nombre_token', label: 'Nombre del token' },
    { key: 'simbolo', label: 'Símbolo' },
    { key: 'red', label: 'Red', placeholder: 'Solana, Ethereum…' },
    { key: 'contrato', label: 'Dirección del contrato' },
    notas,
  ],
  'servicio-mentoria-completa': [
    { key: 'horario', label: 'Horario de las sesiones' },
    { key: 'enlace_reunion', label: 'Enlace de la reunión', type: 'url' },
    { key: 'objetivos', label: 'Objetivos', type: 'textarea' },
    notas,
  ],
};

export function getCardFields(cardId: string): CardField[] {
  return CARD_FIELDS[cardId] ?? [notas];
}

/** Valida y limpia los campos que llegan del navegador (solo claves conocidas, solo texto). */
export function sanitizeCardFields(cardId: string, input: unknown): Record<string, string> {
  const allowed = new Set(getCardFields(cardId).map((f) => f.key));
  const out: Record<string, string> = {};
  if (!input || typeof input !== 'object') return out;
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (allowed.has(key) && typeof value === 'string') out[key] = value.slice(0, 5000);
  }
  return out;
}
