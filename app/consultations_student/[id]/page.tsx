"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import Background from "../../components/layout/Background";
import Footer from "../../components/layout/Footer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getConsultationById } from "../../store/api/consultationApi";
import StudentConsultationDetailsContent from "../../components/consultations/student/StudentConsultationDetailsContent";

export default function StudentConsultationDetailsPage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const consultationId = params?.id as string;
  const { currentConsultation, isLoading } = useAppSelector((s) => s.consultation);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const isStudent = user?.role === "student";

  useEffect(() => {
    if (!consultationId) return;
    if (!isAuthenticated) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      router.replace("/login");
      return;
    }
    if (!isStudent) {
      toast.error(language === "ar" ? "هذه الصفحة للطلاب فقط" : "This page is for students only");
      router.replace("/profile/student");
    }
  }, [consultationId, isAuthenticated, isStudent, language, router]);

  useEffect(() => {
    if (!consultationId || !isAuthenticated || !isStudent) return;
    getConsultationById(consultationId, dispatch).catch((e) => {
      console.error("Failed to load consultation:", e);
    });
  }, [consultationId, dispatch, isAuthenticated, isStudent]);

  if (!consultationId) {
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
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "معرف الاستشارة غير موجود" : "Consultation ID not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
          <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]`}>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </main>
        </div>
      </div>
    );
  }

  if (!currentConsultation) {
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
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar" ? "الاستشارة غير موجودة" : "Consultation not found"}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
          <StudentConsultationDetailsContent consultation={currentConsultation} />
        </main>
        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

