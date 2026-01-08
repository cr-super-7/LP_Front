"use client";

import { FileText, Play } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Course } from "../../../store/interface/courseInterface";

interface LessonsSectionProps {
  course: Course;
}

export default function LessonsSection({ course }: LessonsSectionProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div
      className={`rounded-2xl p-6 md:p-8 shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <FileText
          className={`h-6 w-6 ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}
        />
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {language === "ar" ? "دروس الدورة" : "Course Lessons"}
        </h2>
      </div>

      {/* Lessons List - Placeholder for now */}
      <div className="space-y-4">
        {course.totalLessons && course.totalLessons > 0 ? (
          <div
            className={`p-4 rounded-lg ${
              theme === "dark"
                ? "bg-blue-800/30 border border-blue-700/50"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-center ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "سيتم عرض الدروس هنا قريباً"
                : "Lessons will be displayed here soon"}
            </p>
          </div>
        ) : (
          <div
            className={`p-8 rounded-lg text-center ${
              theme === "dark"
                ? "bg-blue-800/30 border border-blue-700/50"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Play
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
                ? "لا توجد دروس بعد. أضف دروساً للدورة"
                : "No lessons yet. Add lessons to the course"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
