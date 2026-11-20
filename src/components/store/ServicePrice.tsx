import {
  billingLabel,
  formatUsd,
  pricePeriodSuffix,
  type BusinessService,
} from "@/lib/business-services";
import { applyDiscount, getDiscountPercent } from "@/lib/payments/discount-codes";

const CHIP_COLORS = {
  unico: "bg-emerald-50 text-emerald-700 border-emerald-200",
  mensual: "bg-blue-50 text-blue-700 border-blue-200",
  anual: "bg-violet-50 text-violet-700 border-violet-200",
} as const;

/**
 * Precio de un servicio en las tiendas (/tienda y /portal/tienda): tipo de cobro, precio de mercado
 * tachado y el precio (único, o por mes / por año). Con un código de descuento aplicado muestra el precio rebajado y,
 * tachado al lado, el precio normal.
 */
export default function ServicePrice({
  service,
  discountCode = null,
}: {
  service: BusinessService;
  discountCode?: string | null;
}) {
  const suffix = pricePeriodSuffix(service);
  const chip = CHIP_COLORS[service.billing];

  const percent = getDiscountPercent(discountCode);
  const todayPrice = applyDiscount(service.id, service.price, discountCode);
  const hasDiscount = todayPrice < service.price;

  return (
    <div className="mb-2.5">
      <div className="flex flex-wrap items-center gap-1 mb-1.5">
        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border ${chip}`}>
          {billingLabel(service)}
        </span>
        {hasDiscount && (
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-emerald-600 text-white">
            -{Math.round(percent * 100)}% {discountCode}
          </span>
        )}
      </div>
      {service.marketPrice > service.price ? (
        <p className="text-[11px] text-slate-400 line-through leading-none" title="Precio promedio en el mercado">
          {formatUsd(service.marketPrice)}{suffix}
        </p>
      ) : (
        <p className="text-[10px] text-slate-400 leading-none">Precio de referencia en EE. UU.</p>
      )}
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        {service.fromPrice && <span className="text-[10px] text-slate-400 uppercase">Desde</span>}
        <span className={`text-xl font-semibold tracking-tight ${hasDiscount ? "text-emerald-700" : "text-slate-900"}`}>
          {formatUsd(todayPrice)}
        </span>
        <span className="text-[10px] text-slate-400 font-normal uppercase">
          USD{suffix}
        </span>
        {hasDiscount && (
          <span className="text-[11px] text-slate-400 line-through" title="Precio sin descuento">
            {formatUsd(service.price)}
          </span>
        )}
      </div>
      {service.extraNote && (
        <p className="text-[11px] text-slate-500 leading-snug">{service.extraNote}</p>
      )}
    </div>
  );
}
