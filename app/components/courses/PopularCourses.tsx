"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, ArrowLeft, Users, Eye, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { getCourses } from "../../store/api/courseApi";
import type { Course } from "../../store/interface/courseInterface";
import CourseCardGrid from "./cards/CourseCardGrid";

export default function PopularCourses() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPopularCourses = async () => {
      try {
        setIsLoading(true);
        // Fetch courses sorted by popularity - only 3 courses
        const response = await getCourses(
          {
            page: 1,
            limit: 3,
            sort: "popular", // Sort by popularity score
          },
          dispatch
        );
        setCourses(response.courses);
      } catch (error) {
        console.error("Failed to load popular courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularCourses();
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`h-8 w-48 rounded-lg animate-pulse ${
              theme === "dark" ? "bg-blue-900/50" : "bg-gray-200"
            }`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-80 rounded-xl animate-pulse ${
                theme === "dark" ? "bg-blue-900/50" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </section>
    );
  }

  // No courses state
  if (courses.length === 0) {
    return null; // Don't show section if no popular courses
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <TrendingUp
              className={`h-6 w-6 ${
                theme === "dark" ? "text-green-400" : "text-green-500"
              }`}
            />
          </motion.div>
          <h2
            className={`text-xl md:text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "الأكثر شعبية" : "Most Popular"}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              theme === "dark"
                ? "bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                : "bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
            }`}
          >
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {language === "ar" ? "رائج" : "TRENDING"}
            </span>
          </span>
        </div>

        {/* View All Link */}
        <motion.button
          onClick={() => {
            // Scroll to "All Courses" section
            const allCoursesSection = document.querySelector("#all-courses");
            if (allCoursesSection) {
              allCoursesSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            theme === "dark"
              ? "text-blue-300 hover:text-blue-200"
              : "text-blue-600 hover:text-blue-700"
          }`}
          whileHover={{ x: isRTL ? -5 : 5 }}
          transition={{ duration: 0.2 }}
        >
          {language === "ar" ? "عرض الكل" : "View All"}
          {isRTL ? (
            <ArrowLeft className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      {/* Stats Summary */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <Users
            className={`h-5 w-5 ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "الدورات الأكثر تسجيلاً"
              : "Most enrolled courses"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Eye
            className={`h-5 w-5 ${
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "الأكثر مشاهدة"
              : "Most viewed"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star
            className={`h-5 w-5 text-yellow-400 fill-yellow-400`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "أعلى تقييماً"
              : "Highest rated"}
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {courses.slice(0, 3).map((course, index) => (
          <motion.div key={course._id} variants={itemVariants}>
            <div className="relative">
              {/* Popularity Rank Badge */}
              {index < 3 && (
                <div
                  className={`absolute top-3 ${
                    isRTL ? "left-3" : "right-3"
                  } z-10`}
                >
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
                      index === 0
                        ? "bg-linear-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30"
                        : index === 1
                        ? "bg-linear-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/30"
                        : "bg-linear-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/30"
                    }`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    #{index + 1}
                  </span>
                </div>
              )}
              <CourseCardGrid course={course} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
