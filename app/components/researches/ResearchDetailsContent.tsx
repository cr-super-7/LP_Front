"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";

import {
  ArrowLeft,
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


interface ResearchDetailsContentProps {
  research: Research;
}

export default function ResearchDetailsContent({ research }: ResearchDetailsContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  

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
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
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
                className={`text-3xl md:text-4xl font-bold leading-tight ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {title}
              </h1>
            </header>

            {/* Research Cover Image */}
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={imageUrl}
                alt={title}
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
            {/* Researcher Name */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar" ? "الباحث" : "Researcher"}
              </h3>
              <div className="flex items-center gap-2">
                <User className={`h-5 w-5 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
                <p className={`text-base font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {researcherName}
                </p>
              </div>
            </div>

            {/* Approval Status */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
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
                <p className={`text-xs mt-2 ${theme === "dark" ? "text-blue-300" : "text-gray-500"}`}>
                  {language === "ar" ? "تم القبول في: " : "Approved on: "}
                  {formatDate(research.approvedAt)}
                </p>
              )}
            </div>

            {/* Research Type */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
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
                  {formatDate(research.createdAt)}
                </p>
              </div>
            </div>

            {/* Updated Date */}
            {research.updatedAt && (
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
                    {formatDate(research.updatedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Research File */}
            {research.file && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? "ملف البحث" : "Research File"}
                </h3>
                <a
                  href={research.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "bg-blue-800/30 hover:bg-blue-800/50 text-blue-300"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">{language === "ar" ? "تحميل الملف" : "Download File"}</span>
                  <Download className="h-4 w-4 ml-auto" />
                </a>
              </div>
            )}

            {/* Department/Others Place Info */}
            {placeInfo && (
              <div>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {research.researchType === "university"
                    ? language === "ar"
                      ? "معلومات القسم"
                      : "Department Information"
                    : language === "ar"
                    ? "معلومات المكان"
                    : "Place Information"}
                </h3>
                <div
                  className={`p-4 rounded-lg space-y-3 ${
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-50"
                  }`}
                >
                  {research.researchType === "university" && placeInfo.department && (
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
                          {language === "ar" ? placeInfo.department.ar : placeInfo.department.en}
                        </span>
                      </div>
                      {placeInfo.college && (
                        <div>
                          <span
                            className={`text-xs font-semibold block mb-1 ${
                              theme === "dark" ? "text-blue-200" : "text-gray-600"
                            }`}
                          >
                            {language === "ar" ? "الكلية" : "College"}
                          </span>
                          <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                            {language === "ar" ? placeInfo.college.ar : placeInfo.college.en}
                          </span>
                        </div>
                      )}
                      {research.researchType === "university" && placeInfo && "university" in placeInfo && (() => {
                        const university = placeInfo.university;
                        return university ? (
                          <div>
                            <span
                              className={`text-xs font-semibold block mb-1 ${
                                theme === "dark" ? "text-blue-200" : "text-gray-600"
                              }`}
                            >
                              {language === "ar" ? "الجامعة" : "University"}
                            </span>
                            <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                              {typeof university === "string"
                                ? university
                                : language === "ar"
                                ? university.ar || university.en
                                : university.en || university.ar}
                            </span>
                          </div>
                        ) : null;
                      })()}
                    </>
                  )}
                  {research.researchType === "others" && placeInfo.place && (
                    <div>
                      <span
                        className={`text-xs font-semibold block mb-1 ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {language === "ar" ? "المكان" : "Place"}
                      </span>
                      <span className={`text-sm ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                        {language === "ar" ? placeInfo.place.ar : placeInfo.place.en}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        
      </div>

      
    </div>
  );
}
