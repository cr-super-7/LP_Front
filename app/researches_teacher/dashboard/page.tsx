"use client";

import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import Background from "../../../components/layout/Background";
import Footer from "../../../components/layout/Footer";
import ResearchesDashboardContent from "../../../components/researches/instructor/ResearchesDashboardContent";
import RoleRedirect from "../../../components/auth/RoleRedirect";

export default function ResearchesTeacherDashboardPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <RoleRedirect blockRole="student" redirectTo="/researches_student">
      <div
        className={`relative min-h-screen overflow-x-hidden ${
          theme === "dark"
            ? "bg-linear-to-b from-blue-950 via-blue-900 to-blue-950"
            : "bg-linear-to-b from-white via-gray-50 to-white"
        }`}
      >
        <Background />

        <div className="relative z-10">
          <Sidebar />
          <Navbar />
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
            <ResearchesDashboardContent />
          </main>
          <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
            <Footer />
          </div>
        </div>
      </div>
    </RoleRedirect>
  );
}

