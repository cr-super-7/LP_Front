"use client";

import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[600px] items-center justify-between px-8 py-16">
      {/* Background decorative lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg
          className="absolute left-0 top-0 h-full w-full"
          viewBox="0 0 400 600"
          fill="none"
        >
          <path
            d="M0 100 Q 100 50, 200 100 T 400 100"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 200 Q 150 150, 300 200 T 400 200"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 300 Q 120 250, 240 300 T 400 300"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Left side - Text content */}
      <div className="relative z-10 flex flex-col gap-4">
        <h1 className="text-6xl font-bold text-white">
          {t("hero.welcome")}{" "}
          <span className="text-blue-300">LB</span>{" "}
          <span className="text-white">{t("hero.company")}</span>
        </h1>
        <p className="text-2xl text-white">
          {t("hero.tagline")}
        </p>
      </div>

      {/* Right side - Student images */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Yellow circle with student image */}
        <div className="relative h-80 w-64">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400"></div>
          <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-full overflow-hidden">
            <div className="h-full w-full bg-linear-to-b from-green-200 to-green-400 flex items-center justify-center">
              <div className="h-3/4 w-3/4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Stacked student images */}
        <div className="relative">
          <div className="relative h-72 w-48 rounded-lg overflow-hidden bg-linear-to-b from-red-200 to-red-400 shadow-lg">
            <div className="h-full w-full bg-gray-200"></div>
          </div>
          <div className="absolute -right-4 -bottom-4 h-64 w-40 rounded-lg overflow-hidden bg-linear-to-b from-orange-200 to-orange-400 shadow-lg">
            <div className="h-full w-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

