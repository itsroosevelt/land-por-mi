"use client";

import { useId, useState } from "react";
import { PenLine, ShoppingCart } from "lucide-react";
import {
  buildCustomChargeId,
  CUSTOM_CHARGE_BILLING_LABEL,
  CUSTOM_CHARGE_MAX_USD,
  CUSTOM_CHARGE_MIN_USD,
  type CustomChargeBilling,
} from "@/lib/payments/custom-charge";
import { formatUsd } from "@/lib/business-services";

const OPTIONS: CustomChargeBilling[] = ["unico", "mensual", "anual"];
const SUFFIX: Record<CustomChargeBilling, string> = { unico: "", mensual: " / mes", anual: " / año" };

/**
 * Tarjeta "Cobro Personalizado" de las tiendas: se escribe el monto acordado, se elige si es pago
 * único o suscripción mensual / anual, y se agrega al carrito como cualquier otro servicio.
 */
export default function CustomChargeCard({ onAdd }: { onAdd: (itemId: string) => void }) {
  const inputId = useId();
  const [amount, setAmount] = useState("");
  const [billing, setBilling] = useState<CustomChargeBilling>("unico");
  const [added, setAdded] = useState(false);

  // Punto para centavos y coma (opcional) para miles: "1500", "1,500.50". "1.500" o "12,5" no valen,
  // para que nadie cobre $1.50 creyendo que son $1,500.
  const text = amount.trim();
  const wellFormed = /^(\d{1,3}(,\d{3})+|\d+)(\.\d{1,2})?$/.test(text);
  const value = wellFormed ? Number(text.replace(/,/g, "")) : NaN;
  const itemId = wellFormed ? buildCustomChargeId(billing, value) : null;
  const showError = amount.trim() !== "" && !itemId;

  const add = () => {
    if (!itemId) return;
    onAdd(itemId);
    setAmount("");
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-[1.5rem] p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
          <PenLine className="w-5 h-5" />
        </div>
        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide border bg-slate-100 text-slate-700 border-slate-200">
          Personalizado
        </span>
      </div>

      <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1">Cobro Personalizado</h3>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
        Para precios especiales acordados con nuestro equipo. Escribe el monto, elige cómo se cobra y agrégalo al carrito.
      </p>

      <label htmlFor={inputId} className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
        Monto en USD
      </label>
      <div className="relative mb-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
        <input
          id={inputId}
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <p className={`text-[10px] mb-2 min-h-[1rem] ${showError ? "text-red-600" : "text-slate-400"}`}>
        {showError
          ? wellFormed
            ? `Escribe un monto entre ${formatUsd(CUSTOM_CHARGE_MIN_USD)} y ${formatUsd(CUSTOM_CHARGE_MAX_USD)}`
            : "Usa punto para los centavos: 1500 o 1,500.50"
          : "Se suma la comisión de procesamiento de Stripe al pagar"}
      </p>

      <div role="radiogroup" aria-label="Cómo se cobra" className="grid grid-cols-3 gap-1 mb-3">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={billing === option}
            onClick={() => setBilling(option)}
            className={`px-1.5 py-1.5 rounded-lg border text-[10px] font-semibold leading-tight transition-colors cursor-pointer ${
              billing === option
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {CUSTOM_CHARGE_BILLING_LABEL[option]}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-slate-500 leading-snug mb-3 flex-1">
        {billing === "unico"
          ? "Se cobra una sola vez."
          : `Se cobra hoy y luego automáticamente en la misma tarjeta cada ${billing === "mensual" ? "mes" : "año"}.`}
        {itemId && (
          <span className="block font-semibold text-slate-900 mt-1">
            {formatUsd(value)} USD{SUFFIX[billing]}
          </span>
        )}
      </p>

      <button
        type="button"
        onClick={add}
        disabled={!itemId}
        className="w-full h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        {added ? "Agregado al carrito" : "Agregar al carrito"}
      </button>
    </div>
  );
}
