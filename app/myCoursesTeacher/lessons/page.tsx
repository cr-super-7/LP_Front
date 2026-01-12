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
import { getCourseReviews } from "../../store/api/reviewApi";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
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
  const { reviews, isLoading: reviewsLoading } = useAppSelector((state) => state.review);
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (courseId) {
      getCourseById(courseId, dispatch).catch((error) => {
        console.error("Failed to load course:", error);
      });
      getCourseReviews(courseId, dispatch).catch((error) => {
        console.error("Failed to load reviews:", error);
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
        hour: "2-digit",
        minute: "2-digit",
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

            {/* Course Reviews Section */}
            <div
              className={`rounded-2xl p-6 md:p-8 shadow-xl ${
                theme === "dark"
                  ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare
                  className={`h-6 w-6 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "تقييمات الدورة" : "Course Reviews"}
                </h2>
                {reviews.length > 0 && (
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      theme === "dark"
                        ? "bg-blue-800/50 text-blue-200"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {reviews.length}
                  </span>
                )}
              </div>

              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className={`p-4 rounded-lg border ${
                        theme === "dark"
                          ? "bg-blue-800/30 border-blue-700/50"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              theme === "dark"
                                ? "bg-blue-700/50 text-blue-200"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <span className="font-semibold text-sm">
                              {review.user?.email?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {review.user?.email || (language === "ar" ? "مستخدم" : "User")}
                            </p>
                            {review.user?.phone && (
                              <p
                                className={`text-xs ${
                                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                                }`}
                              >
                                {review.user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rate
                                  ? "fill-yellow-400 text-yellow-400"
                                  : theme === "dark"
                                  ? "text-gray-600"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span
                            className={`ml-2 text-sm font-semibold ${
                              theme === "dark" ? "text-blue-200" : "text-gray-700"
                            }`}
                          >
                            {review.rate}/5
                          </span>
                        </div>
                      </div>
                      {review.createdAt && (
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {formatDate(review.createdAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`p-8 rounded-lg text-center ${
                    theme === "dark"
                      ? "bg-blue-800/30 border border-blue-700/50"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <MessageSquare
                    className={`h-12 w-12 mx-auto mb-4 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <p
                    className={`text-lg ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar"
                      ? "لا توجد تقييمات بعد"
                      : "No reviews yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
