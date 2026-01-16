"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Code, ChevronRight, Grid3x3 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getCategories } from "../../store/api/categoryApi";
import type { Category } from "../../store/interface/categoryInterface";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CategoriesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories(dispatch);
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الفئات"
            : "Failed to load categories"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [dispatch, language]);

  const getCategoryName = (category: Category): string => {
    if (typeof category.name === "string") {
      return category.name;
    }
    return language === "ar" ? category.name.ar : category.name.en;
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/explore/categories/${categoryId}/courses`);
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
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {language === "ar" ? "الفئات" : "Categories"}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الفئات التقنية والمهنية" : "Technical & Professional Categories"}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "اختر فئة لاستكشاف الكورسات التقنية والمهنية"
              : "Select a category to explore technical and professional courses"}
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg ${
              theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
            }`}
          >
            <Grid3x3
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
                ? "لا توجد فئات متاحة"
                : "No categories available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                    : "bg-white hover:bg-blue-50 border border-gray-200 shadow-md hover:shadow-lg"
                }`}
              >
                <div className="relative h-48 w-full">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={getCategoryName(category)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        theme === "dark" ? "bg-blue-800" : "bg-gray-200"
                      }`}
                    >
                      <Code
                        className={`h-16 w-16 ${
                          theme === "dark" ? "text-blue-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {getCategoryName(category)}
                  </h3>
                  {typeof category.description === "object" &&
                  category.description ? (
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {language === "ar"
                        ? category.description.ar
                        : category.description.en}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
