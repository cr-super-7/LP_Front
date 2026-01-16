"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Lesson } from "../../../store/interface/lessonInterface";

interface CourseLessonsListProps {
  lessons: Lesson[];
  courseId: string;
  isLoading: boolean;
}

export default function CourseLessonsList({
  lessons,
  courseId,
  isLoading,
}: CourseLessonsListProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["all"])
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")} ${language === "ar" ? "ساعة" : "h"}`;
    }
    return `${minutes} ${language === "ar" ? "دقيقة" : "min"}`;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div
      className={`rounded-2xl p-6 h-96 overflow-y-auto ${
        theme === "dark"
          ? "bg-blue-900/50 border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {language === "ar" ? "محتوى الدورة" : "Course Content"}
        </h2>
        {lessons.length > 0 && (
          <span
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {lessons.length}{" "}
            {language === "ar" ? "درس" : lessons.length === 1 ? "lesson" : "lessons"}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : lessons.length === 0 ? (
        <div
          className={`text-center py-8 ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          <p>
            {language === "ar"
              ? "لا توجد دروس متاحة حالياً"
              : "No lessons available at the moment"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <button
              onClick={() => toggleSection("all")}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-blue-800/30 hover:bg-blue-800/50"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {expandedSections.has("all") ? (
                  <ChevronDown className="h-4 w-4 text-blue-400" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-blue-400" />
                )}
                <span
                  className={`font-semibold text-sm ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {language === "ar" ? "جميع الدروس" : "All Lessons"}
                </span>
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-blue-300" : "text-gray-500"
                  }`}
                >
                  ({lessons.length})
                </span>
              </div>
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-blue-300" : "text-gray-500"
                }`}
              >
                {lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0) > 0
                  ? formatDuration(
                      lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)
                    )
                  : ""}
              </span>
            </button>

            {expandedSections.has("all") && (
              <div className="mt-2 space-y-1">
                {[...lessons]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((lesson, index) => {
                    const lessonTitle =
                      language === "ar" ? lesson.title.ar : lesson.title.en;
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => router.push(`/courses/${courseId}/watch`)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-blue-800/30"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Play className="h-3 w-3 text-blue-400 shrink-0" />
                          <span
                            className={`text-xs font-medium truncate ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {index + 1}. {lessonTitle}
                          </span>
                          {lesson.isFree && (
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                theme === "dark"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {language === "ar" ? "مجاني" : "Free"}
                            </span>
                          )}
                          {!lesson.isFree && (
                            <Lock className="h-3 w-3 text-gray-400 shrink-0" />
                          )}
                        </div>
                        {lesson.duration && (
                          <span
                            className={`text-xs shrink-0 ${
                              theme === "dark" ? "text-blue-300" : "text-gray-500"
                            }`}
                          >
                            {formatDuration(lesson.duration)}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
