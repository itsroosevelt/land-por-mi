"use client";

import Link from 'next/link';
import Image from 'next/image';
import { sendMetaEvent } from "@/lib/meta-events";
import { DEFAULT_QUESTIONS_LINK, getCountryQuestionsLink } from "@/lib/country-socials";

// Por ahora todas las redes llevan al grupo general de WhatsApp de la comunidad.
const COMMUNITY_LINK = DEFAULT_QUESTIONS_LINK;

const socials = [
  { label: "Facebook", imgSrc: "/assets/f.jpg" },
  { label: "Instagram", imgSrc: "/assets/i.jpg" },
  { label: "WhatsApp", imgSrc: "/assets/w.jpg" },
  { label: "X", imgSrc: "/assets/x.jpg" },
  { label: "YouTube", imgSrc: "/assets/y.jpg" },
  { label: "TikTok", imgSrc: "/assets/t.jpg" },
];

const granColombia = [
  { name: "Ecuador", code: "ec" },
  { name: "Colombia", code: "co" },
  { name: "Venezuela", code: "ve" },
  { name: "Panamá", code: "pa" },
];

const linkClass = "hover:text-white transition-colors";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Marca */}
          <div className="md:col-span-1">
            <p className="text-white text-2xl font-medium tracking-tight">
              Conectamos personas. Creamos oportunidades. Construimos prosperidad.
            </p>
            <div className="mt-8">
              <div className="w-16 h-16 overflow-hidden rounded-full bg-black mb-4">
                <img src="/icons/logo-por-mi-america.webp" loading="lazy" alt="Por Mí | The New Technological Republic" className="w-full h-full object-cover object-center" />
              </div>
              <p className="text-gray-500 text-sm">
                Por Mí | The New Technological Republic.
                <br />
                Una nueva generación. Un modelo republicano.
                <br />
                Una alianza para la prosperidad de Occidente.
              </p>
            </div>
          </div>

          {/* La República + Legal */}
          <div className="mb-24">
            <h4 className="font-medium mb-3 text-sm text-slate-200">The New Technological Republic</h4>
            <ul className="text-gray-400 space-y-2 text-sm mb-4">
              <li><Link href="/#vision" className={linkClass}>La Gran Colombia resurgirá</Link></li>
              <li><Link href="/#modelo" className={linkClass}>Modelo Republicano</Link></li>
              <li><Link href="/#america" className={linkClass}>Toda América somos Uno</Link></li>
              <li><Link href="/#faqs" className={linkClass}>Preguntas Frecuentes</Link></li>
            </ul>

            <h4 className="font-medium mt-16 mb-3 text-sm text-slate-200">Legal</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li><Link href="/privacidad" className={linkClass}>Política de Privacidad</Link></li>
              <li><Link href="/terminos" className={linkClass}>Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Servicios + Contacto */}
          <div className="mb-24">
            <h4 className="font-medium mb-3 text-sm text-slate-200">Servicios para tu Empresa</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li><Link href="/#servicios" className={linkClass}>Creación de tu empresa</Link></li>
              <li><Link href="/#servicios" className={linkClass}>Redes sociales y publicidad</Link></li>
              <li><Link href="/#servicios" className={linkClass}>Sitio web, logo y marca</Link></li>
              <li><Link href="/#servicios" className={linkClass}>Logística</Link></li>
              <li><Link href="/tienda" className={linkClass}>Tienda</Link></li>
            </ul>

            <h4 className="font-medium mt-16 mb-3 text-sm text-slate-200">Contacto</h4>
            <ul className="text-gray-400 space-y-2 text-sm mt-auto">
              <li className="flex flex-col gap-1.5 text-xs">
                <span className="block">
                  ✉️{' '}
                  <a
                    href="mailto:roosevelt@luxorintelligence.com"
                    onClick={() => sendMetaEvent('Contact', { source: 'Footer Email' })}
                    className="text-blue-400 hover:underline break-all"
                  >
                    roosevelt@luxorintelligence.com
                  </a>
                </span>
                <span className="block">
                  📞{' '}
                  <a
                    href="https://wa.me/13859779375"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sendMetaEvent('Contact', { source: 'Footer WhatsApp' })}
                    className="text-blue-400 hover:underline"
                  >
                    +1 385 977 9375
                  </a>
                </span>
                <span className="text-gray-400 block">📍 Salt Lake City, Utah</span>
              </li>
            </ul>
          </div>

          {/* La Nueva Gran Colombia + Plataforma */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-slate-200">La Nueva Gran Colombia</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              {granColombia.map((country) => (
                <li key={country.code}>
                  <a
                    href={getCountryQuestionsLink(country.code)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sendMetaEvent('Lead', { source: 'Footer Country Group', country: country.name })}
                    className={`${linkClass} inline-flex items-center gap-2`}
                  >
                    <img src={`/flags/${country.code}.svg`} alt="" loading="lazy" className="w-5 h-[13px] object-cover" />
                    Comunidad {country.name}
                  </a>
                </li>
              ))}
              <li><Link href="/#planes" className={linkClass}>Todos los países</Link></li>
            </ul>

            <h4 className="font-medium mt-16 mb-3 text-sm text-slate-200">Plataforma Por Mí</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li><Link href="/login?register=true" className={`${linkClass} font-medium text-white`}>Ingresa a la plataforma</Link></li>
              <li><Link href="/portal/streaming" className={linkClass}>Por Mí Streaming</Link></li>
            </ul>
          </div>

          {/* Síguenos */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-slate-200">Síguenos</h4>
            <div className="flex flex-wrap gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={COMMUNITY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendMetaEvent('Lead', { source: 'Footer Social Icon', network: social.label })}
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image src={social.imgSrc} alt={social.label} width={32} height={32} style={{ height: 'auto' }} className="rounded-md" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="items-center flex mt-20 flex-col md:flex-row gap-4">
          <Link href="/" className="text-white text-lg font-semibold hover:text-white transition-colors tracking-tighter shrink-0">POR MÍ</Link>
          <div className="flex justify-center space-x-6 w-full flex-wrap">
            <Link href="/#vision" className="text-gray-400 hover:text-white transition-colors text-xs">The New Technological Republic</Link>
            <Link href="/tienda" className="text-gray-400 hover:text-white transition-colors text-xs">Tienda</Link>
            <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors text-xs">Privacidad</Link>
            <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors text-xs">Términos</Link>
          </div>
          <div className="text-gray-600 text-[10px] w-full text-center md:text-right">
            © {new Date().getFullYear()} Luxor Intelligence LLC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
