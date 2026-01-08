"use client";

import { Calendar, Globe } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Course } from "../../../store/interface/courseInterface";

interface CourseMetaProps {
  course: Course;
  formatDate: (dateString: string) => string;
}

export default function CourseMeta({ course, formatDate }: CourseMetaProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-blue-800/30">
      {course.createdAt && (
        <div className="flex items-center gap-2">
          <Calendar
            className={`h-4 w-4 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "تم الإنشاء في" : "Created on"}{" "}
            {formatDate(course.createdAt)}
          </span>
        </div>
      )}
      {course.isPublished && (
        <div className="flex items-center gap-2">
          <Globe
            className={`h-4 w-4 ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-green-300" : "text-green-700"
            }`}
          >
            {language === "ar" ? "منشور" : "Published"}
          </span>
        </div>
      )}
    </div>
  );
}
