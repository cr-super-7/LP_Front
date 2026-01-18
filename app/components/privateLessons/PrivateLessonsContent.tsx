"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  User, 
  DollarSign, 
  Clock, 
  GraduationCap, 
  Briefcase,
  Building2,
  TrendingUp,
  Star,
  ChevronDown,
  Filter
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getPrivateLessons } from "../../store/api/privateLessonApi";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";
import PrivateLessonsProperties from "./PrivateLessonsProperties";
import toast from "react-hot-toast";
import Image from "next/image";

export default function PrivateLessonsContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [lessons, setLessons] = useState<PrivateLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadPrivateLessons = async () => {
      try {
        setIsLoading(true);
        const data = await getPrivateLessons(dispatch);
        setLessons(data || []);
      } catch (error) {
        console.error("Failed to load private lessons:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الدروس الخصوصية"
            : "Failed to load private lessons"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPrivateLessons();
  }, [dispatch, language]);

  const getLessonName = (lesson: PrivateLesson): string => {
    return language === "ar" ? lesson.lessonName.ar : lesson.lessonName.en;
  };

  const getDescription = (lesson: PrivateLesson): string => {
    return language === "ar" ? lesson.description.ar : lesson.description.en;
  };

  const getInstructorName = (lesson: PrivateLesson): string => {
    return language === "ar" ? lesson.instructorName.ar : lesson.instructorName.en;
  };

  const getJobTitle = (lesson: PrivateLesson): string | null => {
    if (!lesson.jobTitle) return null;
    return language === "ar" ? lesson.jobTitle.ar : lesson.jobTitle.en;
  };

  const getDepartmentName = (lesson: PrivateLesson): string | null => {
    if (lesson.lessonType === "department" && lesson.department) {
      return language === "ar" ? lesson.department.name.ar : lesson.department.name.en;
    }
    return null;
  };

  const getLevelLabel = (level: string): string => {
    const labels: Record<string, { ar: string; en: string }> = {
      beginner: { ar: "مبتدئ", en: "Beginner" },
      intermediate: { ar: "متوسط", en: "Intermediate" },
      advanced: { ar: "متقدم", en: "Advanced" },
    };
    return language === "ar" ? labels[level]?.ar || level : labels[level]?.en || level;
  };
 
  // Filter options for dropdown
  const filterOptions = [
    { key: null, label: language === "ar" ? "الكل" : "All" },
    { key: "beginner", label: language === "ar" ? "مبتدئ" : "Beginner" },
    { key: "intermediate", label: language === "ar" ? "متوسط" : "Intermediate" },
    { key: "advanced", label: language === "ar" ? "متقدم" : "Advanced" },
  ];

  const selectedOption = filterOptions.find((opt) => opt.key === selectedLevel) || filterOptions[0];

  // Filter lessons based on selected level
  const filteredLessons = selectedLevel
    ? lessons.filter((lesson) => lesson.lessonLevel === selectedLevel)
    : lessons;

  const formatPrice = (price: number, currency: string): string => {
    return `${price} ${currency}`;
  };

  const getPrice = (lesson: PrivateLesson): { price: number; label: string } => {
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
    return { price: 0, label: "" };
  };

  const handleLessonClick = (lessonId: string) => {
    router.push(`/private-lessons/${lessonId}`);
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
        {/* Private Lessons Advertisements */}
        <PrivateLessonsProperties />

        {/* Header with Filter */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الدروس الخصوصية" : "Private Lessons"}
          </h1>

          {/* Level Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-blue-900/50 border-blue-700 text-white hover:bg-blue-900/70"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === "ar" ? "المستوى: " : "Level: "}
                {selectedOption.label}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div
                  className={`absolute top-full z-20 mt-2 min-w-[180px] rounded-lg border shadow-lg ${
                    language === "ar" ? "left-0" : "right-0"
                  } ${
                    theme === "dark"
                      ? "border-blue-700 bg-blue-900/95 backdrop-blur-sm"
                      : "border-gray-300 bg-white shadow-xl"
                  }`}
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.key || "all"}
                      onClick={() => {
                        setSelectedLevel(option.key);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        language === "ar" ? "text-right" : "text-left"
                      } ${
                        theme === "dark"
                          ? `text-white ${
                              selectedLevel === option.key
                                ? "bg-blue-600 font-medium"
                                : "hover:bg-blue-800/50"
                            }`
                          : `text-gray-900 ${
                              selectedLevel === option.key
                                ? "bg-blue-50 font-medium text-blue-600"
                                : "hover:bg-gray-50"
                            }`
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Private Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg ${
              theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
            }`}
          >
            <BookOpen
              className={`h-16 w-16 mx-auto mb-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {selectedLevel
                ? language === "ar"
                  ? `لا توجد دروس خصوصية متاحة للمستوى: ${getLevelLabel(selectedLevel)}`
                  : `No private lessons available for level: ${getLevelLabel(selectedLevel)}`
                : language === "ar"
                ? "لا توجد دروس خصوصية متاحة"
                : "No private lessons available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const departmentName = getDepartmentName(lesson);
              const jobTitle = getJobTitle(lesson);
              const instructorImage = lesson.instructorImage || "/home/privet_lessons.png";
              
              return (
                <div
                  key={lesson._id}
                  onClick={() => handleLessonClick(lesson._id)}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 group ${
                    theme === "dark"
                      ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                      : "bg-white hover:bg-blue-50 border border-gray-200 shadow-md hover:shadow-xl"
                  }`}
                >
                  {/* Instructor Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {instructorImage && instructorImage !== "/home/privet_lessons.png" ? (
                      <Image
                        src={instructorImage}
                        alt={getInstructorName(lesson)}
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
                        <User
                          className={`h-16 w-16 ${
                            theme === "dark" ? "text-blue-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                    
                    {/* Rating - Top Right (like course cards) */}
                    {lesson.averageRating !== undefined && lesson.averageRating !== null && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm z-10">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm font-semibold">
                          {lesson.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Lesson Type Badge Overlay - Top Left */}
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-2">
                        {lesson.lessonType === "department" ? (
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
                            lesson.lessonType === "department"
                              ? theme === "dark"
                                ? "bg-blue-800/80 text-blue-200"
                                : "bg-blue-600/90 text-white"
                              : theme === "dark"
                              ? "bg-purple-800/80 text-purple-200"
                              : "bg-purple-600/90 text-white"
                          }`}
                        >
                          {lesson.lessonType === "department"
                            ? language === "ar"
                              ? "أكاديمي"
                              : "Academic"
                            : language === "ar"
                            ? "مهني"
                            : "Professional"}
                        </span>
                      </div>
                    </div>
                    {/* Level Badge */}
                    <div className="absolute bottom-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm bg-black/50">
                        <TrendingUp className="h-3 w-3 text-white" />
                        <span className="text-xs font-semibold text-white">
                          {getLevelLabel(lesson.lessonLevel)}
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
                      {getLessonName(lesson)}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 mb-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {getDescription(lesson)}
                    </p>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <User
                        className={`h-4 w-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {getInstructorName(lesson)}
                        </p>
                        {jobTitle && (
                          <p
                            className={`text-xs truncate ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {jobTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Department/Place Info */}
                    {departmentName && (
                      <div className="flex items-center gap-2 mb-3">
                        <Building2
                          className={`h-4 w-4 ${
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {departmentName}
                        </p>
                      </div>
                    )}

                    {/* Price and Hours */}
                    <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-blue-800">
                      {(() => {
                        const priceInfo = getPrice(lesson);
                        return priceInfo.price > 0 ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign
                                className={`h-4 w-4 ${
                                  theme === "dark" ? "text-green-400" : "text-green-600"
                                }`}
                              />
                              <div>
                                <p
                                  className={`text-sm font-bold ${
                                    theme === "dark" ? "text-green-400" : "text-green-600"
                                  }`}
                                >
                                  {formatPrice(priceInfo.price, lesson.currency)}
                                </p>
                                {priceInfo.label && (
                                  <p
                                    className={`text-xs ${
                                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    {priceInfo.label}
                                  </p>
                                )}
                              </div>
                            </div>
                            {lesson.courseHours && (
                              <div className="flex items-center gap-2">
                                <Clock
                                  className={`h-4 w-4 ${
                                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                                  }`}
                                />
                                <p
                                  className={`text-xs ${
                                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {lesson.courseHours} {language === "ar" ? "ساعة" : "hrs"}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })()}
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
