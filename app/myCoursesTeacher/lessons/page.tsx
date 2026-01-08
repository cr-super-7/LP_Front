"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import Background from "../../components/layout/Background";
import Footer from "../../components/layout/Footer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCourseById } from "../../store/api/courseApi";
import { ArrowLeft } from "lucide-react";
import CourseHeader from "../../components/myCoursesTeacher/lessons/CourseHeader";
import CourseStats from "../../components/myCoursesTeacher/lessons/CourseStats";
import CourseMeta from "../../components/myCoursesTeacher/lessons/CourseMeta";
import LessonsSection from "../../components/myCoursesTeacher/lessons/LessonsSection";

export default function CourseLessonsPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentCourse, isLoading } = useAppSelector((state) => state.course);
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (courseId) {
      getCourseById(courseId, dispatch).catch((error) => {
        console.error("Failed to load course:", error);
      });
    }
  }, [courseId, dispatch]);

  if (!courseId) {
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
                {language === "ar" ? "معرف الدورة غير موجود" : "Course ID not found"}
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

  if (!currentCourse) {
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
                {language === "ar" ? "الدورة غير موجودة" : "Course not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Get localized content
  const title = typeof currentCourse.title === "string"
    ? currentCourse.title
    : language === "ar"
    ? currentCourse.title.ar || currentCourse.title.en
    : currentCourse.title.en || currentCourse.title.ar;

  const description = typeof currentCourse.description === "string"
    ? currentCourse.description
    : language === "ar"
    ? currentCourse.description.ar || currentCourse.description.en
    : currentCourse.description.en || currentCourse.description.ar;

  // Format level
  const levelLabels: Record<string, { ar: string; en: string }> = {
    beginner: { ar: "مبتدئ", en: "Beginner" },
    intermediate: { ar: "متوسط", en: "Intermediate" },
    advanced: { ar: "متقدم", en: "Advanced" },
  };
  const levelLabel = levelLabels[currentCourse.level]?.[language] || currentCourse.level;

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const imageUrl = currentCourse.thumbnail || "/home/privet_lessons.png";

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
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-blue-900/50 text-blue-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{language === "ar" ? "رجوع" : "Back"}</span>
            </button>

            {/* Course Header */}
            <CourseHeader
              course={currentCourse}
              title={title}
              description={description}
              imageUrl={imageUrl}
            />

            {/* Course Stats */}
            <div
              className={`rounded-2xl p-6 md:p-8 shadow-xl ${
                theme === "dark"
                  ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <CourseStats course={currentCourse} levelLabel={levelLabel} />
              <CourseMeta course={currentCourse} formatDate={formatDate} />
            </div>

            {/* Lessons Section */}
            <LessonsSection course={currentCourse} />
          </div>
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
