"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GraduationCap, ChevronRight, Building2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getColleges } from "../../store/api/collegeApi";
import { getUniversityById } from "../../store/api/universityApi";
import type { College } from "../../store/interface/collegeInterface";
import type { University } from "../../store/interface/universityInterface";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CollegesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";
  const universityId = params?.universityId as string;

  const [colleges, setColleges] = useState<College[]>([]);
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!universityId) {
      router.push("/explore/universities");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load university
        const universityData = await getUniversityById(universityId, dispatch);
        setUniversity(universityData);

        // Load all colleges and filter by university
        const allColleges = await getColleges(dispatch);
        const filteredColleges = allColleges.filter(
          (college) => college.university._id === universityId
        );
        setColleges(filteredColleges);
      } catch (error) {
        console.error("Failed to load colleges:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الكليات"
            : "Failed to load colleges"
        );
        router.push("/explore/universities");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [universityId, dispatch, router, language]);

  const getUniversityName = (uni: University | null): string => {
    if (!uni) return "";
    if (typeof uni.name === "string") {
      return uni.name;
    }
    return language === "ar" ? uni.name.ar : uni.name.en;
  };

  const getCollegeName = (college: College): string => {
    if (typeof college.name === "string") {
      return college.name;
    }
    return language === "ar" ? college.name.ar : college.name.en;
  };

  const handleCollegeClick = (collegeId: string) => {
    router.push(`/explore/universities/${universityId}/colleges/${collegeId}/departments`);
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => router.push("/explore")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "استكشف" : "Explore"}
          </button>
          <ChevronRight
            className={`h-4 w-4 ${
              theme === "dark" ? "text-blue-400" : "text-gray-500"
            } ${isRTL ? "rotate-180" : ""}`}
          />
          <button
            onClick={() => router.push("/explore/universities")}
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {language === "ar" ? "الجامعات" : "Universities"}
          </button>
          <ChevronRight
            className={`h-4 w-4 ${
              theme === "dark" ? "text-blue-400" : "text-gray-500"
            } ${isRTL ? "rotate-180" : ""}`}
          />
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {getUniversityName(university)}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الكليات" : "Colleges"} - {getUniversityName(university)}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "اختر كلية لاستكشاف أقسامها ودوراتها"
              : "Select a college to explore its departments and courses"}
          </p>
        </div>

        {/* Colleges Grid */}
        {colleges.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg ${
              theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
            }`}
          >
            <GraduationCap
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
                ? "لا توجد كليات متاحة"
                : "No colleges available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <div
                key={college._id}
                onClick={() => handleCollegeClick(college._id)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                    : "bg-white hover:bg-blue-50 border border-gray-200 shadow-md hover:shadow-lg"
                }`}
              >
                <div className="relative h-48 w-full">
                  {college.image ? (
                    <Image
                      src={college.image}
                      alt={getCollegeName(college)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        theme === "dark" ? "bg-blue-800" : "bg-gray-200"
                      }`}
                    >
                      <GraduationCap
                        className={`h-16 w-16 ${
                          theme === "dark" ? "text-blue-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {getCollegeName(college)}
                  </h3>
                  {typeof college.description === "object" &&
                  college.description ? (
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {language === "ar"
                        ? college.description.ar
                        : college.description.en}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
