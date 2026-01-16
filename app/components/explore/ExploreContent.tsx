"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Briefcase, GraduationCap, Code } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";

export default function ExploreContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const isRTL = language === "ar";

  const handleUniversitiesClick = () => {
    router.push("/explore/universities");
  };

  const handleProfessionalCoursesClick = () => {
    router.push("/explore/categories");
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className={`text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "استكشف المحتوى التعليمي" : "Explore Educational Content"}
          </h1>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "اختر نوع المحتوى الذي تريد استكشافه"
              : "Choose the type of content you want to explore"}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Universities Option */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUniversitiesClick}
            className={`cursor-pointer rounded-xl p-8 transition-all duration-300 ${
              theme === "dark"
                ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                : "bg-white hover:bg-blue-50 border border-gray-200 shadow-lg hover:shadow-xl"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`p-6 rounded-full ${
                  theme === "dark" ? "bg-blue-800" : "bg-blue-100"
                }`}
              >
                <GraduationCap
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
              </div>
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {language === "ar" ? "الجامعات" : "Universities"}
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? "استكشف الجامعات والكليات والأقسام والدورات الأكاديمية"
                  : "Explore universities, colleges, departments, and academic courses"}
              </p>
            </div>
          </motion.div>

          {/* Professional Courses Option */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfessionalCoursesClick}
            className={`cursor-pointer rounded-xl p-8 transition-all duration-300 ${
              theme === "dark"
                ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                : "bg-white hover:bg-blue-50 border border-gray-200 shadow-lg hover:shadow-xl"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`p-6 rounded-full ${
                  theme === "dark" ? "bg-blue-800" : "bg-blue-100"
                }`}
              >
                <Code
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-blue-300" : "text-blue-600"
                  }`}
                />
              </div>
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {language === "ar" ? "الكورسات التقنية والمهنية" : "Professional & Technical Courses"}
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? "استكشف الكورسات التقنية والمهنية حسب الفئات"
                  : "Explore technical and professional courses by categories"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
