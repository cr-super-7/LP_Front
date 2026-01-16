"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ChevronRight, Building2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getUniversities } from "../../store/api/universityApi";
import type { University } from "../../store/interface/universityInterface";
import toast from "react-hot-toast";
import Image from "next/image";

export default function UniversitiesContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";

  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setIsLoading(true);
        const data = await getUniversities(dispatch);
        setUniversities(data || []);
      } catch (error) {
        console.error("Failed to load universities:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الجامعات"
            : "Failed to load universities"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUniversities();
  }, [dispatch, language]);

  const getUniversityName = (university: University): string => {
    if (typeof university.name === "string") {
      return university.name;
    }
    return language === "ar" ? university.name.ar : university.name.en;
  };

  const handleUniversityClick = (universityId: string) => {
    router.push(`/explore/universities/${universityId}/colleges`);
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
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {language === "ar" ? "الجامعات" : "Universities"}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الجامعات" : "Universities"}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "اختر جامعة لاستكشاف كلياتها وأقسامها ودوراتها"
              : "Select a university to explore its colleges, departments, and courses"}
          </p>
        </div>

        {/* Universities Grid */}
        {universities.length === 0 ? (
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
                ? "لا توجد جامعات متاحة"
                : "No universities available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <div
                key={university._id}
                onClick={() => handleUniversityClick(university._id)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                    : "bg-white hover:bg-blue-50 border border-gray-200 shadow-md hover:shadow-lg"
                }`}
              >
                <div className="relative h-48 w-full">
                  {university.image ? (
                    <Image
                      src={university.image}
                      alt={getUniversityName(university)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        theme === "dark" ? "bg-blue-800" : "bg-gray-200"
                      }`}
                    >
                      <Building2
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
                    {getUniversityName(university)}
                  </h3>
                  {typeof university.description === "string" &&
                  university.description ? (
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {university.description}
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
