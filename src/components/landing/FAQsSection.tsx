"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsappIcon from "@/components/icons/WhatsappIcon";

const categories = [
  {
    id: "republica",
    title: "The New Technological Republic",
    faqs: [
      {
        question: "¿Qué es Por Mí | The New Technological Republic?",
        answer: "Es una comunidad occidental que brinda productos y servicios tecnológicos accesibles a emprendedores y empresarios de toda Latinoamérica, respaldados por inteligencia artificial, tecnología y finanzas descentralizadas creadas en los Estados Unidos. Nuestro objetivo es unir con tecnología lo que las barreras políticas no lograron unir por años."
      },
      {
        question: "¿Por qué hablan de la Gran Colombia?",
        answer: "Porque Ecuador, Colombia, Venezuela y Panamá fueron alguna vez una sola nación. Las decisiones de personajes irresponsables en la historia nos dividieron. Hoy, con el apoyo de los Estados Unidos, creemos que esa gran nación puede resurgir, esta vez unida por la tecnología, el comercio libre y el talento de su gente."
      },
      {
        question: "¿Cuál es su visión?",
        answer: "Nuestra visión es republicana y capitalista. Defendemos la libertad individual, la propiedad privada, el libre mercado, la supremacía de la ley y los valores occidentales y cristianos como base de la prosperidad. No estamos de acuerdo con el comunismo ni con el socialismo."
      },
      {
        question: "¿Por qué se alinean con los Estados Unidos?",
        answer: "Porque los Estados Unidos lideran la defensa del mundo libre y han vuelto su mirada hacia nuestra región. Queremos que la nueva Gran Colombia sea un aliado productivo, tecnológico y moral de primer orden, y que a medida que apoyemos a los Estados Unidos apoyemos también a toda Latinoamérica."
      }
    ]
  },
  {
    id: "comunidad",
    title: "Comunidad",
    faqs: [
      {
        question: "¿Quién puede unirse?",
        answer: "Cualquier persona que decida regirse por el mérito, la disciplina y el trabajo productivo: profesionales, emprendedores, empresarios, inversionistas, estudiantes, programadores, técnicos y creadores."
      },
      {
        question: "¿Tengo que ser de Ecuador, Colombia, Venezuela o Panamá?",
        answer: "No. Empezamos apoyando a nuestra gente en esos cuatro países, pero para nosotros toda América es Uno. Ayudamos a quien sea, venga del país que venga, donde sea que se encuentre."
      },
      {
        question: "¿Cómo me uno a la red de mi país?",
        answer: "En la sección de banderas haz clic en la bandera de tu país. Verás nuestras redes sociales para unirte y un botón para escribirnos por WhatsApp si tienes preguntas antes de empezar."
      },
      {
        question: "¿Esto tiene que ver con política o con cambiar fronteras?",
        answer: "No. Construimos una integración de facto a través de la tecnología, el comercio y el talento, respetando plenamente las fronteras, las identidades soberanas y los marcos legales de cada nación."
      }
    ]
  },
  {
    id: "servicios",
    title: "Servicios",
    faqs: [
      {
        question: "¿Qué servicios ofrecen?",
        answer: "Todo lo necesario para crear y hacer crecer tu empresa: creación de la empresa, redes sociales organizadas, campañas publicitarias, tu propio sitio web, diseño de logos, manual de marca, marca personal y logística."
      },
      {
        question: "¿Tengo que hacerlo todo yo mismo?",
        answer: "Tú decides. Creamos cursos y guías paso a paso para que puedas hacerlo por ti mismo, pero si se te hace difícil o prefieres no hacerlo, nuestro equipo lo hace por ti."
      },
      {
        question: "¿Cuánto cuestan los servicios?",
        answer: "Nuestro objetivo es ofrecer servicios tecnológicos a un costo inferior al del mercado actual, para eliminar las barreras de entrada a los negocios. Puedes ver los planes disponibles en la Tienda."
      },
      {
        question: "¿Qué es Por Mí Streaming?",
        answer: "Es el canal de The New Technological Republic: entrevistas con empresarios e inversionistas, historias reales de emprendedores, masterclasses para crear y hacer crecer tu empresa, y contenido sobre tecnología, inteligencia artificial y finanzas descentralizadas."
      }
    ]
  },
  {
    id: "plataforma",
    title: "Plataforma y Pagos",
    faqs: [
      {
        question: "¿Cómo accedo a la plataforma Por Mí?",
        answer: "Si ya tienes cuenta, haz clic en \"Ingresar\" en la barra superior. Si aún no la tienes, haz clic en \"Ingresa a la plataforma Por Mí\" y regístrate. Desde ahí podrás acceder a las guías, los cursos y los servicios."
      },
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Puedes pagar con tarjeta (Visa, Mastercard o AMEX) de forma segura a través de Stripe, o con stablecoins y criptomonedas (USDC, USDT, SOL o LXR) en la red Solana."
      },
      {
        question: "¿Qué es Luxor (LXR)?",
        answer: "Luxor es la moneda digital del ecosistema Por Mí. Puedes usarla como método de pago dentro de la plataforma, junto con USDC, USDT y SOL."
      }
    ]
  }
];

export default function FAQsSection() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const filteredFaqs = selectedCategory === "all"
    ? categories.flatMap(cat => cat.faqs.map(faq => ({ ...faq, categoryId: cat.id, categoryTitle: cat.title })))
    : categories.find(cat => cat.id === selectedCategory)?.faqs.map(faq => {
      const cat = categories.find(c => c.id === selectedCategory)!;
      return { ...faq, categoryId: cat.id, categoryTitle: cat.title };
    }) || [];

  const toggleExpand = (id: string) => {
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 lg:py-28 bg-black font-sans text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="mb-10 md:mb-16 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
            Tus dudas resueltas <br className="hidden md:inline" />
            <span className="text-gray-400">de forma directa</span>
          </h2>
          <p className="text-base md:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Todo sobre The New Technological Republic, la comunidad, nuestros servicios y la plataforma Por Mí. Transparencia total desde el primer momento.
          </p>
        </div>

        {/* Category Pills (Filtros) */}
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 mb-10 md:mb-12 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setExpandedIndex(null);
              }}
              className={`shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Vertical Accordion List */}
        <div className="border-t border-white/10 divide-y divide-white/10 mb-20">
          <AnimatePresence initial={false}>
            {filteredFaqs.map((faq, idx) => {
              const id = `${faq.categoryId}-${idx}`;
              const isExpanded = expandedIndex === id;

              return (
                <div key={id} className="py-5 transition-colors duration-300 hover:bg-white/[0.02] px-2 rounded-xl">
                  <button
                    onClick={() => toggleExpand(id)}
                    className="w-full flex justify-between items-center text-left py-2 group focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col gap-1 pr-6">
                      <span className="text-base md:text-lg font-medium text-white transition-colors duration-200">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 ${
                        isExpanded ? "rotate-180 bg-white border-white text-black group-hover:bg-white group-hover:text-black" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: { height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25, delay: 0.05 } }
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: { height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pt-2 text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* WhatsApp CTA Dudas - Sin contenedor (Estilo Nota) */}
        <div className="mt-16 text-center max-w-xl mx-auto flex flex-col items-center">
          <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
            <span className="font-semibold text-white block mb-1 text-sm md:text-base">¿Aún tienes dudas?</span>
            Si no encontraste lo que buscabas, nuestro equipo de soporte está disponible para atenderte personalmente en cualquier momento.
          </p>
          
          <a
            href="https://chat.whatsapp.com/CAeBvhShHLC7VyBy8yZzVk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[340px] px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm md:text-base hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-500 hover:border-blue-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-300"
          >
            <WhatsappIcon className="w-5 h-5" />
            <span className="ml-2.5">Chatear por WhatsApp</span>
          </a>
        </div>
        
      </div>
    </section>
  );
}
