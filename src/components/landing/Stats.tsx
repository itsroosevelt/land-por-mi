"use client";

import { Shield, Users, Globe, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Componente para animar el conteo
const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={countRef} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

export default function Stats() {
  const stats = [
    {
      icon: Shield,
      number: 30,
      suffix: "+",
      title: "Años de Experiencia",
      description: "Aliados y mentores con más de 30 años en el mercado",
    },
    {
      icon: Users,
      number: 783,
      suffix: "+",
      title: "Miembros en la Red",
      description: "Emprendedores, empresarios e inversionistas",
    },
    {
      icon: Globe,
      number: 25,
      suffix: "+",
      title: "Servicios Tecnológicos",
      description: "Para crear y hacer crecer tu empresa",
    },
    {
      icon: CheckCircle2,
      number: 95,
      suffix: "%",
      title: "Satisfacción",
      description: "De nuestros miembros recomiendan Por Mí",
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-black relative overflow-hidden">
      <div className="container px-6 md:px-12 mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-16 gap-x-4 sm:gap-x-8">

          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <Icon
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white mb-5 sm:mb-8 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />

                <div className="text-4xl sm:text-5xl md:text-6xl font-medium mb-3 sm:mb-4 tracking-tighter text-white">
                  <CountUp end={stat.number} suffix={stat.suffix} />
                </div>

                <h3 className="text-base sm:text-lg font-medium text-white mb-2 sm:mb-3 leading-snug">
                  {stat.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 font-normal max-w-[220px] leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
