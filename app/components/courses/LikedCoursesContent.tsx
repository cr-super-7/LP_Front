"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getWishlist } from "../../store/api/wishlistApi";
import type { Course } from "../../store/interface/courseInterface";
import CourseCardGrid from "./cards/CourseCardGrid";
import toast from "react-hot-toast";

export default function LikedCoursesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isRTL = language === "ar";

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(
        language === "ar"
          ? "يرجى تسجيل الدخول أولاً"
          : "Please login first"
      );
      router.push("/login");
      return;
    }

    const loadLikedCourses = async () => {
      try {
        setIsLoading(true);
        const wishlist = await getWishlist(dispatch);
        
        // Extract courses from wishlist items
        const likedCourses = wishlist.items
          .filter((item) => item.course)
          .map((item) => item.course as Course);
        
        setCourses(likedCourses);
      } catch (error) {
        console.error("Failed to load liked courses:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الكورسات المفضلة"
            : "Failed to load liked courses"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedCourses();
  }, [dispatch, router, language, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Heart
            className={`h-8 w-8 ${
              theme === "dark" ? "text-red-400" : "text-red-500"
            }`}
          />
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "الكورسات المفضلة" : "Liked Courses"}
          </h1>
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {language === "ar"
            ? "جميع الكورسات التي قمت بإضافتها إلى قائمة المفضلة"
            : "All courses you've added to your wishlist"}
        </p>
      </div>

      {/* Courses Count */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BookOpen
            className={`h-5 w-5 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <p
            className={`text-sm font-medium ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {courses.length}{" "}
            {language === "ar" ? "دورة مفضلة" : "liked courses"}
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Heart
            className={`h-20 w-20 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "لا توجد كورسات مفضلة" : "No liked courses"}
          </h2>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لم تقم بإضافة أي كورسات إلى قائمة المفضلة بعد"
              : "You haven't added any courses to your wishlist yet"}
          </p>
          <button
            onClick={() => router.push("/courses")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {language === "ar" ? "تصفح الكورسات" : "Browse Courses"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCardGrid key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
