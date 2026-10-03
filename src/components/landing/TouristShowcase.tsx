"use client";

/** Manifiesto · 02 Modelo Republicano */
export default function TouristShowcase() {
    return (
        <section id="modelo" className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    <div className="lg:col-span-5">
                        <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400 mb-4">02 · Modelo Republicano</p>
                        <h2 className="font-normal tracking-tight text-black leading-[1.1]">
                            <span className="text-3xl md:text-4xl lg:text-5xl block mb-2">Una alianza</span>
                            <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">con los Estados Unidos</span>
                        </h2>
                        <img
                            src="/assets/gran-colombia/gran-colombia-alianza.webp"
                            alt="La Gran Colombia"
                            loading="lazy"
                            className="mt-8 w-56 sm:w-64 lg:w-full lg:max-w-sm h-auto"
                        />
                    </div>

                    <div className="lg:col-span-7">
                        <p className="text-gray-600 text-base leading-[1.7] font-light">
                            Así como los Estados Unidos, bajo la administración del presidente Donald J. Trump, ha vuelto su
                            mirada hacia Colombia, Ecuador, Venezuela y Panamá para apoyarlos, y con ellos a todo el
                            continente americano, nosotros declaramos que la Gran Colombia resurgirá como un aliado firme de
                            los Estados Unidos en la defensa de Occidente: de la fe cristiana, de la libertad y de todo
                            aquello en lo que creemos.
                            <br />
                            <br />
                            Nuestra visión es republicana y capitalista. No estamos de acuerdo con el comunismo ni con el
                            socialismo. Por eso nuestra estructura se alinea de forma explícita con el modelo republicano
                            constitucional de los Estados Unidos:
                        </p>
                        <ul className="mt-6 space-y-4">
                            <li className="text-gray-600 text-base leading-[1.7] font-light">
                                <strong className="font-medium text-black">Principios innegociables:</strong> defensa de la libertad individual, primacía de la propiedad privada, libre mercado, supremacía de la ley y protección irrestricta de las libertades fundamentales.
                            </li>
                            <li className="text-gray-600 text-base leading-[1.7] font-light">
                                <strong className="font-medium text-black">Defensa civilizatoria y moral:</strong> reconocemos la herencia cristiana y los valores occidentales como los cimientos éticos indispensables para la prosperidad, el orden social y la libertad.
                            </li>
                            <li className="text-gray-600 text-base leading-[1.7] font-light">
                                <strong className="font-medium text-black">Frente estratégico común:</strong> los Estados Unidos lideran la preservación del mundo libre; nosotros asumimos el compromiso de convertir a nuestra región en un aliado productivo, tecnológico y moral de primer orden. Y a medida que apoyemos a los Estados Unidos, apoyaremos también a todos los demás países de Latinoamérica.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
