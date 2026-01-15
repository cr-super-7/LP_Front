"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  GraduationCap,
  MapPin,
  DollarSign,
  User,
  Award,
  Building2,
  School,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCourseById } from "../../store/api/courseApi";
import { addToCart } from "../../store/api/cartApi";
import type { Course } from "../../store/interface/courseInterface";
import toast from "react-hot-toast";

export default function CourseDetailsContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!courseId) {
      router.push("/courses");
      return;
    }

    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await getCourseById(courseId, dispatch);
        setCourse(courseData as unknown as Course);
      } catch (error) {
        console.error("Failed to load course:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل تفاصيل الدورة"
            : "Failed to load course details"
        );
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, dispatch, router, language]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error(
        language === "ar"
          ? "يرجى تسجيل الدخول أولاً"
          : "Please login first"
      );
      router.push("/login");
      return;
    }

    if (!course) return;

    try {
      setIsAddingToCart(true);
      await addToCart({ courseId: course._id }, dispatch);
      toast.success(
        language === "ar"
          ? "تم إضافة الدورة إلى السلة"
          : "Course added to cart"
      );
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
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
          {language === "ar" ? "الدورة غير موجودة" : "Course not found"}
        </h2>
      </div>
    );
  }

  const courseData = course as any; // Extended course data from API
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const courseDescription =
    language === "ar" ? course.description.ar : course.description.en;

  const getCategoryName = () => {
    if (courseData.category) {
      if (typeof courseData.category.name === "string") {
        return courseData.category.name;
      }
      return language === "ar"
        ? courseData.category.name?.ar
        : courseData.category.name?.en;
    }
    return "";
  };

  const getLevelLabel = () => {
    if (course.level === "beginner") {
      return language === "ar" ? "مبتدئ" : "Beginner";
    } else if (course.level === "intermediate") {
      return language === "ar" ? "متوسط" : "Intermediate";
    } else {
      return language === "ar" ? "متقدم" : "Advanced";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push("/")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "الرئيسية" : "Home"}
          </button>
          <span className={theme === "dark" ? "text-blue-400" : "text-gray-500"}>
            {isRTL ? "←" : ">"}
          </span>
          <button
            onClick={() => router.push("/courses")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "الدورات" : "Courses"}
          </button>
          {courseData.category && (
            <>
              <span
                className={theme === "dark" ? "text-blue-400" : "text-gray-500"}
              >
                {isRTL ? "←" : ">"}
              </span>
              <button
                onClick={() =>
                  router.push(`/courses/category/${courseData.category._id}`)
                }
                className={`hover:underline ${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              >
                {getCategoryName()}
              </button>
            </>
          )}
          <span className={theme === "dark" ? "text-blue-400" : "text-gray-500"}>
            {isRTL ? "←" : ">"}
          </span>
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {courseTitle}
          </span>
        </nav>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
          theme === "dark"
            ? "hover:bg-blue-900 text-blue-300"
            : "hover:bg-gray-100 text-blue-600"
        }`}
      >
        <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
        <span className="font-medium">
          {language === "ar" ? "العودة" : "Back"}
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Image */}
          <div className="relative w-full h-96 rounded-2xl overflow-hidden">
            <Image
              src={course.thumbnail || "/images/courses/course-placeholder.jpg"}
              alt={courseTitle}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              unoptimized
            />
          </div>

          {/* Course Title */}
          <div>
            <h1
              className={`text-3xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {courseTitle}
            </h1>
            <p
              className={`text-base leading-relaxed ${
                theme === "dark" ? "text-blue-200" : "text-gray-700"
              }`}
            >
              {courseDescription}
            </p>
          </div>

          {/* Course Information */}
          <div
            className={`rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "معلومات الدورة" : "Course Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              {courseData.category && (
                <div className="flex items-center gap-3">
                  <BookOpen
                    className={`h-5 w-5 shrink-0 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "الفئة" : "Category"}
                    </p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {getCategoryName()}
                    </p>
                  </div>
                </div>
              )}

              {/* Level */}
              <div className="flex items-center gap-3">
                <Award
                  className={`h-5 w-5 shrink-0 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  >
                    {language === "ar" ? "المستوى" : "Level"}
                  </p>
                  <p
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {getLevelLabel()}
                  </p>
                </div>
              </div>

              {/* Duration */}
              {course.durationHours && (
                <div className="flex items-center gap-3">
                  <Clock
                    className={`h-5 w-5 shrink-0 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "المدة" : "Duration"}
                    </p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.durationHours}{" "}
                      {language === "ar" ? "ساعة" : "hours"}
                    </p>
                  </div>
                </div>
              )}

              {/* Total Lessons */}
              {course.totalLessons && (
                <div className="flex items-center gap-3">
                  <BookOpen
                    className={`h-5 w-5 shrink-0 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar" ? "عدد الدروس" : "Total Lessons"}
                    </p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.totalLessons}{" "}
                      {language === "ar" ? "درس" : "lessons"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* University/Institution Information */}
          {course.courseType === "university" && courseData.department && (
            <div
              className={`rounded-2xl p-6 ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "معلومات المؤسسة" : "Institution Information"}
              </h2>

              <div className="space-y-4">
                {/* University */}
                {courseData.department.college?.university && (
                  <div className="flex items-start gap-3">
                    <Building2
                      className={`h-5 w-5 shrink-0 mt-1 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {courseData.department.college.university.name}
                      </p>
                      {courseData.department.college.university.location && (
                        <div className="flex items-center gap-1">
                          <MapPin
                            className={`h-4 w-4 ${
                              theme === "dark" ? "text-blue-300" : "text-blue-600"
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            {courseData.department.college.university.location}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* College */}
                {courseData.department.college && (
                  <div className="flex items-start gap-3">
                    <School
                      className={`h-5 w-5 shrink-0 mt-1 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {language === "ar"
                          ? courseData.department.college.name?.ar
                          : courseData.department.college.name?.en}
                      </p>
                    </div>
                  </div>
                )}

                {/* Department */}
                <div className="flex items-start gap-3">
                  <GraduationCap
                    className={`h-5 w-5 shrink-0 mt-1 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language === "ar"
                        ? courseData.department.name?.ar
                        : courseData.department.name?.en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Others Place Information */}
          {course.courseType === "others" && courseData.othersPlace && (
            <div
              className={`rounded-2xl p-6 ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "معلومات المكان" : "Location Information"}
              </h2>

              <div className="flex items-start gap-3">
                <MapPin
                  className={`h-5 w-5 shrink-0 mt-1 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {language === "ar"
                      ? courseData.othersPlace.name?.ar
                      : courseData.othersPlace.name?.en}
                  </p>
                  {courseData.othersPlace.location && (
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar"
                        ? courseData.othersPlace.location?.ar
                        : courseData.othersPlace.location?.en}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div
            className={`sticky top-24 rounded-2xl p-6 ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "السعر" : "Price"}
                </p>
              </div>
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {course.price} {course.currency}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAddingToCart
                  ? language === "ar"
                    ? "جاري الإضافة..."
                    : "Adding..."
                  : language === "ar"
                  ? "إضافة إلى السلة"
                  : "Add to Cart"}
              </button>

              <button
                className={`w-full px-4 py-3 rounded-lg border-2 font-semibold transition-colors flex items-center justify-center gap-2 ${
                  theme === "dark"
                    ? "border-blue-600 text-blue-300 hover:bg-blue-600/20"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Heart className="h-5 w-5" />
                {language === "ar" ? "إضافة إلى المفضلة" : "Add to Wishlist"}
              </button>
            </div>

            {/* Course Stats */}
            <div className="mt-6 pt-6 border-t border-blue-800/30 space-y-3">
              {course.durationHours && (
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar" ? "المدة" : "Duration"}
                  </span>
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {course.durationHours}{" "}
                    {language === "ar" ? "ساعة" : "hours"}
                  </span>
                </div>
              )}

              {course.totalLessons && (
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar" ? "عدد الدروس" : "Lessons"}
                  </span>
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {course.totalLessons}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "المستوى" : "Level"}
                </span>
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getLevelLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
