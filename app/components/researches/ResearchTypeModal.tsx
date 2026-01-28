"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { X, GraduationCap, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResearchTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResearchTypeModal({ isOpen, onClose }: ResearchTypeModalProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelectType = (type: "university" | "others") => {
    onClose();
    router.push(`/researches_teacher/create?researchType=${type}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
          theme === "dark"
            ? "bg-blue-900/95 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800/30">
          <h2
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "اختر نوع البحث" : "Select Research Type"}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-blue-800/50 text-blue-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p
            className={`text-sm mb-6 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "اختر نوع البحث الذي تريد إنشاءه"
              : "Choose the type of research you want to create"}
          </p>

          {/* University Research Option */}
          <button
            onClick={() => handleSelectType("university")}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              theme === "dark"
                ? "border-blue-700 bg-blue-800/30 hover:border-blue-600 hover:bg-blue-800/50"
                : "border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-blue-700/50" : "bg-blue-100"
                }`}
              >
                <GraduationCap
                  className={`h-8 w-8 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "بحث جامعي" : "University Research"}
                </h3>
                <h4
                  className={`text-sm mb-2 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {language === "ar" ? "University Research" : "بحث جامعي"}
                </h4>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar"
                    ? "أبحاث تابعة لقسم معين في كلية. يتطلب اختيار القسم"
                    : "Research affiliated with a specific department in a college. Requires department selection"}
                </p>
              </div>
            </div>
          </button>

          {/* Others Research Option */}
          <button
            onClick={() => handleSelectType("others")}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              theme === "dark"
                ? "border-blue-700 bg-blue-800/30 hover:border-blue-600 hover:bg-blue-800/50"
                : "border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-blue-700/50" : "bg-blue-100"
                }`}
              >
                <Briefcase
                  className={`h-8 w-8 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "بحث تقني/أخرى" : "Technical/Other Research"}
                </h3>
                <h4
                  className={`text-sm mb-2 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {language === "ar" ? "Technical/Other Research" : "بحث تقني/أخرى"}
                </h4>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar"
                    ? "أبحاث تقنية ومهنية خارجية. يتطلب اختيار مكان آخر"
                    : "External technical and professional research. Requires others place selection"}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
