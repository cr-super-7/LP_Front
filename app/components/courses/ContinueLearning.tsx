"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import CourseCard from "./CourseCard";

export default function ContinueLearning() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("beginner");

  const tabs = [
    { key: "beginner", label: t("courses.beginner") },
    { key: "intermediate", label: t("courses.intermediate") },
    { key: "advanced", label: t("courses.advanced") },
  ];

  const courses = [
    {
      instructor: "MR. Sahar",
      courseName: "Programming Basics",
      university: "imam mohammad ibn saud islamic university",
      description: "Learn the fundamentals of programming with hands-on exercises and real-world examples.",
      lessons: 15,
      students: 500,
      hours: 15,
      image: "/home/course.png",
    },
    {
      instructor: "MR. Mohammad",
      courseName: "Programming Basics",
      university: "imam mohammad ibn saud islamic university",
      description: "Learn the fundamentals of programming with hands-on exercises and real-world examples.",
      lessons: 15,
      students: 500,
      hours: 15,
      image: "/home/course.png",
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard {...course} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

