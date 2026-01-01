"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function EducationalPlatform() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <section className="px-4 md:px-8 py-8 md:py-16">
      <div className="flex flex-col items-center gap-3 md:gap-4">
        {/* Heading with star and dashed line */}
        <div className="flex flex-col items-center gap-2">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t("educationalPlatform.title")}</h2>
          <div className="flex items-center gap-2">
            <span className={`text-xl md:text-2xl ${theme === "dark" ? "text-white" : "text-blue-950"}`}>★</span>
            <div className={`h-px w-20 md:w-28 lg:w-32 border-t-2 border-dashed ${theme === "dark" ? "border-white" : "border-blue-950"}`}></div>
            <span className={`text-xl md:text-2xl ${theme === "dark" ? "text-white" : "text-blue-950"}`}>★</span>

          </div>
        </div>

        {/* Description paragraphs */}
        <div className="mt-6 md:mt-8 max-w-4xl space-y-4 md:space-y-6 text-center animate-fade-in-up animate-delay-100 px-4">
          <p className={`text-base md:text-lg leading-relaxed ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
            {t("educationalPlatform.description1")}
          </p>
          <p className={`text-base md:text-lg leading-relaxed ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
            {t("educationalPlatform.description2")}
          </p>
        </div>
      </div>
    </section>
  );
}

