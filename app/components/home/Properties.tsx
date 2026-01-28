"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Properties() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const properties = [
    {
      id: 1,
      labelKey: "properties.courses",
      position: "top-left",
      imageBg: "from-amber-200 to-amber-400",
      delay: 0.1,
      image: "/home/course.png",
    },
    {
      id: 2,
      labelKey: "properties.privateLessons",
      position: "bottom-left",
      imageBg: "from-blue-200 to-blue-400",
      delay: 0.2,
      image: "/home/privet_lessons.png",
    },
    {
      id: 3,
      labelKey: "properties.inquiry",
      position: "top-right",
      imageBg: "from-gray-200 to-gray-400",
      delay: 0.3,
      image: "/home/inquiring.png",
    },
    {
      id: 4,
      labelKey: "properties.research",
      position: "bottom-right",
      imageBg: "from-purple-200 to-purple-400",
      image: "/home/R&S.png",
      delay: 0.4,
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  const circleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <section className="px-4 md:px-8 py-8 md:py-16">
      <div className="flex flex-col items-center gap-3 md:gap-4">
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t("properties.title")}</h2>
        <p className={`text-base md:text-lg ${theme === "dark" ? "text-white" : "text-gray-700"}`}>{t("properties.subtitle")}</p>

        {/* Mobile: Stacked layout - 4 circles */}
        <motion.div
          className="flex flex-col items-center gap-8 mt-8 md:hidden w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {properties.map((property) => {
            const MobileCircleContent = (
              <motion.div
                className={`relative h-40 w-40 cursor-pointer`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 border-dashed ${theme === "dark" ? "border-white" : "border-blue-950"}`}
                  initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 360,
                  }}
                  transition={{
                    opacity: { duration: 0.8, ease: "easeOut" },
                    scale: { duration: 0.8, ease: "easeOut" },
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                ></motion.div>
                <motion.div
                  className={`absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-full overflow-hidden bg-linear-to-b ${property.imageBg}`}
                  variants={circleVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {property.image ? (
                    <Image
                      src={property.image}
                      alt={t(property.labelKey)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 160px, 192px"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200"></div>
                  )}
                </motion.div>
                <motion.div
                  className={`absolute right-2 top-8 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-500"} px-3 py-1.5 shadow-lg`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: property.delay + 0.3, duration: 0.5 }}
                >
                  <span className={`text-xs font-medium ${theme === "dark" ? "text-white" : "text-white"}`}>{t(property.labelKey)}</span>
                </motion.div>
              </motion.div>
            );

            return (
              <motion.div
                key={property.id}
                className="w-full flex justify-center"
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {property.id === 1 ? (
                  <Link href="/courses">{MobileCircleContent}</Link>
                ) : property.id === 4 ? (
                  <Link href="/researches_student">{MobileCircleContent}</Link>
                ) : property.id === 3 ? (
                  <Link href="/inquiry">{MobileCircleContent}</Link>
                ) : property.id === 2 ? (
                  <Link href="/privet_lessons_student">{MobileCircleContent}</Link>
                ) : (
                  MobileCircleContent
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tablet and Desktop: Grid layout for properties - 4 circles */}
        <motion.div
          className="hidden md:block relative mt-8 md:mt-12 lg:mt-16 h-64 md:h-80 lg:h-96 w-full max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {properties.map((property) => {
            let positionClasses = "";
            if (property.position === "top-left") {
              positionClasses = "absolute left-0 top-0";
            } else if (property.position === "bottom-left") {
              positionClasses = "absolute bottom-0 left-40 md:left-60 lg:left-80";
            } else if (property.position === "top-right") {
              positionClasses = "absolute right-40 md:right-60 lg:right-80 top-0";
            } else if (property.position === "bottom-right") {
              positionClasses = "absolute bottom-0 right-0";
            }

            const CircleContent = (
              <motion.div
                className={`relative h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 cursor-pointer`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                  <motion.div
                    className={`absolute inset-0 rounded-full border-2 border-dashed ${theme === "dark" ? "border-white" : "border-blue-950"}`}
                    initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 360,
                    }}
                    transition={{
                      opacity: { duration: 0.8, ease: "easeOut" },
                      scale: { duration: 0.8, ease: "easeOut" },
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  ></motion.div>
                  <motion.div
                    className={`absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-full overflow-hidden bg-linear-to-b ${property.imageBg}`}
                    variants={circleVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {property.image ? (
                      <Image
                        src={property.image}
                        alt={t(property.labelKey)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200"></div>
                    )}
                  </motion.div>
                  <motion.div
                    className={`absolute -right-5 top-6 md:top-8 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-500"} px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 shadow-lg`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: property.delay + 0.3, duration: 0.5 }}
                  >
                    <span className={`text-xs md:text-sm font-medium ${theme === "dark" ? "text-white" : "text-white"}`}>{t(property.labelKey)}</span>
                  </motion.div>
                </motion.div>
            );

            return (
              <motion.div
                key={property.id}
                className={positionClasses}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {property.id === 1 ? (
                  <Link href="/courses">{CircleContent}</Link>
                ) : property.id === 4 ? (
                  <Link href="/researches_student">{CircleContent}</Link>
                ) : property.id === 3 ? (
                  <Link href="/inquiry">{CircleContent}</Link>
                ) : property.id === 2 ? (
                  <Link href="/privet_lessons_student">{CircleContent}</Link>
                ) : (
                  CircleContent
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

