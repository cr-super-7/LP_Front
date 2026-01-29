"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Pencil,
  ChevronRight,
  ChevronLeft,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyPrivateLessons, deletePrivateLesson } from "../../store/api/privateLessonApi";
import PrivateLessonCard from "./PrivateLessonCard";
import PrivateLessonTypeModal from "./PrivateLessonTypeModal";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";
import { useMemo } from "react";

export default function MyPrivateLessonsContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { privateLessons, isLoading } = useAppSelector((state) => state.privateLesson);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

  // Load private lessons on mount
  useEffect(() => {
    const loadLessons = async () => {
      try {
        await getMyPrivateLessons(dispatch);
      } catch (error) {
        console.error("Failed to load private lessons:", error);
      }
    };
    loadLessons();
  }, [dispatch]);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleContinue = (lessonId: string) => {
    router.push(`/private-lessons/my-lessons/${lessonId}`);
  };

  // Filter private lessons based on selected filter
  const filteredLessons = useMemo(() => {
    if (filterStatus === "all") {
      return privateLessons;
    } else if (filterStatus === "approved") {
      return privateLessons.filter((lesson) => lesson.status === "approved");
    } else if (filterStatus === "pending") {
      return privateLessons.filter((lesson) => lesson.status === "pending" || (!lesson.status && !lesson.isPublished));
    } else if (filterStatus === "rejected") {
      return privateLessons.filter((lesson) => lesson.status === "rejected");
    }
    return privateLessons;
  }, [privateLessons, filterStatus]);

  // Handle delete lesson confirmation
  const handleDeleteClick = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setIsDeleteModalOpen(true);
  };

  // Handle delete lesson
  const handleDeleteConfirm = async () => {
    if (!lessonToDelete) return;
    
    try {
      await deletePrivateLesson(lessonToDelete, dispatch);
      await getMyPrivateLessons(dispatch); // Reload lessons after deletion
      setIsDeleteModalOpen(false);
      setLessonToDelete(null);
    } catch (error) {
      console.error("Failed to delete private lesson:", error);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Top Banner - Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-800/30">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <Image
            src="/myCourse.jpg"
            alt="Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Dark Blue Overlay */}
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-gray-700/80" : "bg-gray-300/80"
          }`}
        ></div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {/* Pencil Icon - Yellow with red eraser */}
                <div className="relative">
                  <Pencil className="h-6 w-6 text-yellow-400" strokeWidth={2.5} />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <h1
                  className={`text-3xl md:text-4xl font-bold ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar"
                    ? "شارك خبرتك. ألهم العقول."
                    : "Share Your Expertise. Inspire Minds."}
                </h1>
              </div>
              <p
                className={`text-lg max-w-2xl ${
                  theme === "dark" ? "text-white/90" : "text-blue-950/90"
                }`}
              >
                {language === "ar"
                  ? "أنشئ دورة البحث التالية وساعد المتعلمين على النمو — سواء كانت دورة سريعة أو برنامج كامل، أنت على بعد خطوات قليلة من إحداث تأثير."
                  : "Create your next research and help learners grow — whether it's a quick tutorial or a full program, you're just a few steps away from making an impact."}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <span>
                {language === "ar" ? "دروسك الخصوصية" : "My Private Lessons"}
              </span>
              {language === "ar" ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter
              className={`h-5 w-5 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-blue-200" : "text-gray-700"
              }`}
            >
              {language === "ar" ? "فلترة حسب الحالة" : "Filter by Status"}
            </span>
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "approved" | "pending" | "rejected")
              }
              className={`appearance-none px-4 py-2 pr-10 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-blue-800/30 border-blue-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
            >
              <option value="all">
                {language === "ar" ? "جميع الدروس" : "All Lessons"}
              </option>
              <option value="approved">
                {language === "ar" ? "معتمدة" : "Approved"}
              </option>
              <option value="pending">
                {language === "ar" ? "قيد المراجعة" : "Pending"}
              </option>
              <option value="rejected">
                {language === "ar" ? "مرفوضة" : "Rejected"}
              </option>
            </select>
            <ChevronDown
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                theme === "dark" ? "text-blue-300" : "text-gray-500"
              }`}
            />
          </div>
        </div>
        <div
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {filteredLessons.length}{" "}
          {language === "ar" ? "درس" : "lesson"}
          {filteredLessons.length !== 1 ? (language === "ar" ? "" : "s") : ""}
        </div>
      </div>

      {/* Continue Creating Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
            }`}
          >
            
          </div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "دروسك الخصوصية" : "Your Private Lessons"}
          </h2>
        </div>

        {isLoading ? (
          <div
            className={`text-center py-8 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <PrivateLessonCard
                key={lesson._id}
                lesson={lesson}
                theme={theme}
                language={language}
                onContinue={() => handleContinue(lesson._id)}
                onDelete={() => handleDeleteClick(lesson._id)}
              />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            <p className="text-lg">
              {language === "ar"
                ? "لا توجد دروس خاصة بعد. ابدأ بإنشاء درس جديد!"
                : "No private lessons yet. Start by creating a new lesson!"}
            </p>
          </div>
        )}
      </div>

      {/* Lesson Type Modal */}
      <PrivateLessonTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLessonToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={language === "ar" ? "تأكيد حذف الدرس الخصوصي" : "Confirm Delete Private Lesson"}
        message={
          language === "ar"
            ? "هل أنت متأكد من حذف هذا الدرس الخصوصي؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to delete this private lesson? This action cannot be undone."
        }
      />
    </div>
  );
}
