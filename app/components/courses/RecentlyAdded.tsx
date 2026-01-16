"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { getCourses } from "../../store/api/courseApi";
import type { Course } from "../../store/interface/courseInterface";
import CourseCardGrid from "./cards/CourseCardGrid";

export default function RecentlyAdded() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filterOptions = [
    { key: null, label: language === "ar" ? "الكل" : "All" },
    { key: "beginner", label: language === "ar" ? "مبتدئ" : "Beginner" },
    { key: "intermediate", label: language === "ar" ? "متوسط" : "Intermediate" },
    { key: "advanced", label: language === "ar" ? "متقدم" : "Advanced" },
  ];

  const selectedOption = filterOptions.find((opt) => opt.key === selectedLevel) || filterOptions[0];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        // Load all courses with pagination
        const response = await getCourses(
          {
            page: 1,
            limit: 100, // Load more courses to show all
            sort: "-createdAt",
          },
          dispatch
        );
        setAllCourses(response.courses); // Store all courses
      } catch (error) {
        console.error("Failed to load courses:", error);
        setAllCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [dispatch]);

  // Filter courses by selected level
  const filteredCourses = selectedLevel
    ? allCourses.filter((course) => course.level === selectedLevel)
    : allCourses;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
          {language === "ar" ? "كل الكورسات" : "All Courses"}
        </h2>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg border transition-colors min-w-[180px] ${
              theme === "dark"
                ? "border-blue-700 bg-blue-900/50 text-white hover:bg-blue-900"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">{selectedOption.label}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div
                className={`absolute top-full z-20 mt-2 min-w-[180px] rounded-lg border shadow-lg ${
                  language === "ar" ? "left-0" : "right-0"
                } ${
                  theme === "dark"
                    ? "border-blue-700 bg-blue-900/95 backdrop-blur-sm"
                    : "border-gray-300 bg-white shadow-xl"
                }`}
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.key || "all"}
                    onClick={() => {
                      setSelectedLevel(option.key);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      language === "ar" ? "text-right" : "text-left"
                    } ${
                      theme === "dark"
                        ? `text-white ${
                            selectedLevel === option.key
                              ? "bg-blue-600 font-medium"
                              : "hover:bg-blue-800/50"
                          }`
                        : `text-gray-900 ${
                            selectedLevel === option.key
                              ? "bg-blue-50 font-medium text-blue-600"
                              : "hover:bg-gray-50"
                          }`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-80 rounded-xl ${
                theme === "dark" ? "bg-blue-900/50" : "bg-gray-200"
              } animate-pulse`}
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
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
              ? selectedLevel
                ? `لا توجد دورات متاحة في مستوى ${filterOptions.find((t) => t.key === selectedLevel)?.label}`
                : "لا توجد دورات متاحة حالياً"
              : selectedLevel
              ? `No courses available at ${filterOptions.find((t) => t.key === selectedLevel)?.label} level`
              : "No courses available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
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

