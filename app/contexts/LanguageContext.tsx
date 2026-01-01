"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, unknown>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    const initialLanguage = savedLanguage || "en";
    setLanguageState(initialLanguage);
    loadTranslations(initialLanguage);
    
    // Read the language that was set by the script (to avoid hydration mismatch)
    const scriptSetLang = document.documentElement.getAttribute("lang") as Language;
    if (scriptSetLang && scriptSetLang !== initialLanguage) {
      // If script set a different language, use that
      setLanguageState(scriptSetLang);
      loadTranslations(scriptSetLang);
    }
  }, []);

  const loadTranslations = async (lang: Language) => {
    try {
      const translationsModule = await import(`../locales/${lang}.json`);
      setTranslations(translationsModule.default);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    loadTranslations(lang);
    // Update HTML dir and lang attributes for RTL support
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", lang);
    }
  };

  const t = (key: string): string => {
    if (!mounted) return key;
    
    const keys = key.split(".");
    let value: unknown = translations;
    
    for (const k of keys) {
      if (value && typeof value === "object" && !Array.isArray(value) && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  // Update dir and lang attributes when language changes (only on client)
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", language);
    }
  }, [language, mounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

