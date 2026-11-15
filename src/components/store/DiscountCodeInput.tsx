"use client";

import { useId, useState } from "react";
import { Tag, X } from "lucide-react";
import { formatUsd } from "@/lib/business-services";
import { getDiscountPercent, normalizeDiscountCode } from "@/lib/payments/discount-codes";

type Props = {
  /** Código aplicado (ya validado) o null. */
  code: string | null;
  onChange: (code: string | null) => void;
  /** Cuánto se descuenta en el carrito actual (modo carrito). */
  discountUsd?: number;
  /** Ahorro cada mes en mensualidades (modo carrito). */
  monthlyDiscountUsd?: number;
  /** "cart": carrito o pago, muestra el ahorro. "store": encabezado de la tienda, explica dónde aplica. */
  variant?: "cart" | "store";
  /** "dark" para fondos negros (encabezado de /tienda). */
  theme?: "light" | "dark";
  align?: "left" | "center" | "right";
  className?: string;
};

const STORE_HINT =
  "Aplica a pagos únicos y pagos iniciales. En Web y aplicaciones, Publicidad, Para crecer, Escalada mundial, Teléfono + WhatsApp, Impuestos Personales y Agente Registrado también a las mensualidades y suscripciones.";

/** Campo "Tu código de descuento" para la tienda (encabezado), el carrito de /tienda y el pago del portal. */
export default function DiscountCodeInput({
  code,
  onChange,
  discountUsd = 0,
  monthlyDiscountUsd = 0,
  variant = "cart",
  theme = "light",
  align = "right",
  className = "",
}: Props) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dark = theme === "dark";
  const alignText = align === "center" ? "text-center" : align === "left" ? "text-left" : "text-right";
  const alignFlex = align === "center" ? "justify-center" : align === "left" ? "justify-start" : "justify-end";
  const hintColor = dark ? "text-gray-400" : "text-slate-500";

  const apply = () => {
    const valid = normalizeDiscountCode(value);
    if (!valid) {
      setError("Código no válido");
      return;
    }
    setError(null);
    setValue("");
    onChange(valid);
  };

  if (code) {
    const percent = Math.round(getDiscountPercent(code) * 100);
    return (
      <div className={`${alignText} ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
          <Tag className="w-3 h-3" />
          {code} · -{percent}%
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Quitar código de descuento"
            className="text-emerald-500 hover:text-emerald-800 p-0.5 -m-0.5 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
        {variant === "store" ? (
          <p className={`mt-3 text-[11px] leading-relaxed max-w-sm ${align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""} ${hintColor}`}>
            ¡Descuento aplicado! Los precios de abajo ya lo muestran. {STORE_HINT}
          </p>
        ) : (
          <>
            <p className={`mt-1 text-[10px] leading-snug ${hintColor}`}>
              {discountUsd > 0
                ? `Ahorras ${formatUsd(discountUsd)} hoy`
                : "Este carrito no tiene servicios con descuento"}
            </p>
            {monthlyDiscountUsd > 0 && (
              <p className="text-[10px] text-emerald-600 leading-snug">
                y {formatUsd(monthlyDiscountUsd)} / mes en tus mensualidades
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`${alignText} ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className={`flex items-center gap-1.5 ${alignFlex}`}
      >
        <label htmlFor={inputId} className="sr-only">Tu código de descuento</label>
        <input
          id={inputId}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="Tu código de descuento"
          autoCapitalize="characters"
          autoComplete="off"
          className={`w-44 sm:w-52 h-9 px-3.5 rounded-full border text-xs uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 ${
            dark
              ? "bg-white/5 border-white/15 text-white placeholder:text-gray-500"
              : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
          }`}
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className={`h-9 px-4 rounded-full disabled:opacity-40 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
            dark ? "bg-white text-black hover:bg-gray-200" : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          Aplicar
        </button>
      </form>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
      {variant === "store" && !error && (
        <p className={`mt-3 text-[11px] leading-relaxed max-w-sm ${align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""} ${hintColor}`}>{STORE_HINT}</p>
      )}
    </div>
  );
}
