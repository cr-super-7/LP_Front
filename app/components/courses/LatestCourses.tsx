"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { getCourses } from "../../store/api/courseApi";
import type { Course } from "../../store/interface/courseInterface";
import CourseCardGrid from "./cards/CourseCardGrid";

export default function LatestCourses() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLatestCourses = async () => {
      try {
        setIsLoading(true);
        // Fetch courses sorted by createdAt descending, limit to 3
        const response = await getCourses(
          {
            page: 1,
            limit: 3,
            sort: "-createdAt", // Sort by newest first
          },
          dispatch
        );
        setCourses(response.courses);
      } catch (error) {
        console.error("Failed to load latest courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestCourses();
  }, [dispatch]);

  // Get the 3 most recent courses based on createdAt date
  const latestCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [courses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
  if (latestCourses.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles
            className={`h-6 w-6 ${
              theme === "dark" ? "text-yellow-400" : "text-yellow-500"
            }`}
          />
          <h2
            className={`text-xl md:text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "أحدث الدورات" : "Latest Courses"}
          </h2>
        </div>
        <motion.div
          className={`text-center py-12 rounded-xl ${
            theme === "dark" ? "bg-blue-900/30" : "bg-gray-100"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles
            className={`h-12 w-12 mx-auto mb-4 ${
              theme === "dark" ? "text-blue-400" : "text-blue-500"
            }`}
          />
          <p
            className={`text-lg font-medium ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "لا توجد دورات جديدة حالياً"
              : "No new courses available at the moment"}
          </p>
          <p
            className={`text-sm mt-2 ${
              theme === "dark" ? "text-blue-300" : "text-gray-500"
            }`}
          >
            {language === "ar"
              ? "تابعنا لمعرفة آخر الدورات المضافة"
              : "Stay tuned for newly added courses"}
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles
              className={`h-6 w-6 ${
                theme === "dark" ? "text-yellow-400" : "text-yellow-500"
              }`}
            />
          </motion.div>
          <h2
            className={`text-xl md:text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "أحدث الدورات" : "Latest Courses"}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              theme === "dark"
                ? "bg-linear-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                : "bg-linear-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
            }`}
          >
            {language === "ar" ? "جديد" : "NEW"}
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

      {/* Courses Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {latestCourses.map((course) => (
          <motion.div key={course._id} variants={itemVariants}>
            <div className="relative">
              {/* "New" Badge on Card */}
              <div
                className={`absolute top-3 ${
                  isRTL ? "left-3" : "right-3"
                } z-10`}
              >
                <span
                  className={`px-2 py-1 rounded-md text-xs font-bold ${
                    theme === "dark"
                      ? "bg-linear-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30"
                      : "bg-linear-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-400/30"
                  }`}
                >
                  {language === "ar" ? "جديد" : "NEW"}
                </span>
              </div>
              <CourseCardGrid course={course} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
