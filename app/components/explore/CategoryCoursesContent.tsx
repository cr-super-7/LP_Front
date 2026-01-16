"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BookOpen, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getCourses } from "../../store/api/courseApi";
import { getCategoryById } from "../../store/api/categoryApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Category } from "../../store/interface/categoryInterface";
import CourseCardGrid from "../courses/cards/CourseCardGrid";
import toast from "react-hot-toast";

export default function CategoryCoursesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";
  const categoryId = params?.categoryId as string;

  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      router.push("/explore/categories");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load category
        const categoryData = await getCategoryById(categoryId, dispatch);
        setCategory(categoryData);

        // Load courses filtered by category and courseType = others
        const response = await getCourses(
          {
            page: 1,
            limit: 100,
            sort: "-createdAt",
            category: categoryId,
            courseType: "others",
          },
          dispatch
        );

        setCourses(response.courses);
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الدورات"
            : "Failed to load courses"
        );
        router.push("/explore/categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => router.push("/explore")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "استكشف" : "Explore"}
          </button>
          <ChevronRight
            className={`h-4 w-4 ${
              theme === "dark" ? "text-blue-400" : "text-gray-500"
            } ${isRTL ? "rotate-180" : ""}`}
          />
          <button
            onClick={() => router.push("/explore/categories")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "الفئات" : "Categories"}
          </button>
          <ChevronRight
            className={`h-4 w-4 ${
              theme === "dark" ? "text-blue-400" : "text-gray-500"
            } ${isRTL ? "rotate-180" : ""}`}
          />
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {getCategoryName(category)}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الدورات" : "Courses"} - {getCategoryName(category)}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? `تم العثور على ${courses.length} دورة`
              : `Found ${courses.length} courses`}
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg ${
              theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
            }`}
          >
            <BookOpen
              className={`h-16 w-16 mx-auto mb-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "لا توجد دورات متاحة"
                : "No courses available"}
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
    </div>
  );
}
