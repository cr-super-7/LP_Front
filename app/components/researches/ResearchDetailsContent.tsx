"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { deleteResearch } from "../../store/api/researchApi";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Calendar,
  User,
  FileText,
  Download,
} from "lucide-react";
import type { Research } from "../../store/interface/researchInterface";
import toast from "react-hot-toast";

interface ResearchDetailsContentProps {
  research: Research;
}

export default function ResearchDetailsContent({ research }: ResearchDetailsContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Get localized content
  const title = language === "ar" ? research.title.ar || research.title.en : research.title.en || research.title.ar;

  const description =
    language === "ar" ? research.description.ar || research.description.en : research.description.en || research.description.ar;

  const researcherName =
    language === "ar"
      ? research.researcherName.ar || research.researcherName.en
      : research.researcherName.en || research.researcherName.ar;

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

  // Get research type label
  const researchTypeLabel =
    research.researchType === "university"
      ? language === "ar"
        ? "بحث جامعي"
        : "University Research"
      : language === "ar"
      ? "بحث تقني/أخرى"
      : "Technical/Other Research";

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteResearch(research._id, dispatch);
      toast.success(language === "ar" ? "تم حذف البحث بنجاح" : "Research deleted successfully");
      router.push("/researches/my-researches");
    } catch (error) {
      console.error("Failed to delete research:", error);
    }
  };

  // Get image URL
  const imageUrl = research.file || "/home/privet_lessons.png";

  // Get department/others place info
  const getDepartmentInfo = () => {
    if (research.researchType === "university" && research.department) {
      if (typeof research.department === "string") return null;
      return {
        department: research.department.name,
        college: research.department.college?.name,
        university: research.department.college?.university?.name,
      };
    } else if (research.researchType === "others" && research.othersPlace) {
      if (typeof research.othersPlace === "string") return null;
      return {
        place: research.othersPlace.name,
      };
    }
    return null;
  };

  const placeInfo = getDepartmentInfo();

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
            onClick={() => router.push(`/researches/create?edit=${research._id}`)}
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
            {/* Research Cover Image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              {/* Researcher Name */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "الباحث" : "Researcher"}
                </h3>
                <div className="flex items-center gap-2">
                  <User className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {researcherName}
                  </p>
                </div>
              </div>

              {/* Approval Status */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "الحالة" : "Status"}
                </h3>
                <div className="flex items-center gap-2">
                  {research.isApproved ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                        {language === "ar" ? "مقبول" : "Approved"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
                        {language === "ar" ? "قيد المراجعة" : "Under Review"}
                      </span>
                    </>
                  )}
                </div>
                {research.isApproved && research.approvedAt && (
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-blue-300" : "text-gray-500"}`}>
                    {language === "ar" ? "تم القبول في: " : "Approved on: "}
                    {formatDate(research.approvedAt)}
                  </p>
                )}
              </div>

              {/* Research Type */}
              <div>
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "نوع البحث" : "Research Type"}
                </h3>
                <div className="flex items-center gap-2">
                  {research.researchType === "university" ? (
                    <GraduationCap className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  ) : (
                    <Briefcase className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                  )}
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {researchTypeLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Research Title */}
            <div>
              <h1
                className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {title}
              </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  {formatDate(research.createdAt)}
                </p>
              </div>

              {research.updatedAt && (
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
                      {language === "ar" ? "آخر تحديث" : "Last Updated"}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {formatDate(research.updatedAt)}
                  </p>
                </div>
              )}

              {research.file && (
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                    <span
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "ملف البحث" : "Research File"}
                    </span>
                  </div>
                  <a
                    href={research.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    <span>{language === "ar" ? "تحميل" : "Download"}</span>
                  </a>
                </div>
              )}
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

            {/* Department/Others Place Info */}
            {placeInfo && (
              <div>
                <h2
                  className={`text-xl font-bold mb-3 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {research.researchType === "university"
                    ? language === "ar"
                      ? "معلومات القسم"
                      : "Department Information"
                    : language === "ar"
                    ? "معلومات المكان"
                    : "Place Information"}
                </h2>
                <div
                  className={`p-4 rounded-lg space-y-2 ${
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                  }`}
                >
                  {research.researchType === "university" && placeInfo.department && (
                    <>
                      <div>
                        <span
                          className={`text-sm font-semibold ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "القسم: " : "Department: "}
                        </span>
                        <span className={`text-base ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                          {language === "ar" ? placeInfo.department.ar : placeInfo.department.en}
                        </span>
                      </div>
                      {placeInfo.college && (
                        <div>
                          <span
                            className={`text-sm font-semibold ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            {language === "ar" ? "الكلية: " : "College: "}
                          </span>
                          <span className={`text-base ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                            {language === "ar" ? placeInfo.college.ar : placeInfo.college.en}
                          </span>
                        </div>
                      )}
                      {placeInfo.university && (
                        <div>
                          <span
                            className={`text-sm font-semibold ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            {language === "ar" ? "الجامعة: " : "University: "}
                          </span>
                          <span className={`text-base ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                            {typeof placeInfo.university === "string"
                              ? placeInfo.university
                              : language === "ar"
                              ? placeInfo.university.ar || placeInfo.university.en
                              : placeInfo.university.en || placeInfo.university.ar}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {research.researchType === "others" && placeInfo.place && (
                    <div>
                      <span
                        className={`text-sm font-semibold ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {language === "ar" ? "المكان: " : "Place: "}
                      </span>
                      <span className={`text-base ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                        {language === "ar" ? placeInfo.place.ar : placeInfo.place.en}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={language === "ar" ? "تأكيد حذف البحث" : "Confirm Delete Research"}
        message={
          language === "ar"
            ? "هل أنت متأكد من حذف هذا البحث؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to delete this research? This action cannot be undone."
        }
      />
    </div>
  );
}
