"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { getCourses } from "../../store/api/courseApi";
import type { Course } from "../../store/interface/courseInterface";
import CourseCardGrid from "./cards/CourseCardGrid";

export default function ContinueLearning() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("beginner");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { key: "beginner", label: t("courses.beginner") },
    { key: "intermediate", label: t("courses.intermediate") },
    { key: "advanced", label: t("courses.advanced") },
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const response = await getCourses(
          {
            page: 1,
            limit: 6,
            sort: "-createdAt",
          },
          dispatch
        );
        
        // Filter courses by level
        const filteredCourses = response.courses.filter(
          (course) => course.level === activeTab
        );
        
        setCourses(filteredCourses.slice(0, 2)); // Show max 2 courses
      } catch (error) {
        console.error("Failed to load courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [activeTab, dispatch]);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
          {t("courses.continueLearning")}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-blue-900/50 text-gray-300 hover:bg-blue-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <div
              key={index}
              className={`h-64 rounded-xl ${
                theme === "dark" ? "bg-blue-900/50" : "bg-gray-200"
              } animate-pulse`}
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div
          className={`text-center py-8 rounded-xl ${
            theme === "dark" ? "bg-blue-900/30" : "bg-gray-100"
          }`}
        >
          <p
            className={`${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لا توجد دورات متاحة في هذا المستوى"
              : "No courses available at this level"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCardGrid course={course} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

