"use client";

import { useState, useEffect, useMemo } from "react";
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

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setIsDeleteModalOpen(true);
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
          <div className="space-y-4">
            {sortedLessons.map((lesson, index) => {
              const lessonTitle = typeof lesson.title === "string"
                ? lesson.title
                : language === "ar"
                ? lesson.title.ar || lesson.title.en
                : lesson.title.en || lesson.title.ar;

              const lessonTitleAr = typeof lesson.title === "string" ? "" : lesson.title.ar || "";
              const lessonTitleEn = typeof lesson.title === "string" ? "" : lesson.title.en || "";

              return (
                <div
                  key={lesson._id}
                  className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700/50 hover:border-blue-600"
                      : "bg-gray-50 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Header with Title and Status */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`text-sm font-bold ${
                                theme === "dark" ? "text-blue-300" : "text-blue-600"
                              }`}
                            >
                              #{index + 1}
                            </span>
                            <h3
                              className={`text-xl font-bold ${
                                theme === "dark" ? "text-white" : "text-blue-950"
                              }`}
                            >
                              {lessonTitle}
                            </h3>
                            {lesson.status && (
                              <div className="flex items-center gap-1">
                                {getStatusIcon(lesson.status)}
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded ${
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
                          
                          {/* Bilingual Titles */}
                          {(lessonTitleAr || lessonTitleEn) && (
                            <div className="flex flex-col gap-1 mb-2">
                              {lessonTitleAr && (
                                <p
                                  className={`text-sm ${
                                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                                  }`}
                                >
                                  <span className="font-semibold">AR:</span> {lessonTitleAr}
                                </p>
                              )}
                              {lessonTitleEn && (
                                <p
                                  className={`text-sm ${
                                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                                  }`}
                                >
                                  <span className="font-semibold">EN:</span> {lessonTitleEn}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Lesson Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Duration */}
                        {lesson.duration && (
                          <div
                            className={`p-3 rounded-lg ${
                              theme === "dark"
                                ? "bg-blue-900/30 border border-blue-700/30"
                                : "bg-blue-50 border border-blue-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock
                                className={`h-4 w-4 ${
                                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                                }`}
                              />
                              <span
                                className={`text-sm font-semibold ${
                                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                                }`}
                              >
                                {language === "ar" ? "المدة:" : "Duration:"}
                              </span>
                              <span
                                className={`text-sm ${
                                  theme === "dark" ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {lesson.duration} {language === "ar" ? "دقيقة" : "minutes"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Is Free */}
                        <div
                          className={`p-3 rounded-lg ${
                            theme === "dark"
                              ? "bg-blue-900/30 border border-blue-700/30"
                              : "bg-blue-50 border border-blue-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                theme === "dark" ? "text-blue-200" : "text-gray-700"
                              }`}
                            >
                              {language === "ar" ? "نوع الدرس:" : "Lesson Type:"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                lesson.isFree
                                  ? theme === "dark"
                                    ? "bg-green-800/50 text-green-300"
                                    : "bg-green-100 text-green-700"
                                  : theme === "dark"
                                  ? "bg-blue-800/50 text-blue-300"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {lesson.isFree
                                ? language === "ar"
                                  ? "مجاني"
                                  : "Free"
                                : language === "ar"
                                ? "مدفوع"
                                : "Paid"}
                            </span>
                          </div>
                        </div>

                        {/* Created At */}
                        {lesson.createdAt && (
                          <div
                            className={`p-3 rounded-lg ${
                              theme === "dark"
                                ? "bg-blue-900/30 border border-blue-700/30"
                                : "bg-blue-50 border border-blue-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Calendar
                                className={`h-4 w-4 ${
                                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                                }`}
                              />
                              <span
                                className={`text-sm font-semibold ${
                                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                                }`}
                              >
                                {language === "ar" ? "تاريخ الإنشاء:" : "Created:"}
                              </span>
                              <span
                                className={`text-xs ${
                                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                                }`}
                              >
                                {formatDate(lesson.createdAt)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Updated At */}
                        {lesson.updatedAt && lesson.updatedAt !== lesson.createdAt && (
                          <div
                            className={`p-3 rounded-lg ${
                              theme === "dark"
                                ? "bg-blue-900/30 border border-blue-700/30"
                                : "bg-blue-50 border border-blue-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Calendar
                                className={`h-4 w-4 ${
                                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                                }`}
                              />
                              <span
                                className={`text-sm font-semibold ${
                                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                                }`}
                              >
                                {language === "ar" ? "آخر تحديث:" : "Updated:"}
                              </span>
                              <span
                                className={`text-xs ${
                                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                                }`}
                              >
                                {formatDate(lesson.updatedAt)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video Preview */}
                      {lesson.videoUrl && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Video
                              className={`h-5 w-5 ${
                                theme === "dark" ? "text-blue-300" : "text-blue-600"
                              }`}
                            />
                            <span
                              className={`text-sm font-semibold ${
                                theme === "dark" ? "text-blue-200" : "text-gray-700"
                              }`}
                            >
                              {language === "ar" ? "معاينة الفيديو" : "Video Preview"}
                            </span>
                          </div>
                          <div
                            className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                              theme === "dark"
                                ? "border-blue-700/50 hover:border-blue-600"
                                : "border-blue-200 hover:border-blue-400"
                            } hover:shadow-xl`}
                          >
                            {/* Video Player */}
                            <div className="relative aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                              <video
                                src={lesson.videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                              />
                              {/* Overlay with play button animation */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300 pointer-events-none">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div
                                    className={`p-4 rounded-full backdrop-blur-sm ${
                                      theme === "dark"
                                        ? "bg-blue-600/80"
                                        : "bg-blue-500/80"
                                    } animate-pulse`}
                                  >
                                    <Play
                                      className={`h-8 w-8 ${
                                        theme === "dark" ? "text-white" : "text-white"
                                      }`}
                                      fill="currentColor"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Video Info Bar */}
                            <div
                              className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent ${
                                theme === "dark" ? "text-white" : "text-white"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">
                                  {lesson.duration} {language === "ar" ? "دقيقة" : "min"}
                                </span>
                                <a
                                  href={lesson.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs font-medium hover:underline transition-all hover:scale-105"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {language === "ar" ? "فتح في نافذة جديدة" : "Open in new tab"}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {lesson.rejectionReason && (
                        <div
                          className={`p-3 rounded-lg border ${
                            theme === "dark"
                              ? "bg-red-900/20 border-red-700/50"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <p
                            className={`text-sm font-semibold mb-1 ${
                              theme === "dark" ? "text-red-300" : "text-red-700"
                            }`}
                          >
                            {language === "ar" ? "سبب الرفض:" : "Rejection Reason:"}
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-red-200" : "text-red-600"
                            }`}
                          >
                            {lesson.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleEditLesson(lesson)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-blue-800/50 text-blue-300"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                        aria-label={language === "ar" ? "تعديل" : "Edit"}
                        title={language === "ar" ? "تعديل" : "Edit"}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-red-800/50 text-red-300"
                            : "hover:bg-red-100 text-red-600"
                        }`}
                        aria-label={language === "ar" ? "حذف" : "Delete"}
                        title={language === "ar" ? "حذف" : "Delete"}
                      >
                        <Trash2 className="h-5 w-5" />
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
