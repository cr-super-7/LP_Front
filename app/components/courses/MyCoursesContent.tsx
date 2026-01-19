"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  TrendingUp,
  Eye,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyEnrollments } from "../../store/api/enrollmentApi";
import type { Enrollment } from "../../store/interface/enrollmentInterface";
import toast from "react-hot-toast";

export default function MyCoursesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Don't redirect, just show login prompt
    if (!isAuthenticated) {
      setIsLoading(false);
      setError(language === "ar" ? "يرجى تسجيل الدخول لعرض دوراتك" : "Please login to view your courses");
      return;
    }

    // Prevent multiple loads
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadEnrollments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const enrollmentsData = await getMyEnrollments(dispatch);
        setEnrollments(enrollmentsData);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        // Don't redirect, just set error state - toast is already shown by API
        setError(
          language === "ar"
            ? "فشل في تحميل الدورات. يرجى المحاولة مرة أخرى."
            : "Failed to load courses. Please try again."
        );
        setEnrollments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnrollments();
  }, [dispatch, isAuthenticated, language]);

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter === "all") return true;
    return enrollment.status === filter;
  });

  // Get status label
  const getStatusLabel = (status: string) => {
    if (language === "ar") {
      switch (status) {
        case "active":
          return "نشط";
        case "completed":
          return "مكتمل";
        case "cancelled":
          return "ملغي";
        default:
          return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme === "dark"
          ? "bg-green-500/20 text-green-300 border-green-500/30"
          : "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return theme === "dark"
          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
          : "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return theme === "dark"
          ? "bg-red-500/20 text-red-300 border-red-500/30"
          : "bg-red-100 text-red-700 border-red-200";
      default:
        return theme === "dark"
          ? "bg-gray-500/20 text-gray-300 border-gray-500/30"
          : "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Format number for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Handle course click
  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  // Handle watch/continue course
  const handleWatchCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/courses/${courseId}/watch`);
  };

  // Retry loading
  const handleRetry = () => {
    hasLoadedRef.current = false;
    setError(null);
    setIsLoading(true);
    const loadEnrollments = async () => {
      try {
        const enrollmentsData = await getMyEnrollments(dispatch);
        setEnrollments(enrollmentsData);
        setError(null);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
        setError(
          language === "ar"
            ? "فشل في تحميل الدورات. يرجى المحاولة مرة أخرى."
            : "Failed to load courses. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadEnrollments();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  // Error state - show error message without redirect
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <AlertCircle
            className={`h-20 w-20 ${
              theme === "dark" ? "text-red-400" : "text-red-500"
            }`}
          />
          <h2
            className={`text-2xl font-bold text-center ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {error}
          </h2>
          <div className="flex gap-3">
            {!isAuthenticated ? (
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </button>
            ) : (
              <button
                onClick={handleRetry}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </button>
            )}
            <button
              onClick={() => router.push("/courses")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                theme === "dark"
                  ? "bg-blue-900/50 text-white hover:bg-blue-900"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {language === "ar" ? "تصفح الدورات" : "Browse Courses"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap
            className={`h-8 w-8 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "دوراتي" : "My Courses"}
          </h1>
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {language === "ar"
            ? "جميع الدورات المسجل فيها"
            : "All your enrolled courses"}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "active", "completed"] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === filterOption
                ? theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-blue-900/50 text-blue-200 hover:bg-blue-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filterOption === "all"
              ? language === "ar"
                ? "الكل"
                : "All"
              : filterOption === "active"
              ? language === "ar"
                ? "نشطة"
                : "Active"
              : language === "ar"
              ? "مكتملة"
              : "Completed"}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-black/20">
              {filterOption === "all"
                ? enrollments.length
                : enrollments.filter((e) => e.status === filterOption).length}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredEnrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <BookOpen
            className={`h-20 w-20 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {filter === "all"
              ? language === "ar"
                ? "لم تسجل في أي دورة بعد"
                : "You haven't enrolled in any courses yet"
              : language === "ar"
              ? "لا توجد دورات في هذا القسم"
              : "No courses in this section"}
          </h2>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "ابدأ رحلة التعلم الآن"
              : "Start your learning journey now"}
          </p>
          <button
            onClick={() => router.push("/courses")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {language === "ar" ? "تصفح الدورات" : "Browse Courses"}
          </button>
        </div>
      ) : (
        /* Courses Grid */
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredEnrollments.map((enrollment, index) => {
            const course =
              typeof enrollment.course === "object" ? enrollment.course : null;

            if (!course) return null;

            const courseTitle =
              language === "ar"
                ? course.title?.ar || course.title?.en
                : course.title?.en || course.title?.ar;

            const courseData = course as any;

            return (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCourseClick(course._id)}
                className={`cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                  theme === "dark"
                    ? "bg-blue-900/50 border border-blue-800/50 hover:border-blue-700"
                    : "bg-white border border-gray-200 hover:border-blue-300"
                }`}
              >
                {/* Course Image */}
                <div className="relative h-40 w-full">
                  <Image
                    src={courseData.thumbnail || "/images/courses/course-placeholder.jpg"}
                    alt={courseTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold border ${getStatusColor(
                        enrollment.status
                      )}`}
                    >
                      {getStatusLabel(enrollment.status)}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                    <button
                      onClick={(e) => handleWatchCourse(course._id, e)}
                      className="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-8 w-8" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3
                    className={`text-lg font-bold line-clamp-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {courseTitle}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    {/* Lessons */}
                    {courseData.totalLessons && (
                      <div className="flex items-center gap-1">
                        <BookOpen
                          className={`h-4 w-4 ${
                            theme === "dark" ? "text-blue-300" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }
                        >
                          {courseData.totalLessons}{" "}
                          {language === "ar" ? "درس" : "lessons"}
                        </span>
                      </div>
                    )}
                    {/* Duration */}
                    {courseData.durationHours && (
                      <div className="flex items-center gap-1">
                        <Clock
                          className={`h-4 w-4 ${
                            theme === "dark" ? "text-green-300" : "text-green-600"
                          }`}
                        />
                        <span
                          className={
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }
                        >
                          {courseData.durationHours}{" "}
                          {language === "ar" ? "ساعة" : "h"}
                        </span>
                      </div>
                    )}
                    {/* Play Count */}
                    {courseData.playCount !== undefined && courseData.playCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye
                          className={`h-4 w-4 ${
                            theme === "dark" ? "text-purple-300" : "text-purple-600"
                          }`}
                        />
                        <span
                          className={
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }
                        >
                          {formatNumber(courseData.playCount)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enrolled Date */}
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  >
                    {language === "ar" ? "تاريخ التسجيل: " : "Enrolled: "}
                    {new Date(enrollment.enrolledAt).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={(e) => handleWatchCourse(course._id, e)}
                    className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      enrollment.status === "completed"
                        ? theme === "dark"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                        : theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {enrollment.status === "completed" ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        {language === "ar" ? "مراجعة" : "Review"}
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        {language === "ar" ? "متابعة" : "Continue"}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
