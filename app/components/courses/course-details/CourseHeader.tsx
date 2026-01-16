"use client";

import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";

interface CourseHeaderProps {
  title: string;
  description: string;
}

export default function CourseHeader({ title, description }: CourseHeaderProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-4 ${
          theme === "dark" ? "text-white" : "text-blue-950"
        }`}
      >
        {title}
      </h1>
      <p
        className={`text-base leading-relaxed ${
          theme === "dark" ? "text-blue-200" : "text-gray-700"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
