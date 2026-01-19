"use client";

import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import Background from "../layout/Background";
import Footer from "../layout/Footer";
import CoursesProperties from "./CoursesProperties";
import LatestCourses from "./LatestCourses";
import RecentlyAdded from "./RecentlyAdded";

export default function CoursesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${
      theme === "dark" ? "bg-blue-950" : "bg-gray-50"
    }`}>
      <Background />
      
      {/* Content with relative positioning */}
      <div className="relative z-10">
        <Sidebar />
        <Navbar />
        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
          <div className="max-w-7xl mx-auto">
            <CoursesProperties />
            <LatestCourses />
            <div id="all-courses">
              <RecentlyAdded />
            </div>
          </div>
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

