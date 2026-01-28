"use client";

import { Briefcase } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";

interface ProfessionalSpecialtyProps {
  othersCourses: {
    name: { ar: string; en: string };
  };
}

export default function ProfessionalSpecialty({
  othersCourses,
}: ProfessionalSpecialtyProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div
      className={`rounded-2xl p-6 ${
        theme === "dark"
          ? "bg-blue-900/50 border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          theme === "dark" ? "text-white" : "text-blue-950"
        }`}
      >
        {language === "ar" ? "التخصص المهني" : "Professional Specialty"}
      </h2>

      <div className="space-y-4">
        {/* Specialty Name */}
        <div className="flex items-start gap-3">
          <Briefcase
            className={`h-5 w-5 shrink-0 mt-1 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <div>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-blue-300" : "text-gray-500"
              }`}
            >
              {language === "ar" ? "اسم التخصص" : "Specialty Name"}
            </p>
            <p
              className={`text-sm font-medium mt-1 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {language === "ar"
                ? othersCourses.name?.ar
                : othersCourses.name?.en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
