"use client";

import Link from "next/link";
import { sendMetaEvent } from "@/lib/meta-events";

// La Gran Colombia: dos a cada lado del título
const leftCircles = [
    { src: "/assets/gran-colombia/panama.webp", alt: "Panamá" },
    { src: "/assets/gran-colombia/ecuador.webp", alt: "Ecuador" },
];
const rightCircles = [
    { src: "/assets/gran-colombia/colombia.webp", alt: "Colombia" },
    { src: "/assets/gran-colombia/venezuela.webp", alt: "Venezuela" },
];

function CountryCircle({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            className={`rounded-full object-cover shadow-xl ${className}`}
        />
    );
}

const services = [
    "Creación de tu empresa",
    "Redes sociales organizadas",
    "Campañas publicitarias",
    "Tu propio sitio web",
    "Diseño de logos",
    "Manual de marca",
    "Marca personal",
    "Logística",
];

export default function FreeTrainingShowcase() {
    return (
        <section id="servicios" className="relative pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24 bg-white text-black overflow-hidden font-sans">
            {/* Pantallas grandes: dos círculos por lado, simétricos, repartidos a lo alto de la sección */}
            <div className="hidden xl:block pointer-events-none" aria-hidden>
                <CountryCircle {...leftCircles[0]} className="absolute left-[6%] top-[18%] w-36 h-36" />
                <CountryCircle {...leftCircles[1]} className="absolute left-[6%] top-[58%] w-36 h-36" />
                <CountryCircle {...rightCircles[0]} className="absolute right-[6%] top-[18%] w-36 h-36" />
                <CountryCircle {...rightCircles[1]} className="absolute right-[6%] top-[58%] w-36 h-36" />
            </div>

            <div className="container relative mx-auto px-6 max-w-4xl">
                <div className="flex flex-col items-center text-center">

                    <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
                        <span className="text-3xl md:text-4xl lg:text-5xl block mb-2 font-medium">Conviértete en el empresario del futuro</span>
                        <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">Todo lo que necesitas para crear tu empresa</span>
                    </h2>

                    <p className="text-gray-600 text-base leading-[1.7] font-light max-w-2xl">
                        Sabemos que para crear negocios fuertes y productivos hay que crear la empresa, organizar las redes
                        sociales, lanzar campañas publicitarias, tener un sitio web propio, una identidad de marca y resolver
                        la logística. Entendemos que puede ser difícil, por eso creamos las guías y el paso a paso para
                        lograrlo. El futuro que viene es completamente diferente al que conocemos, y queremos mostrarte cómo
                        llegar a ser uno de los empresarios que lo construyan.
                    </p>

                    {/* Celular, tablet y laptop: los cuatro en fila debajo del texto */}
                    <div className="xl:hidden mt-8 flex justify-center gap-3 sm:gap-5">
                        {[...leftCircles, ...rightCircles].map((c) => (
                            <CountryCircle key={c.alt} {...c} className="w-16 h-16 sm:w-24 sm:h-24" />
                        ))}
                    </div>

                    {/* Lo que vamos a ofrecer */}
                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl">
                        {services.map((service) => (
                            <div
                                key={service}
                                className="flex items-center justify-center lg:justify-start text-center lg:text-left min-h-[3.25rem] px-3 sm:px-4 py-3 rounded-2xl border border-black/10 bg-black/[0.02] text-[13px] sm:text-sm font-medium text-black leading-snug"
                            >
                                {service}
                            </div>
                        ))}
                    </div>

                    {/* Dos caminos */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl text-center lg:text-left">
                        <div className="p-6 rounded-3xl border border-black/10">
                            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400 mb-2">Hazlo tú mismo</p>
                            <p className="text-gray-600 text-base leading-[1.7] font-light">
                                Creamos cursos y guías paso a paso para que puedas hacerlo todo por ti mismo.
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl border border-black/10">
                            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400 mb-2">Lo hacemos por ti</p>
                            <p className="text-gray-600 text-base leading-[1.7] font-light">
                                Si no deseas hacerlo o se te hace muy difícil, nuestro equipo lo hace por ti.
                            </p>
                        </div>
                    </div>

                    <p className="mt-10 text-gray-600 text-base leading-[1.7] font-light max-w-2xl">
                        Para acceder a todo esto creamos la plataforma <strong className="font-medium text-black">POR MÍ</strong>.
                        Ahí encontrarás todo lo necesario para convertirte en empresario. Solo regístrate y accede a todos
                        estos servicios, donde sea que te encuentres.
                    </p>

                    <p className="mt-6 text-black text-lg md:text-xl font-medium tracking-tight leading-snug max-w-2xl">
                        Mírate al espejo y recuerda que todo esto lo haces por ti: por tu felicidad y por tu vida.
                    </p>

                    <Link
                        href="/login?register=true"
                        onClick={() => sendMetaEvent('Lead', { source: 'FreeTrainingShowcase: Ingresa a la plataforma Por Mí' })}
                        className="mt-10 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:py-3 bg-transparent border border-black text-black rounded-full hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-500 hover:border-blue-600 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm md:text-base font-medium"
                    >
                        Ingresa a la plataforma Por Mí
                    </Link>
                </div>
            </div>
        </section>
    );
}
