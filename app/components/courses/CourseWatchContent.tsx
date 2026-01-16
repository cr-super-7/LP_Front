"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  Play,
  Lock,
  Clock,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Course } from "../../store/interface/courseInterface";
import type { Lesson } from "../../store/interface/lessonInterface";

interface CourseWatchContentProps {
  course: Course;
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  onLessonSelect: (lessonId: string) => void;
}

export default function CourseWatchContent({
  course,
  lessons,
  selectedLesson,
  onLessonSelect,
}: CourseWatchContentProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const isRTL = language === "ar";

  const courseData = course as any;
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")} ${language === "ar" ? "ساعة" : "h"}`;
    }
    return `${minutes} ${language === "ar" ? "دقيقة" : "min"}`;
  };

  const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/courses/${course._id}`)}
        className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
          theme === "dark"
            ? "hover:bg-blue-900 text-blue-300"
            : "hover:bg-gray-100 text-blue-600"
        }`}
      >
        <ChevronLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
        <span className="font-medium">
          {language === "ar" ? "العودة" : "Back"}
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Course Title */}
          <div>
            <h1
              className={`text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {courseTitle}
            </h1>
          </div>

          {/* Video Player */}
          {selectedLesson ? (
            <div className="space-y-4">
              <div
                className={`rounded-xl overflow-hidden border-2 ${
                  theme === "dark"
                    ? "border-blue-700/50 bg-blue-900/20"
                    : "border-blue-200 bg-gray-50"
                }`}
              >
                <div className="relative aspect-video bg-black">
                  <video
                    src={selectedLesson.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                  />
                </div>
              </div>

              {/* Lesson Info */}
              <div
                className={`rounded-xl p-6 ${
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
                  {language === "ar"
                    ? selectedLesson.title.ar
                    : selectedLesson.title.en}
                </h2>

                <div className="flex items-center gap-4 flex-wrap">
                  {selectedLesson.duration && (
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`h-4 w-4 ${
                          theme === "dark" ? "text-blue-300" : "text-blue-600"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {formatDuration(selectedLesson.duration)}
                      </span>
                    </div>
                  )}
                  {selectedLesson.isFree && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        theme === "dark"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {language === "ar" ? "مجاني" : "Free"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-xl p-12 text-center ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? "اختر درساً للمشاهدة"
                  : "Select a lesson to watch"}
              </p>
            </div>
          )}
        </div>

        {/* Lessons List Sidebar */}
        <div className="lg:col-span-1">
          <div
            className={`sticky top-24 rounded-xl p-4 ${
              theme === "dark"
                ? "bg-blue-900/50 border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "قائمة الدروس" : "Lessons"}
            </h3>

            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {sortedLessons.map((lesson, index) => {
                const lessonTitle =
                  language === "ar" ? lesson.title.ar : lesson.title.en;
                const isSelected = selectedLesson?._id === lesson._id;

                return (
                  <button
                    key={lesson._id}
                    onClick={() => onLessonSelect(lesson._id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? theme === "dark"
                          ? "bg-blue-700 border-2 border-blue-500"
                          : "bg-blue-50 border-2 border-blue-500"
                        : theme === "dark"
                        ? "bg-blue-800/30 hover:bg-blue-800/50 border border-blue-700/50"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          isSelected
                            ? theme === "dark"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-600 text-white"
                            : theme === "dark"
                            ? "bg-blue-700/50 text-blue-300"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isSelected
                              ? theme === "dark"
                                ? "text-white"
                                : "text-blue-950"
                              : theme === "dark"
                              ? "text-blue-200"
                              : "text-gray-900"
                          }`}
                        >
                          {lessonTitle}
                        </p>
                        {lesson.duration && (
                          <p
                            className={`text-xs mt-1 ${
                              theme === "dark" ? "text-blue-300" : "text-gray-500"
                            }`}
                          >
                            {formatDuration(lesson.duration)}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1">
                        {lesson.isFree ? (
                          <Play
                            className={`h-4 w-4 ${
                              isSelected
                                ? "text-white"
                                : theme === "dark"
                                ? "text-blue-300"
                                : "text-blue-600"
                            }`}
                          />
                        ) : (
                          <Lock
                            className={`h-4 w-4 ${
                              theme === "dark" ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                        )}
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
