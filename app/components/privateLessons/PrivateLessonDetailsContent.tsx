"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deletePrivateLesson } from "../../store/api/privateLessonApi";
import UpdatePrivateLessonModal from "./UpdatePrivateLessonModal";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";
import {
  ArrowLeft,
  Clock,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Star,
  User,
  TrendingUp,
} from "lucide-react";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";
import type { RootState } from "../../store/store";
import toast from "react-hot-toast";

interface PrivateLessonDetailsContentProps {
  lesson: PrivateLesson;
}

export default function PrivateLessonDetailsContent({ lesson }: PrivateLessonDetailsContentProps) {
  const { language } = useLanguage(); 
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Check if current user is the instructor (owner of the lesson)
  const isInstructor = user?.role === "instructor";
  const userId = user?.id;
  const isOwner = isInstructor && userId && 
    (typeof lesson.instructor === "object" 
      ? lesson.instructor.user === userId || lesson.instructor._id === userId
      : lesson.instructor === userId);

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
        hour: "2-digit",
        minute: "2-digit",
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
        ? "أكاديمي"
        : "Academic"
      : language === "ar"
      ? "مهني"
      : "Professional";

  // Get price info
  const getPrice = (lesson: PrivateLesson): { price: number; label: string } | null => {
    if (lesson.packagePrice) {
      return {
        price: lesson.packagePrice,
        label: language === "ar" ? "سعر الباقة" : "Package Price"
      };
    }
    if (lesson.oneLessonPrice) {
      return {
        price: lesson.oneLessonPrice,
        label: language === "ar" ? "سعر الدرس" : "Lesson Price"
      };
    }
    if (lesson.price) {
      return {
        price: lesson.price,
        label: language === "ar" ? "السعر" : "Price"
      };
    }
    return null;
  };

  const priceInfo = getPrice(lesson);

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
    router.refresh();
  };

  // Get image URL
  const imageUrl = lesson.instructorImage || "/home/privet_lessons.png";

  // Get department name
  const getDepartmentName = (): string | null => {
    if (lesson.lessonType === "department" && lesson.department) {
      return language === "ar" ? lesson.department.name.ar : lesson.department.name.en;
    }
    return null;
  };

  const departmentName = getDepartmentName();

  return (
    <div className="p-6">
      {/* Header with Back Button and Actions */}
      <div className="mb-6 flex items-center justify-between">
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

        {/* Show Edit/Delete buttons only for lesson owner */}
        {isOwner && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
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
              <span>{language === "ar" ? "حذف" : "Delete"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar + Article Content */}
      <div className="flex flex-row gap-4 md:gap-6">
        {/* Main Article Content (Large Box) */}
        <article className="flex-1 min-w-0">
          <div
            className={`rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl ${
              theme === "dark"
                ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Article Title */}
            <header className="mb-8">
              <h1
                className={`text-3xl md:text-4xl font-bold leading-tight mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {lessonName}
              </h1>
              
              {/* Rating Display */}
              {lesson.averageRating !== undefined && lesson.averageRating !== null && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {lesson.averageRating.toFixed(1)}
                    </span>
                  </div>
                  {lesson.totalReviews !== undefined && lesson.totalReviews > 0 && (
                    <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      ({lesson.totalReviews} {language === "ar" ? "تقييم" : "reviews"})
                    </span>
                  )}
                </div>
              )}
            </header>

            {/* Instructor Image */}
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={imageUrl}
                alt={instructorName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw"
              />
            </div>

            {/* Article Description */}
            <section className="prose prose-lg max-w-none">
              <h2
                className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "الوصف" : "Description"}
              </h2>
              <div
                className={`text-base md:text-lg leading-relaxed whitespace-pre-wrap ${
                  theme === "dark" ? "text-blue-200" : "text-gray-700"
                }`}
              >
                {description}
              </div>
            </section>
          </div>
        </article>

        {/* Sidebar - All Information (Small Box) */}
        <aside
          className={`w-64 md:w-72 lg:w-80 xl:w-96 shrink-0 rounded-2xl p-4 md:p-6 shadow-xl h-fit ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="space-y-6">
            {/* Instructor Info */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "المدرس" : "Instructor"}
              </h3>
              <div className="flex items-center gap-2">
                <User className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {instructorName}
                  </p>
                  {jobTitle && (
                    <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-gray-600"}`}>
                      {jobTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
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
                className={`text-sm font-semibold mb-3 ${
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

            {/* Level */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "المستوى" : "Level"}
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {levelLabel}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "تاريخ الإنشاء" : "Created Date"}
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <p className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {formatDate(lesson.createdAt)}
                </p>
              </div>
            </div>

            {/* Updated Date */}
            {lesson.updatedAt && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "آخر تحديث" : "Last Updated"}
                </h3>
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <p className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {formatDate(lesson.updatedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Course Hours */}
            {lesson.courseHours && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "عدد الساعات" : "Course Hours"}
                </h3>
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <p className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {lesson.courseHours} {language === "ar" ? "ساعة" : "hours"}
                  </p>
                </div>
              </div>
            )}

            {/* Price */}
            {priceInfo && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {priceInfo.label}
                </h3>
                <div className="flex items-center gap-2">
                  <DollarSign className={`h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                  <p className={`text-lg font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                    {priceInfo.price} {lesson.currency}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "الموقع" : "Location"}
              </h3>
              <a
                href={lesson.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-blue-800/30 hover:bg-blue-800/50 text-blue-300"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">{language === "ar" ? "عرض على الخريطة" : "View on Map"}</span>
              </a>
            </div>

            {/* Department/Place Info */}
            {departmentName && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "معلومات القسم" : "Department Information"}
                </h3>
                <div
                  className={`p-4 rounded-lg space-y-3 ${
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                  }`}
                >
                  {lesson.department && (
                    <>
                      <div>
                        <span
                          className={`text-xs font-semibold block mb-1 ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "القسم" : "Department"}
                        </span>
                        <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                          {language === "ar" ? lesson.department.name.ar : lesson.department.name.en}
                        </span>
                      </div>
                      {lesson.department.college && (
                        <div>
                          <span
                            className={`text-xs font-semibold block mb-1 ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            {language === "ar" ? "الكلية" : "College"}
                          </span>
                          <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                            {language === "ar" ? lesson.department.college.name.ar : lesson.department.college.name.en}
                          </span>
                        </div>
                      )}
                      {lesson.department.college?.university && (
                        <div>
                          <span
                            className={`text-xs font-semibold block mb-1 ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            {language === "ar" ? "الجامعة" : "University"}
                          </span>
                          <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                            {typeof lesson.department.college.university.name === "string"
                              ? lesson.department.college.university.name
                              : language === "ar"
                              ? lesson.department.college.university.name.ar || lesson.department.college.university.name.en
                              : lesson.department.college.university.name.en || lesson.department.college.university.name.ar}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Schedule */}
            {lesson.schedule && lesson.schedule.length > 0 && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "الجدول الزمني" : "Schedule"}
                </h3>
                <div className="space-y-2">
                  {lesson.schedule.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
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
        </aside>
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
