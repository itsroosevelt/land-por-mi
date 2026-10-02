'use client';

import Link from 'next/link';
import { ArrowRight, ListChecks, ShoppingBag, Radio, Gift, MessageCircle, type LucideIcon } from 'lucide-react';
import { usePortal } from '../PortalContext';

interface PlatformSection {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

// Lo que la persona encuentra en el menú lateral del portal.
const sections: PlatformSection[] = [
  {
    title: 'Mi proceso',
    description: 'Sigue paso a paso el avance de tus servicios y lo que falta para completar cada uno.',
    href: '/portal/proceso',
    icon: ListChecks,
  },
  {
    title: 'Tienda',
    description:
      'Crea tu empresa en Estados Unidos, tu sitio web, tu identidad visual, campañas publicitarias, redes sociales, impuestos y más, a un costo inferior al del mercado.',
    href: '/portal/tienda',
    icon: ShoppingBag,
  },
  {
    title: 'Adaptación streaming',
    description:
      'Entrevistas con empresarios e inversionistas, masterclasses y contenido sobre tecnología, inteligencia artificial y finanzas descentralizadas.',
    href: '/portal/streaming',
    icon: Radio,
  },
  {
    title: 'Referidos',
    description: 'Invita a otros emprendedores a la red y crece junto a ellos.',
    href: '/portal/referidos',
    icon: Gift,
  },
  {
    title: 'Soporte',
    description: 'Escríbenos por WhatsApp o agenda una videollamada cuando lo necesites. Te acompañamos en cada paso.',
    href: '/portal/soporte',
    icon: MessageCircle,
  },
];

export default function BienvenidoPage() {
  const { user } = usePortal();

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'emprendedor';

  return (
    <div className="w-full min-w-0 max-w-[1600px] mx-auto space-y-12 pb-12 pt-2 md:pt-6 animate-in fade-in duration-500">
      {/* Saludo */}
      <div className="space-y-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">The New Technological Republic</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          ¡Bienvenido a Por Mí, {userName}!
        </h1>
        <div className="space-y-3 text-slate-600 text-sm md:text-base leading-relaxed max-w-4xl mx-auto">
          <p>
            Nos alegra mucho tenerte aquí. Por Mí es la plataforma de The New Technological Republic: el lugar donde
            emprendedores y empresarios de toda Latinoamérica encuentran todo lo necesario para crear, organizar y hacer
            crecer sus negocios, con el respaldo de la tecnología, la inteligencia artificial y las finanzas
            descentralizadas creadas en los Estados Unidos.
          </p>
          <p>
            Aquí puedes aprender a hacerlo todo por ti mismo con nuestras guías paso a paso, o dejar que nuestro equipo lo
            haga por ti. Tú decides cómo avanzar; nosotros te acompañamos en cada etapa.
          </p>
        </div>
      </div>

      {/* Lo que vas a encontrar */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight text-center">En tu plataforma vas a encontrar</h2>
        <div className="flex flex-wrap justify-center gap-4 xl:grid xl:grid-cols-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-auto bg-white border border-slate-200 hover:border-slate-300 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  {section.title}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Cierre */}
      <div className="rounded-[1.5rem] bg-slate-900 text-white p-6 md:p-10 space-y-6 text-center">
        <p className="text-lg md:text-xl font-medium tracking-tight leading-snug max-w-3xl mx-auto">
          Mírate al espejo y recuerda que todo esto lo haces por ti: por tu felicidad y por tu vida.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/portal/tienda"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Ver la tienda <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/portal/proceso"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Ir a Mi proceso
          </Link>
        </div>
      </div>
    </div>
  );
}
