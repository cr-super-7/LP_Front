"use client";

import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();

  const languages = [
    { code: "en" as const, name: "English" },
    { code: "ar" as const, name: "العربية" },
  ];

  const currentLang = languages.find((lang) => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 md:gap-2 rounded-lg border px-3 md:px-4 py-1.5 md:py-2 transition-colors ${
          theme === "dark"
            ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
            : "border-blue-950/20 bg-blue-950/5 text-blue-950 hover:bg-blue-950/10"
        }`}
      >
        <span className="text-xs md:text-sm font-medium">
          {currentLang.code === "en" ? "En" : "Ar"}
        </span>
        <svg
          className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full z-20 mt-2 min-w-[140px] rounded-lg border backdrop-blur-sm shadow-lg ${
            language === "ar" ? "left-0" : "right-0"
          } ${
            theme === "dark"
              ? "border-white/20 bg-blue-900/95"
              : "border-blue-950/20 bg-white/95"
          }`}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  language === "ar" ? "text-right" : "text-left"
                } ${
                  theme === "dark"
                    ? `text-white ${language === lang.code ? "bg-white/10 font-medium" : "hover:bg-white/5"}`
                    : `text-blue-950 ${language === lang.code ? "bg-blue-950/10 font-medium" : "hover:bg-blue-950/5"}`
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

