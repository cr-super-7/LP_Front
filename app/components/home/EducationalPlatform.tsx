"use client";

import { useLanguage } from "../../contexts/LanguageContext";

export default function EducationalPlatform() {
  const { t } = useLanguage();

  return (
    <section className="px-8 py-16">
      <div className="flex flex-col items-center gap-4">
        {/* Heading with star and dashed line */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-4xl font-bold text-white">{t("educationalPlatform.title")}</h2>
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl">★</span>
            <div className="h-px w-32 border-t-2 border-dashed border-white"></div>
          </div>
        </div>

        {/* Description paragraphs */}
        <div className="mt-8 max-w-4xl space-y-6 text-center">
          <p className="text-lg leading-relaxed text-white">
            {t("educationalPlatform.description1")}
          </p>
          <p className="text-lg leading-relaxed text-white">
            {t("educationalPlatform.description2")}
          </p>
        </div>
      </div>
    </section>
  );
}

