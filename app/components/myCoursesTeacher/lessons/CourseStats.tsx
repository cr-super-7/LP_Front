"use client";

import { BookOpen, Clock, GraduationCap, DollarSign } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Course } from "../../../store/interface/courseInterface";

interface CourseStatsProps {
  course: Course;
  levelLabel: string;
}

export default function CourseStats({ course, levelLabel }: CourseStatsProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Lessons */}
      {course.totalLessons !== undefined && (
        <div
          className={`p-4 rounded-lg ${
            theme === "dark"
              ? "bg-blue-800/30 border border-blue-700/50"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen
              className={`h-5 w-5 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar" ? "عدد الدروس" : "Total Lessons"}
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {course.totalLessons}
          </p>
        </div>
      )}

      {/* Duration */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-blue-800/30 border border-blue-700/50"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock
            className={`h-5 w-5 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "المدة" : "Duration"}
          </span>
        </div>
        <p
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {course.durationHours} {language === "ar" ? "س" : "h"}
        </p>
      </div>

      {/* Level */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-blue-800/30 border border-blue-700/50"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap
            className={`h-5 w-5 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "المستوى" : "Level"}
          </span>
        </div>
        <p
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {levelLabel}
        </p>
      </div>

      {/* Price */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-blue-800/30 border border-blue-700/50"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <DollarSign
            className={`h-5 w-5 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "السعر" : "Price"}
          </span>
        </div>
        <p
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {course.price} {course.currency}
        </p>
      </div>
    </div>
  );
}
