"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import Background from "../../../components/layout/Background";
import Footer from "../../../components/layout/Footer";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getLessonById } from "../../../store/api/lessonApi";
import { getLessonReviews } from "../../../store/api/reviewApi";
import { ArrowLeft, Clock, Calendar, Video, CheckCircle, XCircle, AlertCircle, Star, MessageSquare } from "lucide-react";

export default function LessonDetailPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentLesson, isLoading } = useAppSelector((state) => state.lesson);
  const { reviews, isLoading: reviewsLoading } = useAppSelector((state) => state.review);
  const lessonId = params?.id as string;

  useEffect(() => {
    if (lessonId) {
      getLessonById(lessonId, dispatch).catch((error) => {
        console.error("Failed to load lesson:", error);
      });
      getLessonReviews(lessonId, dispatch).catch((error) => {
        console.error("Failed to load reviews:", error);
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

  if (!currentLesson) {
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

  // Get localized content
  const lessonTitle = typeof currentLesson.title === "string"
    ? currentLesson.title
    : language === "ar"
    ? currentLesson.title.ar || currentLesson.title.en
    : currentLesson.title.en || currentLesson.title.ar;

  const lessonTitleAr = typeof currentLesson.title === "string" ? "" : currentLesson.title.ar || "";
  const lessonTitleEn = typeof currentLesson.title === "string" ? "" : currentLesson.title.en || "";

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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "approved":
        return language === "ar" ? "موافق عليه" : "Approved";
      case "rejected":
        return language === "ar" ? "مرفوض" : "Rejected";
      case "pending":
        return language === "ar" ? "في انتظار الموافقة" : "Pending";
      default:
        return "";
    }
  };

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

            {/* Lesson Details Card */}
            <div
              className={`rounded-2xl p-6 md:p-8 shadow-xl ${
                theme === "dark"
                  ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Lesson Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1
                        className={`text-3xl font-bold ${
                          theme === "dark" ? "text-white" : "text-blue-950"
                        }`}
                      >
                        {lessonTitle}
                      </h1>
                      {currentLesson.status && (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(currentLesson.status)}
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded ${
                              currentLesson.status === "approved"
                                ? theme === "dark"
                                  ? "bg-green-800/50 text-green-300"
                                  : "bg-green-100 text-green-700"
                                : currentLesson.status === "rejected"
                                ? theme === "dark"
                                  ? "bg-red-800/50 text-red-300"
                                  : "bg-red-100 text-red-700"
                                : theme === "dark"
                                ? "bg-yellow-800/50 text-yellow-300"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {getStatusLabel(currentLesson.status)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bilingual Titles */}
                    {(lessonTitleAr || lessonTitleEn) && (
                      <div className="flex flex-col gap-2 mb-4">
                        {lessonTitleAr && (
                          <p
                            className={`text-lg ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            <span className="font-semibold">AR:</span> {lessonTitleAr}
                          </p>
                        )}
                        {lessonTitleEn && (
                          <p
                            className={`text-lg ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            <span className="font-semibold">EN:</span> {lessonTitleEn}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentLesson.duration && (
                    <div
                      className={`p-4 rounded-lg ${
                        theme === "dark"
                          ? "bg-blue-800/30 border border-blue-700/30"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`h-5 w-5 ${
                            theme === "dark" ? "text-blue-300" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            theme === "dark" ? "text-blue-200" : "text-gray-700"
                          }`}
                        >
                          {language === "ar" ? "المدة:" : "Duration:"}
                        </span>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {currentLesson.duration} {language === "ar" ? "دقيقة" : "minutes"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-lg ${
                      theme === "dark"
                        ? "bg-blue-800/30 border border-blue-700/30"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          theme === "dark" ? "text-blue-200" : "text-gray-700"
                        }`}
                      >
                        {language === "ar" ? "نوع الدرس:" : "Lesson Type:"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded text-sm font-semibold ${
                          currentLesson.isFree
                            ? theme === "dark"
                              ? "bg-green-800/50 text-green-300"
                              : "bg-green-100 text-green-700"
                            : theme === "dark"
                            ? "bg-blue-800/50 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {currentLesson.isFree
                          ? language === "ar"
                            ? "مجاني"
                            : "Free"
                          : language === "ar"
                          ? "مدفوع"
                          : "Paid"}
                      </span>
                    </div>
                  </div>

                  {currentLesson.createdAt && (
                    <div
                      className={`p-4 rounded-lg ${
                        theme === "dark"
                          ? "bg-blue-800/30 border border-blue-700/30"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`h-5 w-5 ${
                            theme === "dark" ? "text-blue-300" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            theme === "dark" ? "text-blue-200" : "text-gray-700"
                          }`}
                        >
                          {language === "ar" ? "تاريخ الإنشاء:" : "Created:"}
                        </span>
                        <span
                          className={`text-xs ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {formatDate(currentLesson.createdAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentLesson.updatedAt && currentLesson.updatedAt !== currentLesson.createdAt && (
                    <div
                      className={`p-4 rounded-lg ${
                        theme === "dark"
                          ? "bg-blue-800/30 border border-blue-700/30"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`h-5 w-5 ${
                            theme === "dark" ? "text-blue-300" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            theme === "dark" ? "text-blue-200" : "text-gray-700"
                          }`}
                        >
                          {language === "ar" ? "آخر تحديث:" : "Updated:"}
                        </span>
                        <span
                          className={`text-xs ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {formatDate(currentLesson.updatedAt)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Player */}
              {currentLesson.videoUrl && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Video
                      className={`h-6 w-6 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    />
                    <h2
                      className={`text-xl font-bold ${
                        theme === "dark" ? "text-white" : "text-blue-950"
                      }`}
                    >
                      {language === "ar" ? "فيديو الدرس" : "Lesson Video"}
                    </h2>
                  </div>
                  <div
                    className={`relative rounded-xl overflow-hidden border-2 ${
                      theme === "dark"
                        ? "border-blue-700/50"
                        : "border-blue-200"
                    }`}
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                      <video
                        src={currentLesson.videoUrl}
                        className="w-full h-full object-cover"
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {currentLesson.rejectionReason && (
                <div
                  className={`mt-6 p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-red-900/20 border-red-700/50"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      theme === "dark" ? "text-red-300" : "text-red-700"
                    }`}
                  >
                    {language === "ar" ? "سبب الرفض:" : "Rejection Reason:"}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-red-200" : "text-red-600"
                    }`}
                  >
                    {currentLesson.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
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
                  {language === "ar" ? "تقييمات الدرس" : "Lesson Reviews"}
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
