"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, User, Calendar, GraduationCap, Briefcase, Building2, MapPin } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getResearches } from "../../store/api/researchApi";
import type { Research } from "../../store/interface/researchInterface";
import ResearchesProperties from "./ResearchesProperties";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ResearchesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [researches, setResearches] = useState<Research[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResearches = async () => {
      try {
        setIsLoading(true);
        const data = await getResearches(dispatch);
        setResearches(data || []);
      } catch (error) {
        console.error("Failed to load researches:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الأبحاث"
            : "Failed to load researches"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadResearches();
  }, [dispatch, language]);

  const getTitle = (research: Research): string => {
    return language === "ar" ? research.title.ar : research.title.en;
  };

  const getDescription = (research: Research): string => {
    return language === "ar" ? research.description.ar : research.description.en;
  };

  const getResearcherName = (research: Research): string => {
    return language === "ar"
      ? research.researcherName.ar
      : research.researcherName.en;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get department/others place name
  const getDepartmentOrPlaceName = (research: Research): string | null => {
    if (research.researchType === "university" && research.department) {
      if (typeof research.department === "string") return null;
      const deptName = research.department.name;
      return language === "ar" ? deptName.ar : deptName.en;
    } else if (research.researchType === "others" && research.othersCourses) {
      if (typeof research.othersCourses === "string") return null;
      const placeName = research.othersCourses.name;
      return language === "ar" ? placeName.ar : placeName.en;
    }
    return null;
  };

  // Get image URL - prefer coverImage for thumbnail
  const getImageUrl = (research: Research): string => {
    return (
      (research.coverImage as string | undefined) ||
      (research.file as string | undefined) ||
      "/home/privet_lessons.png"
    );
  };

  const handleResearchClick = (researchId: string) => {
    router.push(`/researches_student/${researchId}`);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Research Advertisements */}
        <ResearchesProperties />

        {/* Header */}
        <div className="mb-3">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الأبحاث" : "Researches"}
          </h1>
          
        </div>

        {/* Researches Grid */}
        {researches.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg ${
              theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
            }`}
          >
            <FileText
              className={`h-16 w-16 mx-auto mb-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "لا توجد أبحاث متاحة"
                : "No researches available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researches.map((research) => {
              const imageUrl = getImageUrl(research);
              const departmentOrPlaceName = getDepartmentOrPlaceName(research);
              
              return (
                <div
                  key={research._id}
                  onClick={() => handleResearchClick(research._id)}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 group ${
                    theme === "dark"
                      ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                      : "bg-white hover:bg-blue-50 border border-gray-200 shadow-md hover:shadow-xl"
                  }`}
                >
                  {/* Research Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {imageUrl && imageUrl !== "/home/privet_lessons.png" ? (
                      <Image
                        src={imageUrl}
                        alt={getTitle(research)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          theme === "dark" ? "bg-blue-800" : "bg-gray-100"
                        }`}
                      >
                        <FileText
                          className={`h-16 w-16 ${
                            theme === "dark" ? "text-blue-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                    {/* Research Type Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-2">
                        {research.researchType === "university" ? (
                          <GraduationCap
                            className={`h-5 w-5 ${
                              theme === "dark" ? "text-blue-300" : "text-white"
                            } drop-shadow-lg`}
                          />
                        ) : (
                          <Briefcase
                            className={`h-5 w-5 ${
                              theme === "dark" ? "text-purple-300" : "text-white"
                            } drop-shadow-lg`}
                          />
                        )}
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
                            research.researchType === "university"
                              ? theme === "dark"
                                ? "bg-blue-800/80 text-blue-200"
                                : "bg-blue-600/90 text-white"
                              : theme === "dark"
                              ? "bg-purple-800/80 text-purple-200"
                              : "bg-purple-600/90 text-white"
                          }`}
                        >
                          {research.researchType === "university"
                            ? language === "ar"
                              ? "أكاديمي"
                              : "Academic"
                            : language === "ar"
                            ? "مهني"
                            : "Professional"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3
                      className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {getTitle(research)}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 mb-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {getDescription(research)}
                    </p>

                    {/* Department/Place Info */}
                    {departmentOrPlaceName && (
                      <div className="flex items-center gap-2 mb-3">
                        {research.researchType === "university" ? (
                          <Building2
                            className={`h-4 w-4 ${
                              theme === "dark" ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                        ) : (
                          <MapPin
                            className={`h-4 w-4 ${
                              theme === "dark" ? "text-purple-400" : "text-purple-600"
                            }`}
                          />
                        )}
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {departmentOrPlaceName}
                        </p>
                      </div>
                    )}

                    {/* Researcher Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <User
                        className={`h-4 w-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {getResearcherName(research)}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-blue-800">
                      <Calendar
                        className={`h-4 w-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {formatDate(research.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
