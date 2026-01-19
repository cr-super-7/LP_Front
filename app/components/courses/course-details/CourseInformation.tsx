"use client";

import { Clock, BookOpen, Award, Users, Eye, ShoppingCart, TrendingUp } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Course } from "../../../store/interface/courseInterface";

interface CourseInformationProps {
  course: Course;
  categoryName: string;
  levelLabel: string;
}

export default function CourseInformation({
  course,
  categoryName,
  levelLabel,
}: CourseInformationProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  // Format number for display (e.g., 1500 -> 1.5K)
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
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
        {categoryName && (
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
                {categoryName}
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
              {levelLabel}
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

        {/* Enroll Count - New */}
        {course.enrollCount !== undefined && course.enrollCount > 0 && (
          <div className="flex items-center gap-3">
            <Users
              className={`h-5 w-5 shrink-0 ${
                theme === "dark" ? "text-green-300" : "text-green-600"
              }`}
            />
            <div>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                {language === "ar" ? "عدد المسجلين" : "Enrolled Students"}
              </p>
              <p
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {formatNumber(course.enrollCount)}{" "}
                {language === "ar" ? "طالب" : "students"}
              </p>
            </div>
          </div>
        )}

        {/* Play Count - New */}
        {course.playCount !== undefined && course.playCount > 0 && (
          <div className="flex items-center gap-3">
            <Eye
              className={`h-5 w-5 shrink-0 ${
                theme === "dark" ? "text-purple-300" : "text-purple-600"
              }`}
            />
            <div>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                {language === "ar" ? "عدد المشاهدات" : "Total Views"}
              </p>
              <p
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {formatNumber(course.playCount)}{" "}
                {language === "ar" ? "مشاهدة" : "views"}
              </p>
            </div>
          </div>
        )}

        {/* Purchase Count - New */}
        {course.purchaseCount !== undefined && course.purchaseCount > 0 && (
          <div className="flex items-center gap-3">
            <ShoppingCart
              className={`h-5 w-5 shrink-0 ${
                theme === "dark" ? "text-orange-300" : "text-orange-600"
              }`}
            />
            <div>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                {language === "ar" ? "عدد الشراءات" : "Purchases"}
              </p>
              <p
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {formatNumber(course.purchaseCount)}{" "}
                {language === "ar" ? "شراء" : "purchases"}
              </p>
            </div>
          </div>
        )}

        {/* Popularity Score - New */}
        {course.popularityScore !== undefined && course.popularityScore > 0 && (
          <div className="flex items-center gap-3">
            <TrendingUp
              className={`h-5 w-5 shrink-0 ${
                theme === "dark" ? "text-yellow-300" : "text-yellow-600"
              }`}
            />
            <div>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                {language === "ar" ? "نقاط الشعبية" : "Popularity Score"}
              </p>
              <p
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {course.popularityScore.toFixed(0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
