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
import { getPrivateLessonById } from "../../store/api/privateLessonApi";
import PrivateLessonDetailsContent from "../../components/privateLessons/PrivateLessonDetailsContent";

export default function PrivateLessonDetailPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentPrivateLesson, isLoading } = useAppSelector((state) => state.privateLesson);
  const lessonId = params?.id as string;

  useEffect(() => {
    if (lessonId) {
      getPrivateLessonById(lessonId, dispatch).catch((error) => {
        console.error("Failed to load private lesson:", error);
      });
    }
  }, [lessonId, dispatch]);

  if (!lessonId) {
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
                {language === "ar" ? "معرف الدرس غير موجود" : "Lesson ID not found"}
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
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]`}>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </main>
        </div>
      </div>
    );
  }

  if (!currentPrivateLesson) {
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
                {language === "ar" ? "الدرس غير موجود" : "Lesson not found"}
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
          <PrivateLessonDetailsContent lesson={currentPrivateLesson} />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
