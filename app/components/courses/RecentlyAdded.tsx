"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import CourseCard from "./CourseCard";

export default function RecentlyAdded() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const courses = [
    {
      instructor: "MR. Mohammad",
      courseName: "Programming Basics",
      university: "imam mohammad ibn saud islamic university",
      description: "Learn the fundamentals of programming with hands-on exercises and real-world examples.",
      lessons: 15,
      students: 500,
      hours: 15,
      price: "1400 SAR",
      rating: 4.3,
      installments: true,
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
      price: "1400 SAR",
      rating: 4.3,
      installments: true,
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
      price: "1400 SAR",
      rating: 4.3,
      installments: true,
      image: "/home/course.png",
    },
  ];

  return (
    <section>
      <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
        {t("courses.recentlyAdded")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

