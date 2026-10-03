'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Lock, Unlock, Pencil, Save, X, Upload, FileText, Trash2, ExternalLink, UserRound, Gift, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { PORTAL_SERVICE_SECTIONS } from '@/lib/business-services';
import {
  CARD_STATUS_LABELS,
  DATOS_PERSONALES_ID,
  getCardFields,
  type CardStatus,
} from '@/lib/expediente-cards';
import type { CardView } from '@/backend/expediente';

type Requester = (input: string, init?: RequestInit) => Promise<Response>;

interface ExpedienteCardsProps {
  email: string;
  /** client = portal "Mi proceso"; staff = expediente en el panel de staff */
  mode: 'client' | 'staff';
  /** authFetch en el portal (envía el token), fetch en el staff (usa la cookie de sesión) */
  request: Requester;
}

const STATUS_STYLES: Record<CardStatus, string> = {
  pendiente: 'bg-slate-100 text-slate-600 border-slate-200',
  en_progreso: 'bg-blue-50 text-blue-700 border-blue-200',
  entregado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

export default function ExpedienteCards({ email, mode, request }: ExpedienteCardsProps) {
  const [cards, setCards] = useState<Record<string, CardView>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const editingRef = useRef<string | null>(null);
  editingRef.current = editingId;
  const isStaff = mode === 'staff';

  const applyCards = (list: CardView[]) => setCards(Object.fromEntries(list.map((c) => [c.id, c])));

  const load = useCallback(async () => {
    if (!email) return;
    try {
      const res = await request(`/api/expediente?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) applyCards(data.cards);
    } catch {
      // sin conexión: se reintenta en la próxima actualización
    } finally {
      setLoading(false);
    }
  }, [email, request]);

  // Carga inicial y actualización periódica (sin pisar lo que se está editando).
  useEffect(() => {
    load();
    const interval = setInterval(() => {
      if (!editingRef.current) load();
    }, 20000);
    return () => clearInterval(interval);
  }, [load]);

  const patch = async (cardId: string, body: Record<string, unknown>, okMessage: string) => {
    setBusyId(cardId);
    try {
      const res = await request('/api/expediente', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cardId, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar.');
      applyCards(data.cards);
      toast.success(okMessage);
      return true;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar.');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (card: CardView) => {
    setEditingId(card.id);
    setDraft({ ...card.fields });
  };

  const saveEdit = async (cardId: string) => {
    if (await patch(cardId, { fields: draft }, 'Datos guardados')) {
      setEditingId(null);
      setDraft({});
    }
  };

  const uploadFile = async (cardId: string, file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('El archivo supera 3 MB.');
      return;
    }
    setBusyId(cardId);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
        reader.readAsDataURL(file);
      });
      const res = await request('/api/expediente/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cardId, dataUrl, fileName: file.name, contentType: file.type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo subir el archivo.');
      applyCards(data.cards);
      toast.success('Archivo subido');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'No se pudo subir el archivo.');
    } finally {
      setBusyId(null);
    }
  };

  const deleteFile = async (cardId: string, fileId: string) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    setBusyId(cardId);
    try {
      const res = await request('/api/expediente/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cardId, fileId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar.');
      applyCards(data.cards);
      toast.success('Archivo eliminado');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-500 gap-2">
        <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
        Cargando expediente…
      </div>
    );
  }

  const services = PORTAL_SERVICE_SECTIONS.flatMap((s) => s.services);
  const activeCount = services.filter((s) => cards[s.id]?.unlocked).length;

  const renderCard = (cardId: string, name: string, Icon: React.ElementType, fullWidth = false) => {
    const card = cards[cardId];
    if (!card) return null;
    const fields = getCardFields(cardId);
    const isEditing = editingId === cardId;
    const isBusy = busyId === cardId;
    const isPersonal = cardId === DATOS_PERSONALES_ID;

    return (
      <div
        key={cardId}
        className={`bg-white border rounded-[1.5rem] p-4 md:p-5 flex flex-col gap-3 shadow-sm transition-all ${
          card.unlocked ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70'
        } ${fullWidth ? 'md:col-span-2 xl:col-span-3' : ''}`}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${card.unlocked ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h4 className={`text-sm font-semibold leading-snug ${card.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>{name}</h4>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {!card.unlocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border bg-slate-100 text-slate-500 border-slate-200">
                <Lock className="w-3 h-3" /> Bloqueada
              </span>
            ) : isPersonal ? null : isStaff ? (
              <select
                value={card.status}
                disabled={isBusy}
                onChange={(e) => patch(cardId, { status: e.target.value }, 'Estado actualizado')}
                className={`text-[10px] font-semibold rounded-md border px-1.5 py-0.5 cursor-pointer focus:outline-none ${STATUS_STYLES[card.status]}`}
                title="Estado del servicio"
              >
                {(Object.keys(CARD_STATUS_LABELS) as CardStatus[]).map((s) => (
                  <option key={s} value={s}>{CARD_STATUS_LABELS[s]}</option>
                ))}
              </select>
            ) : (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${STATUS_STYLES[card.status]}`}>
                {CARD_STATUS_LABELS[card.status]}
              </span>
            )}
          </div>
        </div>

        {/* Origen del acceso (solo staff) */}
        {isStaff && !isPersonal && card.unlocked && (
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            {card.purchased ? (
              <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Comprado por el cliente</>
            ) : (
              <><Gift className="w-3 h-3 text-violet-600" /> Activado por el staff</>
            )}
          </p>
        )}

        {/* Bloqueada */}
        {!card.unlocked ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-500">
              {isStaff ? 'El cliente no ha comprado este servicio.' : 'Adquiere este servicio para que tu equipo empiece a trabajar en él.'}
            </p>
            {isStaff ? (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => patch(cardId, { activated: true }, 'Tarjeta activada para el cliente')}
                className="self-start inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 disabled:opacity-50"
              >
                <Unlock className="w-3.5 h-3.5" /> Activar tarjeta
              </button>
            ) : (
              <Link
                href="/portal/tienda"
                className="self-start inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Ver en la tienda
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Campos */}
            <div className={`grid gap-2.5 ${fullWidth ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
              {fields.map((field) => {
                const value = isEditing ? draft[field.key] ?? '' : card.fields[field.key] || '';
                return (
                  <div key={field.key} className={field.type === 'textarea' && fullWidth ? 'sm:col-span-2 lg:col-span-3' : ''}>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">{field.label}</p>
                    {isEditing ? (
                      field.type === 'textarea' ? (
                        <textarea
                          value={value}
                          placeholder={field.placeholder}
                          onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                          rows={3}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      ) : (
                        <input
                          type={field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
                          value={value}
                          placeholder={field.placeholder}
                          onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                          className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      )
                    ) : value ? (
                      field.type === 'url' ? (
                        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all inline-flex items-center gap-1">
                          {value} <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <p className="text-xs text-slate-800 whitespace-pre-wrap break-words">{value}</p>
                      )
                    ) : (
                      <p className="text-xs text-slate-300">—</p>
                    )}
                  </div>
                );
              })}
            </div>

            {isEditing && (
              <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                No guardes contraseñas aquí. Compártelas por un canal seguro.
              </p>
            )}

            {/* Archivos */}
            {!isPersonal && (card.files.length > 0 || isStaff) && (
              <div className="border-t border-slate-100 pt-2.5 space-y-1.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Documentos</p>
                {card.files.length === 0 && <p className="text-[11px] text-slate-400">Sin documentos todavía.</p>}
                {card.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between gap-2">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline min-w-0">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </a>
                    {isStaff && (
                      <button type="button" onClick={() => deleteFile(cardId, file.id)} className="text-slate-400 hover:text-red-600 p-1" title="Eliminar archivo">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {isStaff && (
                  <label className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-semibold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-3.5 h-3.5" /> Subir documento (máx. 3 MB)
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) uploadFile(cardId, file);
                      }}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-wrap items-center gap-2 pt-1 mt-auto">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => saveEdit(cardId)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> {isBusy ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => { setEditingId(null); setDraft({}); }}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={!!editingId}
                  onClick={() => startEdit(card)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
              )}
              {isStaff && !isPersonal && card.activatedByStaff && !card.purchased && !isEditing && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => patch(cardId, { activated: false }, 'Tarjeta bloqueada')}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-medium text-slate-500 hover:text-red-600"
                >
                  <Lock className="w-3.5 h-3.5" /> Bloquear
                </button>
              )}
              {card.updatedAt && !isEditing && (
                <span className="text-[10px] text-slate-400 ml-auto">
                  Actualizado {new Date(card.updatedAt).toLocaleDateString('es')}
                  {card.updatedBy ? ` · ${card.updatedBy === 'staff' ? 'Equipo Por Mí' : 'Cliente'}` : ''}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 w-full min-w-0">
      <p className="text-xs text-slate-500">
        {activeCount} de {services.length} servicios activos
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderCard(DATOS_PERSONALES_ID, 'Datos Personales', UserRound, true)}
      </div>

      {PORTAL_SERVICE_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-3">
          <div>
            <h3 className="text-base md:text-lg font-semibold tracking-tight text-slate-900">{section.title}</h3>
            <p className="text-xs text-slate-500">{section.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
            {section.services.map((service) => renderCard(service.id, service.name, service.icon))}
          </div>
        </section>
      ))}
    </div>
  );
}
