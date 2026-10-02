"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { sendMetaEvent } from "@/lib/meta-events";
import { LATAM_COUNTRIES, type LatamCountry } from "@/lib/latam-countries";
import { getCountryQuestionsLink, getCountrySocialLinks } from "@/lib/country-socials";

export default function ChooseYourPath() {
  const [selectedCountry, setSelectedCountry] = useState<LatamCountry | null>(null);

  const selectCountry = (country: LatamCountry) => {
    setSelectedCountry(country);
    sendMetaEvent('Lead', { source: 'Planes Country', country: country.name });
  };

  return (
    <section id="planes" className="pt-20 md:pt-28 pb-16 md:pb-20 bg-[#050507] relative overflow-hidden font-sans">
      {/* Sutil efecto de cuadrícula de fondo */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Degradado superior para suavizar la unión con el Hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#050507] -translate-y-full" />

      <div className="container max-w-[1500px] mx-auto px-6 relative z-10">

        <div className="mb-12 md:mb-16 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-white leading-tight mb-4">
            Ayúdanos a unir a toda Latinoamérica con tecnología
          </h2>
          <p className="text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Haz clic en tu bandera, se desplegarán algunos enlaces. Haz clic en ellos y únete a la red de empresarios y emprendedores, y accede a servicios tecnológicos para tu negocio.
          </p>
        </div>

        {selectedCountry ? (
          /* País elegido: solo su bandera, sus redes y la cápsula de preguntas */
          <div className="max-w-xl mx-auto flex flex-col items-center text-center">
            <img
              src={`/flags/${selectedCountry.code}.svg`}
              alt={`Bandera de ${selectedCountry.name}`}
              className="w-[120px] h-20 object-cover shadow-lg mb-4"
            />
            <h3 className="text-2xl font-medium text-white tracking-tight mb-8">{selectedCountry.name}</h3>

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 mb-6 block">Síguenos</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5 mb-10">
              {getCountrySocialLinks(selectedCountry.code, selectedCountry.name).map((social) => (
                <a
                  key={social.network}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendMetaEvent('Lead', { source: 'Planes Country Social', country: selectedCountry.name, network: social.label })}
                  className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1"
                >
                  <img
                    src={social.imgSrc}
                    alt={social.label}
                    className="w-10 h-10 shrink-0 rounded-lg object-cover border border-white/10 shadow-sm transition-all duration-300 group-hover:border-white/40"
                  />
                  <span className="text-[11px] font-medium text-gray-400 group-hover:text-white uppercase tracking-wider">{social.label}</span>
                </a>
              ))}
            </div>

            <a
              href={getCountryQuestionsLink(selectedCountry.code)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendMetaEvent('Contact', { source: 'Planes Country WhatsApp Button', country: selectedCountry.name })}
              className="inline-flex items-center justify-center px-8 py-3 text-sm sm:text-base font-medium text-white rounded-full bg-transparent border border-white/40 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-500 hover:border-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
            >
              Tengo preguntas antes de empezar
            </a>

            <button
              type="button"
              onClick={() => setSelectedCountry(null)}
              className="mt-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Elegir otro país
            </button>
          </div>
        ) : (
        /* Países de Latinoamérica (misma lista que el menú Comunidad) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
          {LATAM_COUNTRIES.map((country) => (
            <button
              type="button"
              key={country.code}
              onClick={() => selectCountry(country)}
              className="text-left group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-black border border-white/10 ring-1 ring-white/5 hover:border-white/30 hover:bg-white/[0.03] transition-all duration-300"
            >
              <img
                src={`/flags/${country.code}.svg`}
                alt={`Bandera de ${country.name}`}
                loading="lazy"
                className="w-12 h-8 md:w-[60px] md:h-10 object-cover shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-sm md:text-base font-medium text-slate-200 group-hover:text-white transition-colors truncate">
                {country.name}
              </span>
            </button>
          ))}
        </div>
        )}

        <p className="mt-12 md:mt-16 text-base text-slate-400 max-w-3xl mx-auto leading-relaxed text-center">
          Contamos con miles de empresarios e inversionistas en todo tipo de proyectos, y somos la primera comunidad que ayudará a crear los próximos millonarios de <span className="text-white font-medium">The New Technological Republic</span>.
        </p>

      </div>
    </section>
  );
}
