"use client";

import { usePortal } from "../PortalContext";
import ExpedienteCards from "@/components/expediente/ExpedienteCards";
import { authFetch } from "@/lib/auth-fetch";

/**
 * Mi proceso: el expediente de la empresa del cliente.
 * Datos Personales + una tarjeta por cada servicio de la tienda (abiertas las compradas
 * o activadas por el staff). Son las mismas tarjetas que el staff ve en el expediente.
 */
export default function ProcesoPage() {
  const { user } = usePortal();
  const email = (user?.email || "").toLowerCase().trim();

  return (
    <div className="w-full min-w-0 max-w-[1600px] mx-auto space-y-8 pb-12">
      <div className="space-y-1 border-b border-slate-200 pb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Mi proceso</h1>
        <p className="text-sm text-slate-500 max-w-3xl">
          Aquí está toda la información de tu empresa, organizada por servicio. Nuestro equipo la va completando
          mientras trabaja contigo, y tú también puedes agregar datos con el botón Editar.
        </p>
      </div>

      {email ? (
        <ExpedienteCards email={email} mode="client" request={authFetch} />
      ) : (
        <p className="text-sm text-slate-500">Inicia sesión para ver tu expediente.</p>
      )}
    </div>
  );
}
