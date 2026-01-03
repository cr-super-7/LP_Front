"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

interface CourseCardProps {
  instructor: string;
  courseName: string;
  university: string;
  description: string;
  lessons: number;
  students: number;
  hours: number;
  price?: string;
  rating?: number;
  installments?: boolean;
  image: string;
}

export default function CourseCard({
  instructor,
  courseName,
  university,
  description,
  lessons,
  students,
  hours,
  price,
  rating,
  installments,
  image,
}: CourseCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark" ? "bg-blue-900/50" : "bg-white"
      } border ${theme === "dark" ? "border-blue-800" : "border-gray-200"}`}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative w-full h-48">
        <Image src={image} alt={courseName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating and Installments */}
        {(rating || installments) && (
          <div className="flex items-center justify-between mb-2">
            {rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {rating}
                </span>
              </div>
            )}
            {installments && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  theme === "dark" ? "bg-green-900/50 text-green-400" : "bg-green-50 text-green-600"
                }`}
              >
                {t("courses.installmentsAvailable")}
              </span>
            )}
          </div>
        )}

        {/* Course Name */}
        <h3 className={`text-lg font-bold mb-1 ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
          {courseName}
        </h3>

        {/* Price */}
        {price && (
          <p className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
            {price}
          </p>
        )}

        {/* University */}
        <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{university}</p>

        {/* Description */}
        <p className={`text-sm mb-3 line-clamp-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            {lessons} {t("courses.lessons")}
          </span>
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            {students} {t("courses.students")}
          </span>
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            {hours} {t("courses.hours")}
          </span>
        </div>

        {/* Instructor */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {t("courses.instructor")}: <span className="font-semibold">{instructor}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

