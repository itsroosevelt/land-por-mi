"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check, ChevronDown, ChevronUp, ShoppingCart, X, ArrowRight, ShieldCheck, CheckCircle2,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { sendMetaEvent } from "@/lib/meta-events";
import { calculateStripeProcessingFee } from "@/lib/payments/product-catalog";
import { PORTAL_SERVICES, PORTAL_SERVICE_SECTIONS, type BusinessService } from "@/lib/business-services";
import { readPendingCart, savePendingCart } from "@/lib/pending-cart";

const formatUsd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function TiendaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stripeStatus = searchParams.get("stripe");
  const [cart, setCart] = useState<string[]>([]);
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const toggleCart = (service: BusinessService) => {
    setCart((current) => {
      if (current.includes(service.id)) return current.filter((id) => id !== service.id);
      sendMetaEvent("AddToCart", { source: "Tienda", item_id: service.id, value: service.price, currency: "USD" });
      return [...current, service.id];
    });
  };

  const cartServices = PORTAL_SERVICES.filter((s) => cart.includes(s.id));
  const subtotal = cartServices.reduce((sum, s) => sum + s.price, 0);
  const processingFee = calculateStripeProcessingFee(subtotal);

  // El carrito se guarda en el navegador: si la persona se va y vuelve, sigue ahí,
  // y al registrarse o iniciar sesión el portal lo pasa a su carrito.
  const [cartLoaded, setCartLoaded] = useState(false);
  useEffect(() => {
    const valid = new Set(PORTAL_SERVICES.map((s) => s.id));
    setCart(readPendingCart().filter((id) => valid.has(id)));
    setCartLoaded(true);
  }, []);
  useEffect(() => {
    if (cartLoaded) savePendingCart(cart);
  }, [cart, cartLoaded]);

  // Para pagar siempre hay que registrarse o iniciar sesión (objetivo principal: capturar el registro).
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    savePendingCart(cart);
    sendMetaEvent("InitiateCheckout", { source: "Tienda", item_ids: cart.join(","), value: subtotal, currency: "USD" });
    router.push("/login?register=true");
  };

  return (
    <div className="min-h-screen bg-black font-sans">
      <Header />

      {/* Encabezado */}
      <section className="bg-black text-white pt-32 pb-8 md:pt-40 md:pb-10 px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400 mb-4">Tienda · Por Mí</p>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-[1.05]">
          Servicios para tu{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-600">empresa</span>
        </h1>
        <p className="mt-5 text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Todo lo que necesitas para crear y hacer crecer tu negocio, a un costo inferior al del mercado.
          Añade los servicios que necesitas al carrito y paga de forma segura.
        </p>
      </section>

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-12 md:py-16 pb-40">
        {stripeStatus === "success" && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong className="font-semibold">¡Pago recibido!</strong> Gracias por tu compra. Nuestro equipo te
              contactará en menos de 24 horas para empezar.
            </p>
          </div>
        )}
        {stripeStatus === "cancelled" && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-gray-300 text-sm">
            El pago fue cancelado. Tus servicios no se cobraron; puedes volver a intentarlo cuando quieras.
          </div>
        )}

        {/* Mismos servicios y secciones que la tienda del portal */}
        <div className="space-y-14">
        {PORTAL_SERVICE_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-5">
          <div>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-white">{section.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{section.subtitle}</p>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
          {section.services.map((service) => {
            const Icon = service.icon;
            const inCart = cart.includes(service.id);
            const detailsOpen = !!openDetails[service.id];
            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-[1.5rem] p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`p-2 rounded-xl ${service.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide border ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1 min-h-[2.5rem]">{service.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3 flex-1">{service.description}</p>

                  <p className="text-[11px] text-slate-400 line-through leading-none" title="Precio promedio en el mercado">
                    {formatUsd(service.marketPrice)}{service.priceNote?.startsWith("/") ? ` ${service.priceNote}` : ""}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-2.5">
                    {service.priceNote === "Desde" && (
                      <span className="text-[10px] text-slate-400 uppercase">Desde</span>
                    )}
                    <span className="text-xl font-semibold text-slate-900 tracking-tight">{formatUsd(service.price)}</span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      USD{service.priceNote?.startsWith("/") ? ` ${service.priceNote}` : ""}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setOpenDetails((d) => ({ ...d, [service.id]: !d[service.id] }))}
                      className="w-full py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600 hover:text-slate-900 transition-all flex items-center justify-between gap-1 text-[10px] font-medium"
                    >
                      <span>{detailsOpen ? "Ocultar detalles" : "Ver detalles"}</span>
                      <span className="w-4 h-4 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                        {detailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </span>
                    </button>
                    {detailsOpen && (
                      <ul className="space-y-1.5 pt-2">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCart(service)}
                  className={`w-full h-10 rounded-full text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    inCart
                      ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                  }`}
                >
                  {inCart ? (<><Check className="w-3.5 h-3.5" /> En el carrito · Quitar</>) : "Añadir al carrito"}
                </button>
              </div>
            );
          })}
        </div>
        </section>
        ))}
        </div>
      </main>

      {/* Carrito flotante */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4">
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  {cart.length} {cart.length === 1 ? "servicio" : "servicios"} en tu carrito
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cartServices.map((s) => (
                    <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-700">
                      {s.name}
                      <button type="button" onClick={() => toggleCart(s)} aria-label={`Quitar ${s.name}`} className="text-slate-400 hover:text-slate-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Subtotal</p>
                <p className="text-xl font-semibold text-slate-900 tracking-tight">{formatUsd(subtotal)}</p>
                {processingFee > 0 && (
                  <p className="text-[10px] text-slate-400">+ {formatUsd(processingFee)} procesamiento</p>
                )}
              </div>
            </div>


            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="mt-4 w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {checkoutLoading ? "Llevándote al registro..." : "Regístrate o ingresa para pagar"}
              {!checkoutLoading && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="mt-2 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Tu carrito se guarda: lo pagas de forma segura dentro de la plataforma Por Mí
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function TiendaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <TiendaContent />
    </Suspense>
  );
}
