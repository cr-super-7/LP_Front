"use client";

import Image from "next/image";
import { Clock, RefreshCw, ExternalLink } from "lucide-react";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";

interface PrivateLessonCardProps {
  lesson: PrivateLesson;
  theme: "dark" | "light";
  language: "ar" | "en";
  onContinue?: () => void;
}

export default function PrivateLessonCard({
  lesson,
  theme,
  language,
  onContinue,
}: PrivateLessonCardProps) {
  // Get localized lesson name and description
  const lessonName =
    language === "ar"
      ? lesson.lessonName.ar || lesson.lessonName.en
      : lesson.lessonName.en || lesson.lessonName.ar;

  const description =
    language === "ar"
      ? lesson.description.ar || lesson.description.en
      : lesson.description.en || lesson.description.ar;

  // Format level
  const levelLabels: Record<string, { ar: string; en: string }> = {
    beginner: { ar: "مبتدئ", en: "Beginner" },
    intermediate: { ar: "متوسط", en: "Intermediate" },
    advanced: { ar: "متقدم", en: "Advanced" },
  };
  const levelLabel = levelLabels[lesson.lessonLevel]?.[language] || lesson.lessonLevel;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Get image URL
  const imageUrl = lesson.instructorImage || "/home/privet_lessons.png";

  // Get status text
  const getStatusText = () => {
    if (lesson.status === "pending") {
      return language === "ar" ? "قيد المراجعة" : "Pending Review";
    }
    if (lesson.status === "approved") {
      return language === "ar" ? "معتمد" : "Approved";
    }
    if (lesson.status === "rejected") {
      return language === "ar" ? "مرفوض" : "Rejected";
    }
    return language === "ar" ? "هذا الدرس ليس له حالة" : "This course have no statue";
  };

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Lesson Image */}
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={lessonName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Lesson Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {lessonName}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          {lesson.courseHours !== undefined && (
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
                {lesson.courseHours} {language === "ar" ? "س" : "h"}
              </span>
            </div>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              theme === "dark"
                ? "bg-blue-800/50 text-blue-300"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {levelLabel}
          </span>
          {lesson.price && (
            <span
              className={`text-sm font-semibold ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            >
              {lesson.price} {lesson.currency}
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className={`text-sm line-clamp-3 ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Created Date */}
        {lesson.createdAt && (
          <p
            className={`text-xs ${
              theme === "dark" ? "text-blue-300" : "text-gray-500"
            }`}
          >
            {language === "ar" ? "تم الإنشاء في" : "Created on"}{" "}
            {formatDate(lesson.createdAt)}
          </p>
        )}

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-xs ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {getStatusText()}
            </span>
          </div>
          <button
            onClick={onContinue}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <span>{language === "ar" ? "متابعة" : "Continue"}</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
