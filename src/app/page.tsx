"use client";


import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import ChooseYourPath from "@/components/landing/ChooseYourPath";
import Stats from "@/components/landing/Stats";
/* Secciones ocultas — importar desde @/frontend/modules/marketing/home/secciones-ocultar/ */
// import Services from "@/frontend/modules/marketing/home/secciones-ocultar/Services";
// import ExperienceSection from "@/frontend/modules/marketing/home/secciones-ocultar/ExperienceSection";
// import WhyChooseUs from "@/frontend/modules/marketing/home/secciones-ocultar/WhyChooseUs";
// import JoinOurStudents from "@/frontend/modules/marketing/home/secciones-ocultar/JoinOurStudents";
// import YouTubeSubscription from "@/frontend/modules/marketing/home/secciones-ocultar/YouTubeSubscription";
import FAQsSection from "@/components/landing/FAQsSection";
import TouristShowcase from "@/components/landing/TouristShowcase";
import StudentShowcase from "@/components/landing/StudentShowcase";
import MentorshipShowcase from "@/components/landing/MentorshipShowcase";
import FreeTrainingShowcase from "@/components/landing/FreeTrainingShowcase";
import UdreammsTVShowcase from "@/components/landing/UdreammsTVShowcase";
// Media luna por debajo del logo: ángulos en grados (0° = derecha, 90° = abajo).
const ARC_RADIUS = 58; // % del tamaño del logo, medido desde su centro
const GRAN_COLOMBIA_ARC = [
  { name: "Ecuador", src: "/assets/gran-colombia/ecuador.webp", angle: 160 },
  { name: "Colombia", src: "/assets/gran-colombia/colombia.webp", angle: 120 },
  { name: "Venezuela", src: "/assets/gran-colombia/venezuela.webp", angle: 60 },
  { name: "Panamá", src: "/assets/gran-colombia/panama.webp", angle: 20 },
].map(({ angle, ...c }) => {
  const rad = (angle * Math.PI) / 180;
  return {
    ...c,
    left: `${(50 + ARC_RADIUS * Math.cos(rad)).toFixed(2)}%`,
    top: `${(50 + ARC_RADIUS * Math.sin(rad)).toFixed(2)}%`,
  };
});

export default function Home() {
  const handleStartQuote = () => {
    window.location.href = "/visas/student#calculator-section";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <Hero onStartQuote={handleStartQuote} />

        {/* Bloque superior: espacio entre secciones en blanco */}
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24 bg-white [&>section]:scroll-mt-28">
          <ChooseYourPath />
          <StudentShowcase />
          <TouristShowcase />

          <MentorshipShowcase />
          <FreeTrainingShowcase />
        </div>

        {/* Desde Por mí TV: fondo y espacios negros */}
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24 bg-black [&>section]:scroll-mt-28">
          <UdreammsTVShowcase />

          {/* Logo de la Gran Colombia centrado */}
          <section className="flex flex-col items-center px-6 text-center">
            <h2 className="mb-8 md:mb-10 text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.05] text-white tracking-tighter">
              The New Technological Republic
            </h2>
            {/* Logo con Ecuador, Colombia, Venezuela y Panamá en media luna por debajo */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] lg:w-[34rem] lg:h-[34rem] mb-10 md:mb-14 lg:mb-16">
              <img
                src="/icons/logo-por-mi-840.webp"
                alt="Por Mí | The New Technological Republic"
                loading="lazy"
                className="w-full h-full rounded-full object-cover shadow-[0_0_60px_rgba(255,255,255,0.08)]"
              />
              {GRAN_COLOMBIA_ARC.map((c) => (
                <img
                  key={c.name}
                  src={c.src}
                  alt={c.name}
                  loading="lazy"
                  className="absolute w-[20%] h-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-xl"
                  style={{ left: c.left, top: c.top }}
                />
              ))}
            </div>
          </section>

          <Stats />
          <FAQsSection />
        </div>
      </main>

      <div className="bg-black pt-20 md:pt-28 lg:pt-36">
        <Footer />
      </div>
    </div>
  );
}
