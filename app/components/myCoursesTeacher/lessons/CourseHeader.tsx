"use client";

import Image from "next/image";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { Course } from "../../../store/interface/courseInterface";

interface CourseHeaderProps {
  course: Course;
  title: string;
  description: string;
  imageUrl: string;
}

export default function CourseHeader({ course, title, description, imageUrl }: CourseHeaderProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Course Image */}
      <div className="relative w-full h-64 md:h-80">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Course Info */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Title */}
        <h1
          className={`text-3xl md:text-4xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          className={`text-lg ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
