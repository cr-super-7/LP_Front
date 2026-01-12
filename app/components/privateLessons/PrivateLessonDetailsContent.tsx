"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { deletePrivateLesson } from "../../store/api/privateLessonApi";
import UpdatePrivateLessonModal from "./UpdatePrivateLessonModal";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";
import toast from "react-hot-toast";

interface PrivateLessonDetailsContentProps {
  lesson: PrivateLesson;
}

export default function PrivateLessonDetailsContent({ lesson }: PrivateLessonDetailsContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Get localized content
  const lessonName =
    language === "ar" ? lesson.lessonName.ar || lesson.lessonName.en : lesson.lessonName.en || lesson.lessonName.ar;

  const description =
    language === "ar" ? lesson.description.ar || lesson.description.en : lesson.description.en || lesson.description.ar;

  const instructorName =
    language === "ar"
      ? lesson.instructorName.ar || lesson.instructorName.en
      : lesson.instructorName.en || lesson.instructorName.ar;

  const jobTitle =
    lesson.jobTitle && (language === "ar" ? lesson.jobTitle.ar || lesson.jobTitle.en : lesson.jobTitle.en || lesson.jobTitle.ar);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format level
  const levelLabels: Record<string, { ar: string; en: string }> = {
    beginner: { ar: "مبتدئ", en: "Beginner" },
    intermediate: { ar: "متوسط", en: "Intermediate" },
    advanced: { ar: "متقدم", en: "Advanced" },
  };
  const levelLabel = levelLabels[lesson.lessonLevel]?.[language] || lesson.lessonLevel;

  // Get status icon and label
  const getStatusInfo = () => {
    switch (lesson.status) {
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: language === "ar" ? "معتمد" : "Approved",
          color: "green",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          label: language === "ar" ? "مرفوض" : "Rejected",
          color: "red",
        };
      case "pending":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          label: language === "ar" ? "قيد المراجعة" : "Pending Review",
          color: "yellow",
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
          label: language === "ar" ? "لا توجد حالة" : "No Status",
          color: "gray",
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Get lesson type label
  const lessonTypeLabel =
    lesson.lessonType === "department"
      ? language === "ar"
        ? "تابع لقسم"
        : "Department"
      : language === "ar"
      ? "مهني"
      : "Professional";

  // Handle delete
  const handleDelete = async () => {
    try {
      await deletePrivateLesson(lesson._id, dispatch);
      toast.success(language === "ar" ? "تم حذف الدرس الخاص بنجاح" : "Private lesson deleted successfully");
      router.push("/private-lessons/my-lessons");
    } catch (error) {
      console.error("Failed to delete private lesson:", error);
    }
  };

  // Handle update success
  const handleUpdateSuccess = async () => {
    setIsEditModalOpen(false);
    // Reload the lesson
    router.refresh();
  };

  // Get image URL
  const imageUrl = lesson.instructorImage || "/home/privet_lessons.png";

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button and Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-blue-900/50 text-blue-300"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{language === "ar" ? "رجوع" : "Back"}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Edit className="h-4 w-4" />
            <span>{language === "ar" ? "تعديل" : "Edit"}</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>{language === "ar" ? "حذف" : "Delete"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div
        className={`rounded-2xl p-6 md:p-8 shadow-xl ${
          theme === "dark"
            ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Instructor Image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={instructorName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "المدرس" : "Instructor"}
                </h3>
                <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {instructorName}
                </p>
                {jobTitle && (
                  <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>{jobTitle}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "الحالة" : "Status"}
                </h3>
                <div className="flex items-center gap-2">
                  {statusInfo.icon}
                  <span
                    className={`text-sm font-medium ${
                      statusInfo.color === "green"
                        ? theme === "dark"
                          ? "text-green-400"
                          : "text-green-600"
                        : statusInfo.color === "red"
                        ? theme === "dark"
                          ? "text-red-400"
                          : "text-red-600"
                        : statusInfo.color === "yellow"
                        ? theme === "dark"
                          ? "text-yellow-400"
                          : "text-yellow-600"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Lesson Type */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "نوع الدرس" : "Lesson Type"}
                </h3>
                <div className="flex items-center gap-2">
                  {lesson.lessonType === "department" ? (
                    <GraduationCap
                      className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}
                    />
                  ) : (
                    <Briefcase className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  )}
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {lessonTypeLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Name */}
            <div>
              <h1
                className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {lessonName}
              </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <span
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar" ? "المستوى" : "Level"}
                  </span>
                </div>
                <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {levelLabel}
                </p>
              </div>

              {lesson.courseHours && (
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                    <span
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "الساعات" : "Hours"}
                    </span>
                  </div>
                  <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {lesson.courseHours} {language === "ar" ? "س" : "h"}
                  </p>
                </div>
              )}

              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <span
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar" ? "السعر" : "Price"}
                  </span>
                </div>
                <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {lesson.price} {lesson.currency}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <span
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {language === "ar" ? "تاريخ الإنشاء" : "Created"}
                  </span>
                </div>
                <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {formatDate(lesson.createdAt)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2
                className={`text-xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "الوصف" : "Description"}
              </h2>
              <p className={`text-base leading-relaxed ${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
                {description}
              </p>
            </div>

            {/* Department Info (if department type) */}
            {lesson.lessonType === "department" && lesson.department && (
              <div>
                <h2
                  className={`text-xl font-bold mb-3 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "معلومات القسم" : "Department Information"}
                </h2>
                <div
                  className={`p-4 rounded-lg space-y-2 ${
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                  }`}
                >
                  <div>
                    <span
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "القسم: " : "Department: "}
                    </span>
                    <span className={`text-base ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                      {language === "ar" ? lesson.department.name.ar : lesson.department.name.en}
                    </span>
                  </div>
                  {lesson.department.college && (
                    <div>
                      <span
                        className={`text-sm font-semibold ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {language === "ar" ? "الكلية: " : "College: "}
                      </span>
                      <span className={`text-base ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                        {language === "ar" ? lesson.department.college.name.ar : lesson.department.college.name.en}
                      </span>
                    </div>
                  )}
                  {lesson.department.college?.university && (
                    <div>
                      <span
                        className={`text-sm font-semibold ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {language === "ar" ? "الجامعة: " : "University: "}
                      </span>
                      <span className={`text-base ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                        {language === "ar"
                          ? lesson.department.college.university.name.ar
                          : lesson.department.college.university.name.en}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2
                className={`text-xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "الموقع" : "Location"}
              </h2>
              <a
                href={lesson.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors`}
              >
                <MapPin className="h-5 w-5" />
                <span className="underline">{language === "ar" ? "عرض على الخريطة" : "View on Map"}</span>
              </a>
            </div>

            {/* Schedule */}
            {lesson.schedule && lesson.schedule.length > 0 && (
              <div>
                <h2
                  className={`text-xl font-bold mb-3 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "الجدول الزمني" : "Schedule"}
                </h2>
                <div className="space-y-2">
                  {lesson.schedule.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                        <div>
                          <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                            {formatDate(item.date)} - {item.time}
                          </p>
                          <p className={`text-xs ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                            {language === "ar" ? "المدة: " : "Duration: "}
                            {item.duration} {language === "ar" ? "ساعة" : "hours"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {isEditModalOpen && (
        <UpdatePrivateLessonModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          lesson={lesson}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={language === "ar" ? "تأكيد حذف الدرس الخاص" : "Confirm Delete Private Lesson"}
        message={
          language === "ar"
            ? "هل أنت متأكد من حذف هذا الدرس الخاص؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to delete this private lesson? This action cannot be undone."
        }
      />
    </div>
  );
}
