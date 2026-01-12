"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileText, Play, Plus, Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle, Calendar, Video, ExternalLink } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getLessonsByCourse, deleteLesson } from "../../../store/api/lessonApi";
import AddLessonModal from "./AddLessonModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import type { Course } from "../../../store/interface/courseInterface";
import type { Lesson } from "../../../store/interface/lessonInterface";

interface LessonsSectionProps {
  course: Course;
}

export default function LessonsSection({ course }: LessonsSectionProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { lessons, isLoading } = useAppSelector((state) => state.lesson);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

  // Load lessons when component mounts or course changes
  useEffect(() => {
    if (course._id) {
      getLessonsByCourse(course._id, dispatch).catch((error) => {
        console.error("Failed to load lessons:", error);
      });
    }
  }, [course._id, dispatch]);

  const handleAddLesson = () => {
    setSelectedLesson(null);
    setIsAddModalOpen(true);
  };


  const handleDeleteLesson = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLessonToDelete(lessonId);
    setIsDeleteModalOpen(true);
  };

  const handleLessonClick = (lessonId: string) => {
    router.push(`/myCoursesTeacher/lessons/${lessonId}`);
  };

  const handleEditLesson = (lesson: Lesson, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return;
    
    try {
      await deleteLesson(lessonToDelete, dispatch);
      // Reload lessons
      if (course._id) {
        await getLessonsByCourse(course._id, dispatch);
      }
      setLessonToDelete(null);
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  };

  const handleModalSuccess = async () => {
    // Reload lessons after adding/updating
    if (course._id) {
      await getLessonsByCourse(course._id, dispatch);
    }
  };

  // Sort lessons by createdAt (oldest first)
  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB; // Oldest first
    });
  }, [lessons]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "approved":
        return language === "ar" ? "موافق عليه" : "Approved";
      case "rejected":
        return language === "ar" ? "مرفوض" : "Rejected";
      case "pending":
        return language === "ar" ? "في انتظار الموافقة" : "Pending";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className={`rounded-2xl p-6 md:p-8 shadow-xl ${
          theme === "dark"
            ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText
              className={`h-6 w-6 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "دروس الدورة" : "Course Lessons"}
            </h2>
          </div>
          <button
            onClick={handleAddLesson}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="h-4 w-4" />
            {language === "ar" ? "إضافة درس" : "Add Lesson"}
          </button>
        </div>

        {/* Lessons List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />
          </div>
        ) : sortedLessons.length > 0 ? (
          <div className="space-y-2">
            {sortedLessons.map((lesson, index) => {
              const lessonTitle = typeof lesson.title === "string"
                ? lesson.title
                : language === "ar"
                ? lesson.title.ar || lesson.title.en
                : lesson.title.en || lesson.title.ar;

              return (
                <div
                  key={lesson._id}
                  onClick={() => handleLessonClick(lesson._id)}
                  className={`group relative p-4 rounded-lg border transition-all cursor-pointer ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700/50 hover:bg-blue-800/50 hover:border-blue-600"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 w-full">
                    {/* Lesson Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <Play
                          className={`h-4 w-4 ${
                            theme === "dark" ? "text-blue-300" : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-medium truncate ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {index + 1}. {lessonTitle}
                        </h3>
                        {lesson.status && (
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(lesson.status)}
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                lesson.status === "approved"
                                  ? theme === "dark"
                                    ? "bg-green-800/50 text-green-300"
                                    : "bg-green-100 text-green-700"
                                  : lesson.status === "rejected"
                                  ? theme === "dark"
                                    ? "bg-red-800/50 text-red-300"
                                    : "bg-red-100 text-red-700"
                                  : theme === "dark"
                                  ? "bg-yellow-800/50 text-yellow-300"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {getStatusLabel(lesson.status)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    {lesson.duration && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock
                          className={`h-4 w-4 ${
                            theme === "dark" ? "text-blue-300" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {lesson.duration}{language === "ar" ? "د" : "min"}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => handleEditLesson(lesson, e)}
                        className={`p-1.5 rounded transition-colors ${
                          theme === "dark"
                            ? "hover:bg-blue-800/50 text-blue-300"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                        aria-label={language === "ar" ? "تعديل" : "Edit"}
                        title={language === "ar" ? "تعديل" : "Edit"}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteLesson(lesson._id, e)}
                        className={`p-1.5 rounded transition-colors ${
                          theme === "dark"
                            ? "hover:bg-red-800/50 text-red-300"
                            : "hover:bg-red-100 text-red-600"
                        }`}
                        aria-label={language === "ar" ? "حذف" : "Delete"}
                        title={language === "ar" ? "حذف" : "Delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`p-8 rounded-lg text-center ${
              theme === "dark"
                ? "bg-blue-800/30 border border-blue-700/50"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Play
              className={`h-12 w-12 mx-auto mb-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <p
              className={`text-lg ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "لا توجد دروس بعد. أضف دروساً للدورة"
                : "No lessons yet. Add lessons to the course"}
            </p>
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        courseId={course._id}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Lesson Modal */}
      <AddLessonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLesson(null);
        }}
        courseId={course._id}
        lesson={selectedLesson}
        onSuccess={handleModalSuccess}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLessonToDelete(null);
        }}
        onConfirm={confirmDeleteLesson}
        title={language === "ar" ? "تأكيد حذف الدرس" : "Confirm Delete Lesson"}
        message={language === "ar" ? "هل أنت متأكد من حذف هذا الدرس؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this lesson? This action cannot be undone."}
      />
    </>
  );
}
