"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, Lock, GraduationCap, Plane, Home as HomeIcon,
  Briefcase, Globe, CreditCard, Car, Smartphone, FileText, Heart,
  ArrowRight, Star, Gift, Building2, Book, ShieldCheck, Map, LayoutGrid, Users, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { sendMetaEvent } from "@/lib/meta-events";
import { LATAM_COUNTRIES, type LatamCountry } from "@/lib/latam-countries";

// --- TIPOS DE DATOS ---
type SubItem = {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  colorClass: string;
};

type SocialItem = {
  label: string;
  href: string;
  imgSrc: string;
};

type MenuItemData = {
  label: string;
  href?: string;
  megaMenu?: {
    title: string;
    description: string;
    actionText: string;
    actionHref: string;
    items: SubItem[];
    socials?: SocialItem[];
    countries?: LatamCountry[];
  };
};

// --- DATA DEL MENÚ ---
const menuData: MenuItemData[] = [
  {
    label: "COMUNIDAD",
    megaMenu: {
      title: "Nuestra Comunidad",
      description: "Únete a la red Por mí y aprovecha beneficios exclusivos.",
      actionText: "Unirme ahora",
      actionHref: "/contact",
      items: [],
      countries: LATAM_COUNTRIES,
      socials: [
        { label: "Facebook", href: "https://www.facebook.com/udreamms/", imgSrc: "/assets/f.jpg" },
        { label: "Instagram", href: "https://www.instagram.com/udreamms/", imgSrc: "/assets/i.jpg" },
        { label: "WhatsApp", href: "https://wa.me/13858882799?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n", imgSrc: "/assets/w.jpg" },
        { label: "X", href: "https://x.com/udreamms", imgSrc: "/assets/x.jpg" },
        { label: "YouTube", href: "https://www.youtube.com/@udreamms", imgSrc: "/assets/y.jpg" },
        { label: "TikTok", href: "https://www.tiktok.com/@udreamms", imgSrc: "/assets/t.jpg" },
      ]
    }
  },
  { label: "FAQS", href: "/#faqs" },
  { label: "LUXOR", href: "/luxor" },
  // TODO: definir los enlaces de Excelsior y STABLECOIN
  { label: "EXCELSIOR", href: "#" },
  { label: "STABLECOIN", href: "#" },
];

export default function Header() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Determinar si es una página de "landing de visa"
  const isVisaLandingPage = [
    "/visas/student",
    "/visas/tourist"
  ].includes(pathname);

  useEffect(() => {
    // En la home la barra se mantiene transparente mientras esté sobre el video del hero.
    const isHome = pathname === "/";
    const handleScroll = () => {
      const threshold = isHome ? window.innerHeight - 56 : 10;
      setIsScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  const handleMouseEnter = (label: string) => {
    if (isVisaLandingPage) return; // No mostrar mega menu en landings de visa
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };


  return (
    <>
      {/* --- NAVBAR PRINCIPAL --- */}
      <header
        className={`${isVisaLandingPage ? "absolute" : "fixed"} top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${!isVisaLandingPage && (isScrolled || activeMenu) ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent border-b border-transparent"
          }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full px-4 md:px-8 lg:px-12 h-14 flex items-center justify-between relative">

          {/* GRUPO IZQUIERDA: LOGO + NAV */}
          <div className="flex items-center gap-4 lg:gap-12 h-full">
            <Link href="/" className="flex items-center gap-2.5 z-50 shrink-0 group">
              <div className="relative w-8 h-8 overflow-hidden rounded-full bg-black shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-transform duration-300 group-hover:scale-110">
                <img src="/icons/logo-por-mi.webp" alt="Por mí" className="w-full h-full object-cover object-center" />
              </div>
              <span className="text-lg font-semibold tracking-tighter text-white group-hover:text-white transition-colors">POR MÍ</span>
            </Link>

            {/* DESKTOP NAV - Ocultar en landings de visa */}
            {!isVisaLandingPage && (
              <nav className="hidden lg:flex items-center h-full">
                {menuData.map((item) => (
                  <div
                    key={item.label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => item.megaMenu && handleMouseEnter(item.label)}
                  >
                    <Link
                      href={item.href || "#"}
                      {...(item.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`
                        px-3 py-1.5 text-[12px] xl:text-[13px] font-semibold tracking-tight transition-all duration-300 flex items-center gap-1.5 rounded-full hover:bg-white/5
                        ${activeMenu === item.label ? "text-white bg-white/5" : "text-white/80 hover:text-white"}

                      `}
                    >
                      {item.label}
                      {item.megaMenu && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 ${activeMenu === item.label ? "rotate-180 opacity-100" : ""}`} />
                      )}
                    </Link>
                  </div>
                ))}
                <Link
                  href="/staff"
                  className="px-3 py-1.5 text-[12px] xl:text-[13px] font-semibold tracking-tight transition-all duration-300 flex items-center gap-1.5 rounded-full hover:bg-white/5 text-white/80 hover:text-white"
                >
                  <Lock className="w-3 h-3" /> STAFF
                </Link>
              </nav>
            )}
          </div>

          {/* GRUPO DERECHA: ACCIONES */}
          <div className="hidden lg:flex items-center gap-3 z-50">
            <Link href="/tienda">
              <Button className="bg-transparent text-white border border-white/60 hover:bg-white/10 hover:border-white rounded-full h-9 w-32 px-0 font-semibold text-xs transition-all duration-300 hover:scale-105">
                Tienda
              </Button>
            </Link>

            <Link href="/login">
              <Button className="bg-white text-black hover:bg-white/90 rounded-full h-9 w-32 px-0 font-semibold text-xs transition-all duration-300 hover:scale-105 shadow-md">
                Comenzar
              </Button>
            </Link>
          </div>

          {/* MOBILE & TABLET ACTIONS */}
          {!isVisaLandingPage && (
            <div className="lg:hidden flex items-center gap-2 z-50">
              <Link href="/tienda" className="shrink-0">
                <Button className="bg-transparent text-white border border-white/60 hover:bg-white/10 rounded-full h-8 w-24 px-0 font-semibold text-xs transition-all duration-300 active:scale-95">
                  Tienda
                </Button>
              </Link>
              <Link href="/login" className="shrink-0">
                <Button className="bg-white text-black hover:bg-white/90 rounded-full h-8 w-24 px-0 font-semibold text-xs transition-all duration-300 active:scale-95 shadow-md">
                  Comenzar
                </Button>
              </Link>
              <button
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Abrir menú de navegación"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* --- MEGA MENU DESKTOP --- */}
          <AnimatePresence>
            {!isVisaLandingPage && activeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 shadow-2xl overflow-hidden"
                style={{ height: "auto" }}
              >
                {menuData.map((item) => (
                  item.label === activeMenu && item.megaMenu && (
                    <div key={item.label} className="w-full px-6 md:px-12 py-12">

                      {/* GRID LAYOUT: LEFT (Intro) - MIDDLE (Items) - RIGHT (Socials) */}
                      <div className="grid grid-cols-12 gap-12">

                        {/* COL 1: INTRO (3 cols) */}
                        <div className="col-span-3 pr-6 border-r border-white/5 flex flex-col justify-between">
                          <div>
                            <h3 className="text-3xl font-medium text-white mb-4 tracking-tight leading-tight">
                              {item.megaMenu.title}
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                              {item.megaMenu.description}
                            </p>
                          </div>
                          <Link href={item.megaMenu.actionHref}>
                            <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full gap-3 pl-6 pr-4 h-12 w-full justify-between group transition-all">
                              {item.megaMenu.actionText}
                              <div className="bg-white text-black rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            </Button>
                          </Link>
                        </div>

                        {/* COL 2: ITEMS (Width depends on socials presence) */}
                        <div className={`${item.megaMenu.socials ? 'col-span-7 border-r border-white/5 pr-8' : 'col-span-9'}`}>
                          <div className={`${item.label === 'Visas' ? 'grid grid-cols-3 gap-6' : 'grid grid-cols-2 gap-8'}`}>
                            {item.megaMenu.items.map((subItem, idx) => (
                              <Link
                                key={idx}
                                href={subItem.href}
                                className={`group flex items-start ${item.label === 'Visas' ? 'gap-4 p-4 rounded-2xl' : 'gap-5 p-5 rounded-[1.5rem]'} transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-white/5 bg-white/[0.01]`}
                              >
                                <div className={`${item.label === 'Visas' ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-2xl'} flex items-center justify-center shrink-0 border border-white/5 transition-transform group-hover:scale-110 duration-300 ${subItem.colorClass}`}>
                                  <subItem.icon className={`${item.label === 'Visas' ? 'w-5 h-5' : 'w-6 h-6'}`} strokeWidth={2} />
                                </div>
                                <div className="flex flex-col">
                                  <div className={`text-white font-medium ${item.label === 'Visas' ? 'text-sm mb-0.5' : 'text-lg mb-1'} group-hover:text-white transition-colors flex items-center gap-2`}>
                                    {subItem.title}
                                  </div>
                                  <p className={`text-gray-500 font-medium leading-tight group-hover:text-gray-400 ${item.label === 'Visas' ? 'text-xs' : 'text-sm leading-normal'}`}>
                                    {subItem.desc}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {item.megaMenu.countries && (
                            <div className={item.megaMenu.items.length ? "mt-8 pt-6 border-t border-white/5" : ""}>
                              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 mb-4 block">Países</span>
                              <div className="grid grid-cols-4 gap-2">
                                {item.megaMenu.countries.map((country) => (
                                  <Link
                                    key={country.code}
                                    href="/contact"
                                    className="group flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                                  >
                                    <img
                                      src={`/flags/${country.code}.svg`}
                                      alt={`Bandera de ${country.name}`}
                                      className="w-[30px] h-5 object-cover shrink-0 shadow-sm"
                                    />
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">{country.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* COL 3: SOCIALS (2 cols - Only if they exist) */}
                        {item.megaMenu.socials && (
                          <div className="col-span-2 pl-2 flex flex-col justify-center">
                            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 mb-6 block">Síguenos</span>
                            <div className="flex flex-col gap-4">
                              {item.megaMenu.socials.map((social, idx) => (
                                <a
                                  key={idx}
                                  href={social.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => social.label === 'WhatsApp' && sendMetaEvent('Lead', { source: 'Header MegaMenu WhatsApp' })}
                                  className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1"
                                >
                                  <div className="relative w-8 h-8 shrink-0">
                                    <img
                                      src={social.imgSrc}
                                      alt={social.label}
                                      className="w-full h-full rounded-lg object-cover border border-white/10 shadow-sm transition-all duration-300 group-hover:border-primary/50"
                                    />
                                  </div>
                                  <span className="text-[11px] font-medium text-gray-400 group-hover:text-white uppercase tracking-wider">{social.label}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {!isVisaLandingPage && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black lg:hidden overflow-y-auto pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="p-6 max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-medium text-white tracking-tight">POR MÍ</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {menuData.map((item) => (
                  <div key={item.label} className="border-b border-white/10 pb-4">
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-2xl font-medium text-white mb-4 block tracking-tight hover:text-white/80 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-2xl font-medium text-white mb-4 block tracking-tight">{item.label}</span>
                    )}
                    {item.megaMenu && (
                      <div className="grid grid-cols-1 gap-3 pl-2">
                        {item.megaMenu.items.map((subItem, idx) => (
                          <Link
                            key={idx}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3.5 py-2.5 px-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors"
                          >
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${subItem.colorClass}`}>
                              <subItem.icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-200 font-medium text-base">{subItem.title}</span>
                              <span className="text-gray-400 text-xs">{subItem.desc}</span>
                            </div>
                          </Link>
                        ))}

                        {item.megaMenu.countries && (
                          <div className={`grid grid-cols-2 gap-1 ${item.megaMenu.items.length ? "mt-4 pt-4 border-t border-white/5" : ""}`}>
                            {item.megaMenu.countries.map((country) => (
                              <Link
                                key={country.code}
                                href="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                              >
                                <img
                                  src={`/flags/${country.code}.svg`}
                                  alt={`Bandera de ${country.name}`}
                                  className="w-[30px] h-5 object-cover shrink-0 shadow-sm"
                                />
                                <span className="text-gray-300 text-sm truncate">{country.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {item.megaMenu.socials && (
                          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                            {item.megaMenu.socials.map((social, idx) => (
                              <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 p-3 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                                <img src={social.imgSrc} alt={social.label} className="w-10 h-10 rounded-xl object-cover" />
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{social.label}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 space-y-3">
                  <Link href="/login?register=true" onClick={() => setIsMobileMenuOpen(false)} className="w-full block">
                    <Button className="w-full bg-white text-black hover:bg-white/90 h-12 text-sm font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-transform">
                      Comenzar / Registrarse
                    </Button>
                  </Link>
                  <Link href="/login?mode=login" onClick={() => setIsMobileMenuOpen(false)} className="w-full block">
                    <Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 h-12 text-sm font-medium rounded-2xl active:scale-[0.98] transition-transform">
                      Ya tengo cuenta (Iniciar Sesión)
                    </Button>
                  </Link>
                  <Link href="/staff" onClick={() => setIsMobileMenuOpen(false)} className="w-full block text-center pt-2">
                    <span className="text-xs text-gray-400 hover:text-white uppercase tracking-widest inline-flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Acceso Staff
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
