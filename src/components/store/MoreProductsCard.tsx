"use client";

import { ChevronUp, Plus } from "lucide-react";

/**
 * Tarjeta transparente al final de cada sección de las tiendas: muestra u oculta los productos
 * marcados con `more` en business-services.ts. `tone` según el fondo: oscuro (/tienda) o claro (portal).
 */
export default function MoreProductsCard({
  count,
  open,
  onToggle,
  tone,
}: {
  count: number;
  open: boolean;
  onToggle: () => void;
  tone: "dark" | "light";
}) {
  if (count === 0) return null;
  const colors =
    tone === "dark"
      ? "border-white/25 text-white hover:border-white/50 hover:bg-white/5"
      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50";
  const circle = tone === "dark" ? "border-white/30" : "border-slate-300";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={`min-h-[12rem] h-full rounded-[1.5rem] border-2 border-dashed bg-transparent p-5 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer ${colors}`}
    >
      <span className={`w-11 h-11 rounded-full border flex items-center justify-center ${circle}`}>
        {open ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </span>
      <span className="text-sm font-semibold">{open ? "Ver menos productos" : "Ver más productos"}</span>
      {!open && (
        <span className="text-[11px] opacity-70">
          {count} {count === 1 ? "producto más" : "productos más"} en esta categoría
        </span>
      )}
    </button>
  );
}
