"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Background from "../components/layout/Background";
import Footer from "../components/layout/Footer";
import CreateCourseContent from "../components/createCourse/CreateCourseContent";

export default function CreateCoursePageClient() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseType = useMemo(() => {
    const type = searchParams.get("type");
    if (type === "university" || type === "others") {
      return type as "university" | "others";
    }
    return null;
  }, [searchParams]);

  useEffect(() => {
    if (!courseType) {
      router.push("/myCoursesTeacher");
    }
  }, [courseType, router]);

  if (!courseType) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
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
          <CreateCourseContent courseType={courseType} />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
