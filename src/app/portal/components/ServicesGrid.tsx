'use client';

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal } from "../PortalContext";
import { PORTAL_SERVICE_SECTIONS } from "@/lib/business-services";

const formatUsd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Tienda del portal: los mismos servicios que la tienda pública (/tienda), con el carrito del portal. */
export default function ServicesGrid() {
  const { addToCart, setIsCartOpen, getCartItemQuantity } = usePortal();
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-10 w-full min-w-0">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 w-full">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Tienda Por mí</h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
          Servicios para crear y hacer crecer tu empresa, a un costo inferior al del mercado.
        </p>
      </div>

      {PORTAL_SERVICE_SECTIONS.map((section) => (
      <section key={section.title} className="space-y-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">{section.title}</h3>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">{section.subtitle}</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-5 items-stretch w-full min-w-0">
        {section.services.map((service) => {
          const Icon = service.icon;
          const quantity = getCartItemQuantity(service.id);
          const detailsOpen = !!openDetails[service.id];

          return (
            <div
              key={service.id}
              className="relative group bg-white border border-slate-200 hover:border-slate-300 rounded-[1.5rem] p-4 md:p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 min-w-0"
            >
              {/* Contenido que crece: así todas las tarjetas de una fila miden lo mismo y el precio queda alineado abajo */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2 rounded-xl ${service.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide border ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-1 min-h-[2.5rem]">{service.name}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3 flex-1 font-normal">
                  {service.description}
                </p>

                <p className="text-[11px] text-slate-400 line-through leading-none" title="Precio promedio en el mercado">
                  {formatUsd(service.marketPrice)}{service.priceNote?.startsWith("/") ? ` ${service.priceNote}` : ""}
                </p>
                <div className="flex items-baseline gap-1.5 mb-2.5">
                  {service.priceNote === "Desde" && (
                    <span className="text-[10px] text-slate-400 uppercase">Desde</span>
                  )}
                  <span className="text-xl font-semibold text-slate-900 tracking-tight">{formatUsd(service.price)}</span>
                  <span className="text-[10px] text-slate-400 font-normal uppercase">
                    USD{service.priceNote?.startsWith("/") ? ` ${service.priceNote}` : ""}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setOpenDetails((d) => ({ ...d, [service.id]: !d[service.id] }))}
                    className="w-full py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-between gap-1 text-[10px] font-medium cursor-pointer"
                  >
                    <span>{detailsOpen ? "Ocultar detalles" : "Ver detalles"}</span>
                    <span className="w-4 h-4 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                      {detailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </span>
                  </button>
                  {detailsOpen && (
                    <ul className="space-y-1.5 pt-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-normal">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="w-full pt-1">
                {quantity > 0 ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <Button
                      onClick={() => setIsCartOpen(true)}
                      className="flex-1 h-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 active:scale-95 transition-all text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                      En carrito ({quantity})
                    </Button>
                    <button
                      onClick={() => addToCart(service.id)}
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 cursor-pointer"
                      title="Añadir otro"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(service.id)}
                    className="w-full h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all text-[11px] font-bold tracking-wider uppercase shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    Añadir al carrito
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </section>
      ))}
    </div>
  );
}
