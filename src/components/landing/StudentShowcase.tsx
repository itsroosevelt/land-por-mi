"use client";

/** Manifiesto · 01 Visión y Origen */
export default function StudentShowcase() {
  return (
    <section id="vision" className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400 mb-4">01 · Visión y Origen</p>
            <h2 className="font-normal tracking-tight text-black leading-[1.1]">
              <span className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl block mb-2">La Gran Colombia</span>
              <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">resurgirá</span>
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-gray-600 text-base leading-[1.7] font-light">
              Ecuador, Colombia, Venezuela y Panamá fueron alguna vez una sola nación: la Gran Colombia. Las decisiones
              de personajes irresponsables en la historia nos dividieron, y estos grandes países llegaron a estar al
              borde de la miseria.
              <br />
              <br />
              En este 2026, gracias al apoyo de los Estados Unidos, esa historia ha comenzado a cambiar. Por eso nos
              unimos a esta gran causa: creemos de verdad que, con el respaldo de los Estados Unidos, esta gran nación
              volverá a resurgir.
            </p>

            <p className="mt-8 text-black text-xl md:text-2xl font-medium tracking-tight leading-snug">
              Bienvenidos a The New Technological Republic.
              <br />
              <span className="text-gray-500 font-light">Esta es la nueva Gran Colombia.</span>
            </p>

            <p className="mt-8 text-gray-600 text-base leading-[1.7] font-light">
              Lo que comenzó como una iniciativa comunitaria para conectar a nuestra gente evoluciona hoy hacia una
              plataforma de alcance continental. Por Mí | The New Technological Republic asume el mandato cívico y
              económico de construir lo que la burocracia nunca supo sostener: una integración de facto impulsada por la
              tecnología, el comercio libre y el talento individual, respetando plenamente las fronteras, identidades
              soberanas y marcos legales de cada nación.
            </p>

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400 mt-10 mb-4">Escala de despliegue</p>
            <ul className="space-y-4">
              <li className="text-gray-600 text-base leading-[1.7] font-light">
                <strong className="font-medium text-black">Fase Nuclear (La Nueva República):</strong> empezamos apoyando
                a nuestra gente, consolidando la infraestructura de servicios y la red de negocios en Ecuador, Colombia,
                Panamá y Venezuela.
              </li>
              <li className="text-gray-600 text-base leading-[1.7] font-light">
                <strong className="font-medium text-black">Fase de Expansión Continental:</strong> proyección hacia todo
                el hemisferio occidental como un polo tecnológico y financiero de valores republicanos y soberanía
                productiva.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
