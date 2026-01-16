"use client";

import { Clock, BookOpen, Award } from "lucide-react";
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
      </div>
    </div>
  );
}
