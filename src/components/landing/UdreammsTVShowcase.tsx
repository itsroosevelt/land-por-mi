"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const TV_BACKGROUND_VIDEO =
    "https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/por-mi%2Floading.mp4?alt=media&token=5f895d66-9dc0-4488-91cf-2e6fb7c36246";

export default function UdreammsTVShowcase() {
    const controls = useAnimation();

    const resizeTimer = useRef<number | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);
    const tvRef = useRef<any>(null);
    // El video de fondo (~5 MB) solo se descarga cuando la sección está cerca de verse.
    const isNearView = useInView(sectionRef, { once: true, margin: "300px 0px" });

    // Calcula límites basados en las dimensiones reales de la sección y el TV
    const startAirHockeyBounces = () => {
        if (typeof window === "undefined") return;
        const sec = sectionRef.current;
        const tv = tvRef.current;
        if (!sec || !tv) return;

        const c = sec.getBoundingClientRect();
        const t = tv.getBoundingClientRect();

        const minX = Math.round(c.left - t.left);
        const maxX = Math.round(c.right - t.right);
        const minY = Math.round(c.top - t.top);
        const maxY = Math.round(c.bottom - t.bottom);

        const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

        const marginX = Math.round(Math.min(Math.abs(minX), Math.abs(maxX)) * 0.85);
        const marginY = Math.round(Math.min(Math.abs(minY), Math.abs(maxY)) * 0.6);

        const xs = [
            0,
            clamp(-marginX * 0.6, minX, maxX),
            clamp(marginX * 0.5, minX, maxX),
            clamp(-marginX * 0.3, minX, maxX),
            clamp(marginX * 0.25, minX, maxX),
            0
        ];

        const ys = [
            0,
            clamp(-marginY * 0.9, minY, maxY),
            clamp(marginY * 0.6, minY, maxY),
            clamp(-marginY * 0.4, minY, maxY),
            0
        ];

        controls.start({
            x: xs,
            y: ys,
            rotate: [0, 3, -2, 1, 0],
            transition: {
                repeat: Infinity,
                duration: 30,
                ease: "easeInOut"
            }
        });
    };

    useEffect(() => {
        startAirHockeyBounces();
        const onResize = () => {
            if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
            resizeTimer.current = window.setTimeout(() => {
                startAirHockeyBounces();
            }, 150);
        };
        if (typeof window !== "undefined") window.addEventListener("resize", onResize);
        return () => {
            if (typeof window !== "undefined") window.removeEventListener("resize", onResize);
            if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full min-h-[400px] md:min-h-[550px] lg:min-h-[650px] bg-black overflow-hidden flex items-center z-10 pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32">
            
            {/* 1. DEGRADADO SUPERIOR (Badge sin borde y con tipografía fina font-light) */}
            <div className="absolute top-0 left-0 right-0 z-30 w-full h-24 md:h-36 lg:h-48 bg-gradient-to-b from-black via-black/95 to-transparent flex items-center justify-center pt-6 md:pt-10 pointer-events-none">
                <span className="w-fit h-fit inline-block bg-white/5 text-white/90 backdrop-blur-md text-[10px] md:text-[12px] font-light uppercase tracking-widest px-6 py-2.5 rounded-full shadow-md pointer-events-auto">
                    PRÓXIMAMENTE • PLATAFORMA DE STREAMING
                </span>
            </div>

            {/* 2. DEGRADADO MÁS PRONUNCIADO EN EL BORDE INFERIOR */}
            <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 w-full h-24 md:h-36 lg:h-48 bg-gradient-to-t from-black via-black/95 to-transparent"
                aria-hidden
            />

            {/* Imagen de Fondo abarcando el tamaño exacto de TODA la sección completa */}
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                    type: "spring",
                    damping: 24,
                    stiffness: 50,
                    duration: 1.5
                }}
                className="absolute inset-0 z-0 w-full h-full overflow-hidden"
            >
                {/* Video de fondo */}
                {isNearView && (
                    <video
                        src={TV_BACKGROUND_VIDEO}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-hidden
                        className="absolute z-0 mix-blend-screen object-contain inset-x-0 top-24 mx-auto w-[88%] sm:w-[70%] h-52 sm:h-64 md:h-72 object-center lg:inset-0 lg:w-[55%] lg:h-[55%] lg:my-auto lg:ml-auto lg:mr-12 lg:object-right"
                    />
                )}

                {/* DEGRADADO AÚN MÁS INTENSO Y EXTENSO EN EL LADO IZQUIERDO */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-3/4 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/90 lg:via-black via-45% lg:via-55% to-transparent z-10 pointer-events-none" />
            </motion.div>

            {/* Contenido de la Sección */}
            <div className="container max-w-[1500px] mx-auto px-6 md:px-12 pt-60 sm:pt-72 lg:pt-24 pb-16 md:pb-24 relative z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                    {/* Left Column: Texts */}
                    <div className="w-full max-w-3xl flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
                        {/* Animación de los Textos desde el lado izquierdo (Flujo perfecto sin empujar palabras) */}
                        <motion.div
                            initial={{ x: "-150px", opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: 0.4,
                                type: "spring",
                                damping: 18,
                                stiffness: 60,
                                duration: 1.2
                            }}
                            className="flex flex-col gap-1 items-center lg:items-start"
                        >
                            {/* Título Principal */}
                            <div className="relative inline-block w-fit">
                                <h2 className="text-6xl sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] font-bold text-white tracking-tighter leading-none select-none">
                                    POR MÍ
                                </h2>
                            </div>

                            {/* Subtítulos y Copia Premium de Acompañamiento (Perfectamente pegados) */}
                            <div className="max-w-2xl mt-4 md:mt-6">

                                <h3 className="text-xl md:text-3xl font-light text-slate-300 tracking-wide mb-6 leading-snug">
                                    El canal de The New Technological Republic para los empresarios del futuro
                                </h3>

                                <p className="text-base text-slate-400 font-light leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                                    Entrevistas con empresarios e inversionistas, historias reales de emprendedores de la nueva Gran Colombia, masterclasses para crear y hacer crecer tu empresa, y lo último en tecnología, inteligencia artificial y finanzas descentralizadas. Todo el contenido audiovisual de Por Mí unificado en una sola plataforma.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* CTA Button Transparente Ubicado en el Contenedor Principal (Lado Derecho) */}
                <div className="w-full flex justify-center lg:justify-end mt-4 md:mt-12 lg:mt-24">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto sm:min-w-[400px] md:min-w-[480px] px-12 md:px-16 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/30 backdrop-blur-md rounded-full text-base md:text-lg font-medium tracking-wide transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        Por mí Streaming
                    </motion.button>
                </div>
            </div>

        </section>
    );
}
