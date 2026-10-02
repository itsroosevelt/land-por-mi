import React from 'react';
import { Inbox, BookOpen, Gift } from 'lucide-react';
import { PORTAL_SERVICE_SECTIONS } from '@/lib/business-services';

/**
 * Etapas del expediente: el cliente se registra y luego avanza por los servicios de la tienda,
 * en el mismo orden en que aparecen en la tienda del portal (sección por sección, del más barato al más caro).
 * Fuente única para el panel de staff y para "Mi proceso" del portal.
 *
 * Los `id` de etapa quedan guardados en Firebase: no los cambies una vez en uso.
 * Para agregar un servicio a la tienda del portal, agrégalo también aquí con su etapa.
 */
const STAGE_BY_SERVICE: Record<string, { id: string; desc: string }> = {
  'servicio-crear-empresa-usa': { id: 'registro_empresa', desc: "Estamos registrando tu empresa en Estados Unidos y gestionando su EIN y su número DUNS." },
  'servicio-agente-registrado': { id: 'agente_registrado', desc: "Configuramos tu agente registrado y tu dirección comercial en EE. UU." },
  'servicio-cuenta-bancaria': { id: 'cuenta_bancaria', desc: "Te acompañamos en la apertura de la cuenta bancaria de tu empresa." },
  'servicio-telefono-whatsapp': { id: 'telefono_whatsapp', desc: "Configuramos tu número comercial de EE. UU. y WhatsApp Business." },
  'servicio-identidad-visual': { id: 'identidad_visual', desc: "Diseñamos el logo, los colores y el manual de tu marca." },
  'servicio-registro-marca': { id: 'registro_marca', desc: "Estamos protegiendo tu marca ante la USPTO." },
  'servicio-meta-business': { id: 'meta_business', desc: "Configuramos tu Meta Business Suite para Facebook e Instagram." },
  'servicio-diseno-web': { id: 'diseno_web', desc: "Estamos creando el sitio web de tu negocio." },
  'servicio-tienda-online': { id: 'tienda_online', desc: "Estamos construyendo tu tienda en línea." },
  'servicio-pasarela-pagos': { id: 'pasarela_pagos', desc: "Configuramos tus cobros con Stripe, PayPal y stablecoins." },
  'servicio-seo-local': { id: 'seo_local', desc: "Tu negocio está ganando visibilidad en Google y Google Maps." },
  'servicio-campana-publicitaria': { id: 'campana_publicitaria', desc: "Lanzamos y optimizamos tu campaña publicitaria." },
  'servicio-redes-sociales': { id: 'redes_sociales', desc: "Gestionamos tus redes con estrategia de viralización y ventas." },
  'servicio-produccion-contenido': { id: 'produccion_contenido', desc: "Producimos fotos, videos y reels para tus redes." },
  'servicio-email-marketing': { id: 'email_marketing', desc: "Lanzamos tus campañas de correo y automatizaciones." },
  'servicio-chatbot-ia': { id: 'chatbot_ia', desc: "Estamos entrenando tu asistente con inteligencia artificial." },
  'servicio-crm': { id: 'crm', desc: "Organizamos tus clientes y automatizamos tus ventas." },
  'servicio-contabilidad': { id: 'contabilidad', desc: "Llevamos la contabilidad mensual de tu empresa." },
  'servicio-plan-negocios': { id: 'plan_negocios', desc: "Preparamos tu plan de negocios y tu presentación para inversionistas." },
  'servicio-tokenizacion': { id: 'tokenizacion', desc: "Estamos creando el token de tu proyecto." },
  'servicio-mentoria': { id: 'mentoria', desc: "Sesiones de mentoría 1 a 1 para hacer crecer tu empresa." },
  'servicio-mentoria-completa': { id: 'mentoria_completa', desc: "Mentoría 1 a 1 y los servicios esenciales para lanzar tu empresa." },
  'servicio-impuestos-personales': { id: 'impuestos_personales', desc: "Estamos preparando tu declaración de impuestos personal." },
  'servicio-taxes-empresa': { id: 'taxes_empresa', desc: "Estamos preparando la declaración de impuestos de tu empresa." },
  'servicio-nomina': { id: 'nomina', desc: "Gestionamos el pago de nómina de tu empresa." },
};

type PipelineStage = { id: string; label: string; desc: string; icon: React.ElementType; color: string };

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'nuevos', label: 'Usuarios Registrados', desc: "Tu cuenta está creada. Pronto empezamos con tu empresa.", icon: Inbox, color: 'text-blue-600' },
  ...PORTAL_SERVICE_SECTIONS.flatMap((section) => section.services)
    .filter((service) => STAGE_BY_SERVICE[service.id])
    .map((service) => ({
      id: STAGE_BY_SERVICE[service.id].id,
      label: service.name,
      desc: STAGE_BY_SERVICE[service.id].desc,
      icon: service.icon,
      color: 'text-blue-600',
    })),
];

export type PipelineStageId = string;

/** Expedientes guardados con etapas antiguas (proceso de visa) se muestran en "Usuarios Registrados". */
export const normalizeStage = (status?: string): PipelineStageId =>
  PIPELINE_STAGES.some((stage) => stage.id === status) ? (status as string) : 'nuevos';

export type StaffTabType = PipelineStageId | 'referidos' | 'recursos';

export interface StudentCase {
  id: string;
  name: string;
  email: string;
  phone: string;
  visaType: 'F-1' | 'B-2';
  schoolState: string;
  schoolName: string;
  status: StaffTabType;
  submittedAt: string;
  updatedAt?: string;
  photoUrl?: string;
  passportDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  bankStatementDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  sevisDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  i20Doc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  ds160Doc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  acceptanceLetterDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  affidavitDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  embassyAppointmentDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  purchases?: string[];
  entitlements?: Record<string, boolean>;
  groupKey?: string;
  applicantId?: string;
  hasVisaService?: boolean;
  formData: Record<string, string>;
  notes?: string;
  unreadCount?: number;
  lastChatMessage?: string;
  expedienteNumber?: number;
}

export interface TabDefinition {
  id: StaffTabType;
  label: string;
  icon: React.ElementType;
  color: string;
}

export const getStatusLabel = (status: StaffTabType): string => {
  if (status === 'referidos') return 'Programa de Referidos';
  if (status === 'recursos') return 'Recursos & Guías para el Staff';
  return PIPELINE_STAGES.find((stage) => stage.id === status)?.label ?? status;
};

export const STAFF_TABS_LIST: TabDefinition[] = [
  ...PIPELINE_STAGES.map((stage, index) => ({
    id: stage.id,
    label: `${index + 1}. ${stage.label}`,
    icon: stage.icon,
    color: stage.color,
  })),
  { id: 'referidos', label: 'Programa de Referidos', icon: Gift, color: 'text-emerald-600' },
  { id: 'recursos', label: 'Recursos & Guías Staff', icon: BookOpen, color: 'text-amber-600' },
];

export const isUsableDoc = (doc?: { url?: string; dataUrl?: string }): boolean => {
  if (!doc) return false;
  if (doc.url) return true;
  if (doc.dataUrl && !doc.dataUrl.includes('[truncated_due_to_size]')) return true;
  return false;
};

export const DOSSIER_SECTIONS: { anchor: string; label: string; fields: string[] }[] = [
  { anchor: 'sec-1', label: '1. Personal', fields: ['apellidos', 'nombres', 'fecha_nacimiento', 'pais_nacimiento'] },
  { anchor: 'sec-2', label: '2. Escuela', fields: ['motivo_estudio_ingles', 'duracion_estudio', 'horario_estudio', 'semestre_inicio', 'nombre_escuela'] },
  { anchor: 'sec-3', label: '3. Estado Civil', fields: ['estado_civil'] },
  { anchor: 'sec-4', label: '4. Pasaporte', fields: ['num_pasaporte', 'ciudad_pasaporte', 'fecha_emision_pasaporte', 'fecha_expiracion_pasaporte'] },
  { anchor: 'sec-5', label: '5. Domicilio', fields: ['direccion_domicilio', 'ciudad_domicilio', 'pais_domicilio', 'celular_contacto', 'email_contacto'] },
  { anchor: 'sec-6', label: '6. Sponsor', fields: ['tiene_patrocinador'] },
  { anchor: 'sec-7', label: '7. Hijos', fields: ['hijos_count'] },
  { anchor: 'sec-8', label: '8. Padres', fields: ['nombre_mama', 'fecha_nac_mama', 'nombre_papa', 'fecha_nac_papa'] },
  { anchor: 'sec-9', label: '9. Trabajo', fields: ['trabajo_empresa', 'trabajo_direccion', 'trabajo_ciudad', 'trabajo_salario', 'trabajo_descripcion'] },
  { anchor: 'sec-10', label: '10-11. Educación', fields: ['secundaria_nombre', 'secundaria_direccion', 'secundaria_programa'] },
  { anchor: 'sec-12', label: '12. Entrada a EE.UU.', fields: ['usa_hospedaje_direccion', 'idiomas_habla', 'servicio_militar'] },
  { anchor: 'sec-13', label: '13. Emergencia', fields: ['c1_nombre', 'c1_telefono', 'c1_email', 'c2_nombre', 'c2_telefono', 'c2_email'] },
];

export const isSectionFilled = (formData: Record<string, string>, fields: string[]): boolean => {
  if (!formData || typeof formData !== 'object') return false;
  return fields.every(f => Boolean(formData[f]?.trim()));
};

export const SI_NO_OPTIONS = [{ value: 'No', label: 'No' }, { value: 'Sí', label: 'Sí' }];

export const FIELD_SELECT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  otra_nacionalidad: SI_NO_OPTIONS,
  residente_otro_pais: SI_NO_OPTIONS,
  rechazo_estudiante_previo: SI_NO_OPTIONS,
  perdio_pasaporte: SI_NO_OPTIONS,
  tiene_visa_turista: SI_NO_OPTIONS,
  tiene_patrocinador: SI_NO_OPTIONS,
  trabajo_anterior_si: SI_NO_OPTIONS,
  cambio_celular_5anos: SI_NO_OPTIONS,
  familia_en_usa: SI_NO_OPTIONS,
  servicio_militar: SI_NO_OPTIONS,
  duracion_estudio: [
    { value: '3 meses', label: '3 meses' },
    { value: '6 meses', label: '6 meses' },
    { value: '12 meses', label: '12 meses' },
  ],
  horario_estudio: [
    { value: 'Mañana', label: 'Mañana' },
    { value: 'Tarde', label: 'Tarde' },
    { value: 'Noche', label: 'Noche' },
  ],
  semestre_inicio: [
    { value: 'Enero', label: 'Enero' },
    { value: 'Mayo', label: 'Mayo' },
    { value: 'Septiembre', label: 'Septiembre' },
  ],
  estado_civil: [
    { value: 'Soltero', label: 'Soltero / Soltera' },
    { value: 'Casado', label: 'Casado / Casada' },
    { value: 'Divorciado', label: 'Divorciado / Divorciada' },
    { value: 'Viudo', label: 'Viudo / Viuda' },
    { value: 'Unión Libre', label: 'Unión Libre' },
  ],
  hijos_count: Array.from({ length: 11 }, (_, n) => ({
    value: String(n),
    label: n === 0 ? '0 (Ninguno)' : `${n} Hijo${n > 1 ? 's' : ''}`,
  })),
  nombre_escuela: [
    'Uceda School of Utah (Provo)',
    'LANGUAGE ON (Salt Lake City)',
    'Internexus Provo (Campus 1 - Provo)',
    'Internexus Provo (Campus 2 - Provo)',
    'American One English Schools INC (West Valley)',
    'Lumos Language School (Salt Lake City)',
    'Lumos Language School (Orem)',
    'INX Academy (Salt Lake City)',
    'PACE International Academy (Orem)',
    'U.S. Ling Institute (Murray)',
    'Brigham Young University - Provo',
    'BYU Salt Lake Center (Salt Lake City)',
    'Utah Valley University (Orem)',
    'UVU School of Aviation Science (Provo)',
    'University of Utah (Salt Lake City)',
    'Utah State University (Logan)',
    'Utah State University Eastern (Price)',
    'Utah State University Flight Training (Logan)',
    'Utah State Univ. Eastern Flight Training (Price)',
    'Southern Utah University (Cedar City)',
    'Southern Utah University Aviation (Cedar City)',
    'Weber State University (Ogden)',
    'Weber State University Davis (Layton)',
    'Utah Tech University (St. George)',
    'Snow College',
    'Salt Lake Community College (Taylorsville Redwood Campus)',
    'Salt Lake Community College (South City Campus)',
    'Salt Lake Community College (Jordan Campus)',
    'Salt Lake Community College (Miller Campus)',
    'Salt Lake Community College (Library Square Center)',
    'Salt Lake Community College (Meadowbrook Campus)',
    'Salt Lake Community College (Westpointe Center)',
    'Salt Lake Community College (International Aerospace/Aviation)',
    'Otra Escuela',
  ].map(v => ({ value: v, label: v })),
};
