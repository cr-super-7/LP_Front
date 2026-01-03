"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Statistics() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const statistics = [
    {
      id: 1,
      icon: (
        <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      value: "+6000",
      labelKey: "statistics.students",
      position: "top-left",
    },
    {
      id: 2,
      icon: (
        <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      value: "+1400",
      labelKey: "statistics.courses",
      position: "top-right",
    },
    {
      id: 3,
      icon: (
        <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      value: "+900",
      labelKey: "statistics.instructor",
      position: "bottom-center",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <section className="px-4 md:px-8 py-12 md:py-20">
      <motion.div
        className="flex flex-col items-center gap-8 md:gap-12 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Mobile: Stacked layout */}
        <div className="flex flex-col items-center gap-6 md:hidden w-full">
          {statistics.map((stat) => (
            <motion.div
              key={stat.id}
              className={`w-full max-w-sm rounded-2xl p-6 border-2 ${
                theme === "dark"
                  ? "bg-blue-900/50 border-blue-400/30 backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 backdrop-blur-sm"
              } shadow-lg`}
              variants={cardVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                  {stat.icon}
                </div>
                <motion.div
                  className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}
                  variants={numberVariants}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {stat.value}
                </motion.div>
                <p className={`text-lg font-medium ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>
                  {t(stat.labelKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tablet and Desktop: Grid layout */}
        <div className="hidden md:block w-full">
          <div className="grid grid-cols-2 gap-6 lg:gap-8 ">
            {/* Top row: Students and Courses */}
            {statistics
              .filter((stat) => stat.position !== "bottom-center")
              .map((stat) => (
                <motion.div
                  key={stat.id}
                  className={`rounded-2xl p-8 lg:p-10 border-2 ${
                    theme === "dark"
                      ? "bg-blue-900/50 border-blue-400/30 backdrop-blur-sm"
                      : "bg-white/80 border-gray-200 backdrop-blur-sm"
                  } shadow-lg`}
                  variants={cardVariants}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                      {stat.icon}
                    </div>
                    <motion.div
                      className={`text-5xl lg:text-6xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}
                      variants={numberVariants}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {stat.value}
                    </motion.div>
                    <p className={`text-xl lg:text-2xl font-medium ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>
                      {t(stat.labelKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
          
          {/* Bottom row: Instructor (centered and wider) */}
          <div className="flex justify-center mt-6 lg:mt-8">
            {statistics
              .filter((stat) => stat.position === "bottom-center")
              .map((stat) => (
                <motion.div
                  key={stat.id}
                  className={`w-full  rounded-2xl p-8 lg:p-10 border-2 ${
                    theme === "dark"
                      ? "bg-blue-900/50 border-blue-400/30 backdrop-blur-sm"
                      : "bg-white/80 border-gray-200 backdrop-blur-sm"
                  } shadow-lg`}
                  variants={cardVariants}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                      {stat.icon}
                    </div>
                    <motion.div
                      className={`text-5xl lg:text-6xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}
                      variants={numberVariants}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {stat.value}
                    </motion.div>
                    <p className={`text-xl lg:text-2xl font-medium ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>
                      {t(stat.labelKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

