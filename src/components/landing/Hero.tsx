"use client";

import { useEffect, useRef } from "react";

interface HeroProps {
  onStartQuote: () => void;
}

const youtubeVideoId = "vp7xoPeWzEw";
// El video vuelve a empezar al llegar a 3:05.
const LOOP_END_SECONDS = 185;
const youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeVideoId}&end=${LOOP_END_SECONDS}&enablejsapi=1&rel=0&cc_load_policy=0&modestbranding=1&playsinline=1&showinfo=0&iv_load_policy=3&fs=0&disablekb=1`;

export default function Hero({ onStartQuote }: HeroProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Respaldo por si YouTube ignora `end` al hacer loop: escuchamos el tiempo
  // del reproductor vía postMessage (sin cargar la librería IFrame API).
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const send = (data: object) =>
      iframe.contentWindow?.postMessage(JSON.stringify(data), "*");

    const handleLoad = () => send({ event: "listening", id: 1 });

    // El iframe viene en el HTML del servidor y puede terminar de cargar antes de
    // que este efecto se ejecute (perderíamos el evento "load"). Por eso repetimos
    // el saludo cada segundo hasta que el reproductor responda.
    let connected = false;
    const handshake = window.setInterval(() => {
      if (connected) window.clearInterval(handshake);
      else handleLoad();
    }, 1000);
    handleLoad();

    const restart = () => {
      send({ event: "command", func: "seekTo", args: [0, true] });
      send({ event: "command", func: "playVideo", args: [] });
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow || typeof e.data !== "string") return;
      try {
        const data = JSON.parse(e.data);
        connected = true;
        const currentTime = data?.info?.currentTime;
        const playerState = data?.info?.playerState; // 0 = terminado
        if (
          (typeof currentTime === "number" && currentTime >= LOOP_END_SECONDS) ||
          playerState === 0
        ) {
          restart();
        }
      } catch {
        // mensaje que no es del reproductor
      }
    };

    iframe.addEventListener("load", handleLoad);
    window.addEventListener("message", handleMessage);
    return () => {
      window.clearInterval(handshake);
      iframe.removeEventListener("load", handleLoad);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <section className="relative min-h-[104dvh] flex items-end overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full [container-type:size]">
        <iframe
          ref={iframeRef}
          key={youtubeVideoId}
          src={youtubeEmbedUrl}
          title="Hero video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={false}
          // Video de alto = sección (cqh = alto del contenedor) + 4cm, en 16:9, sin zoom extra.
          // El video trae una franja negra de cine arriba (~12.8% de su alto): lo subimos
          // justo eso para que quede fuera de la vista. Al iframe se le suman 240px de alto
          // (120px arriba y abajo) donde caen el título, logo y controles de YouTube.
          className="absolute left-1/2 -translate-x-1/2 border-0 pointer-events-none"
          style={{
            top: "calc(-120px - (100cqh + 4cm) * 0.128)",
            width: "calc((100cqh + 4cm) * 16 / 9)",
            height: "calc(100cqh + 4cm + 240px)",
            backgroundColor: "#000",
            border: "none",
          }}
        />

        {/* Difuminado oscuro solo en la parte inferior */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] z-20 bg-gradient-to-t from-[#050507] via-[#050507]/80 to-transparent pointer-events-none" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-black via-black/90 to-transparent" />

      {/* Contenido adaptado a móviles y tablets con safe-area */}
      <div className="relative z-30 w-full pb-12 sm:pb-16 md:pb-24 lg:pb-[3cm] px-5 sm:px-8 md:px-12 lg:px-[3cm] pt-24 sm:pt-28 safe-bottom">
        <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full">

          <div className="w-full md:max-w-[80%] lg:max-w-[70%] text-center space-y-2 sm:space-y-3">
            {/* Texto superior (Eyebrow) */}
            <p className="text-gray-300 text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] uppercase">
              Por Mí
            </p>

            {/* Título Principal */}
            <h1 className="text-[2.7rem] sm:text-[3.2rem] md:text-[4.2rem] font-medium leading-[1.02] text-white tracking-tighter">
              The New <br />
              Technological Republic
            </h1>

            <div className="pt-1">
              <p className="text-gray-300 text-xs sm:text-sm md:text-base font-medium tracking-tight max-w-2xl mx-auto">
                Comunidad occidental que brinda productos y servicios accesibles a emprendedores y empresarios de toda Latinoamérica, respaldados por inteligencia artificial, tecnología y finanzas descentralizadas creadas en los Estados Unidos. Esta comunidad tiene como objetivo unir con tecnología lo que las barreras políticas no lograron unir por años.
              </p>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
