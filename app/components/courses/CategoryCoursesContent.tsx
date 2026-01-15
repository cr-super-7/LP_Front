"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getCoursesByCategory } from "../../store/api/courseApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Category } from "../../store/interface/categoryInterface";
import CourseCardGrid from "./cards/CourseCardGrid";
import toast from "react-hot-toast";

export default function CategoryCoursesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";
  const categoryId = params?.categoryId as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      router.push("/courses");
      return;
    }

    const loadCategoryCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getCoursesByCategory(categoryId, dispatch);
        setCategory(data.category);
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Failed to load category courses:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الدورات"
            : "Failed to load courses"
        );
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryCourses();
  }, [categoryId, dispatch, router, language]);

  const getCategoryName = (cat: Category | null): string => {
    if (!cat) return "";
    if (typeof cat.name === "string") {
      return cat.name;
    }
    return language === "ar" ? cat.name.ar : cat.name.en;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

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
          {isRTL ? (
            <ChevronLeft
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-400" : "text-gray-500"
              }`}
            />
          ) : (
            <ChevronRight
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-400" : "text-gray-500"
              }`}
            />
          )}
          <button
            onClick={() => router.push("/courses")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "الدورات" : "Courses"}
          </button>
          {isRTL ? (
            <ChevronLeft
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-400" : "text-gray-500"
              }`}
            />
          ) : (
            <ChevronRight
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-400" : "text-gray-500"
              }`}
            />
          )}
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {getCategoryName(category)}
          </span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="mb-3">

        <div className="flex items-center gap-4">
          {category?.image && (
            <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0">
              <Image
                src={category.image}
                alt={getCategoryName(category)}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div>
           
            {category && typeof category.description !== "string" && (
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? category.description?.ar
                  : category.description?.en}
              </p>
            )}
          </div>
        </div>
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
            {language === "ar" ? "دورة متاحة" : "courses available"}
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
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
            {language === "ar" ? "لا توجد دورات" : "No courses found"}
          </h2>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لا توجد دورات متاحة في هذه الفئة حالياً"
              : "No courses available in this category at the moment"}
          </p>
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
