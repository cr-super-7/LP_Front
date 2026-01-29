"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppSelector } from "../store/hooks";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Background from "../components/layout/Background";
import Footer from "../components/layout/Footer";
import StudentBookingsContent from "../components/bookings/student/StudentBookingsContent";

export default function BookingsStudentPageClient() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const router = useRouter();

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const isStudent = user?.role === "student";

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.replace("/login");
      return;
    }
    if (!isStudent) {
      toast.error(language === "ar" ? "هذه الصفحة للطلاب فقط" : "This page is for students only");
      router.replace("/courses");
    }
  }, [isAuthenticated, isStudent, language, router]);

  return (
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
          <StudentBookingsContent />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

