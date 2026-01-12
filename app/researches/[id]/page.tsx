"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import Background from "../../components/layout/Background";
import Footer from "../../components/layout/Footer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getResearchById } from "../../store/api/researchApi";
import ResearchDetailsContent from "../../components/researches/ResearchDetailsContent";

export default function ResearchDetailPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentResearch, isLoading } = useAppSelector((state) => state.research);
  const researchId = params?.id as string;

  useEffect(() => {
    if (researchId) {
      getResearchById(researchId, dispatch).catch((error) => {
        console.error("Failed to load research:", error);
      });
    }
  }, [researchId, dispatch]);

  if (!researchId) {
    return (
      <div
        className={`relative min-h-screen overflow-x-hidden ${
          theme === "dark"
            ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950"
            : "bg-linear-to-b from-white via-gray-50 to-white"
        }`}
      >
        <Background />
        <div className="relative z-10">
          <Sidebar />
          <Navbar />
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "معرف البحث غير موجود" : "Research ID not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`relative min-h-screen overflow-x-hidden ${
          theme === "dark"
            ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950"
            : "bg-linear-to-b from-white via-gray-50 to-white"
        }`}
      >
        <Background />
        <div className="relative z-10">
          <Sidebar />
          <Navbar />
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <div className="flex items-center justify-center py-20">
              <div
                className={`h-12 w-12 animate-spin rounded-full border-4 ${
                  theme === "dark"
                    ? "border-blue-500 border-t-transparent"
                    : "border-blue-600 border-t-transparent"
                }`}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!currentResearch) {
    return (
      <div
        className={`relative min-h-screen overflow-x-hidden ${
          theme === "dark"
            ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950"
            : "bg-linear-to-b from-white via-gray-50 to-white"
        }`}
      >
        <Background />
        <div className="relative z-10">
          <Sidebar />
          <Navbar />
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "البحث غير موجود" : "Research not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        theme === "dark"
          ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950"
          : "bg-linear-to-b from-white via-gray-50 to-white"
      }`}
    >
      <Background />

      <div className="relative z-10">
        <Sidebar />
        <Navbar />
        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16`}>
          <ResearchDetailsContent research={currentResearch} />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
