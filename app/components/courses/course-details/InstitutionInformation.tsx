"use client";

import { Building2, School, GraduationCap, MapPin } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";

interface InstitutionInformationProps {
  department: {
    name: { ar: string; en: string };
    college?: {
      name: { ar: string; en: string };
      university?: {
        name: string;
        location?: string;
      };
    };
  };
}

export default function InstitutionInformation({
  department,
}: InstitutionInformationProps) {
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
        {language === "ar" ? "معلومات المؤسسة" : "Institution Information"}
      </h2>

      <div className="space-y-4">
        {/* University */}
        {department.college?.university && (
          <div className="flex items-start gap-3">
            <Building2
              className={`h-5 w-5 shrink-0 mt-1 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {department.college.university.name}
              </p>
              {department.college.university.location && (
                <div className="flex items-center gap-1">
                  <MapPin
                    className={`h-4 w-4 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {department.college.university.location}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* College */}
        {department.college && (
          <div className="flex items-start gap-3">
            <School
              className={`h-5 w-5 shrink-0 mt-1 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {language === "ar"
                  ? department.college.name?.ar
                  : department.college.name?.en}
              </p>
            </div>
          </div>
        )}

        {/* Department */}
        <div className="flex items-start gap-3">
          <GraduationCap
            className={`h-5 w-5 shrink-0 mt-1 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <div>
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {language === "ar" ? department.name?.ar : department.name?.en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
