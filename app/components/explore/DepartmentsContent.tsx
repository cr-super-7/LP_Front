"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GraduationCap, ChevronRight, Building2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getDepartments } from "../../store/api/departmentApi";
import { getCollegeById } from "../../store/api/collegeApi";
import type { Department } from "../../store/interface/departmentInterface";
import type { College } from "../../store/interface/collegeInterface";
import toast from "react-hot-toast";
import Image from "next/image";

export default function DepartmentsContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";
  const universityId = params?.universityId as string;
  const collegeId = params?.collegeId as string;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [college, setCollege] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!collegeId || !universityId) {
      router.push("/explore/universities");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load college
        const collegeData = await getCollegeById(collegeId, dispatch);
        setCollege(collegeData);

        // Load all departments and filter by college
        const allDepartments = await getDepartments(dispatch);
        const filteredDepartments = allDepartments.filter(
          (dept) => dept.college._id === collegeId
        );
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Failed to load departments:", error);
        toast.error(
          language === "ar"
            ? "فشل تحميل الأقسام"
            : "Failed to load departments"
        );
        router.push(`/explore/universities/${universityId}/colleges`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [collegeId, universityId, dispatch, router, language]);

  const getCollegeName = (col: College | null): string => {
    if (!col) return "";
    if (typeof col.name === "string") {
      return col.name;
    }
    return language === "ar" ? col.name.ar : col.name.en;
  };

  const getDepartmentName = (dept: Department): string => {
    if (typeof dept.name === "string") {
      return dept.name;
    }
    return language === "ar" ? dept.name.ar : dept.name.en;
  };

  const handleDepartmentClick = (departmentId: string) => {
    router.push(
      `/explore/universities/${universityId}/colleges/${collegeId}/departments/${departmentId}/courses`
    );
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
          <button
            onClick={() =>
              router.push(`/explore/universities/${universityId}/colleges`)
            }
            className={`hover:underline ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {getCollegeName(college)}
          </button>
          <ChevronRight
            className={`h-4 w-4 ${
              theme === "dark" ? "text-blue-400" : "text-gray-500"
            } ${isRTL ? "rotate-180" : ""}`}
          />
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            {language === "ar" ? "الأقسام" : "Departments"}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الأقسام" : "Departments"} - {getCollegeName(college)}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language === "ar"
              ? "اختر قسماً لاستكشاف دوراته"
              : "Select a department to explore its courses"}
          </p>
        </div>

        {/* Departments Grid */}
        {departments.length === 0 ? (
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
                ? "لا توجد أقسام متاحة"
                : "No departments available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <div
                key={department._id}
                onClick={() => handleDepartmentClick(department._id)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-900/50 hover:bg-blue-900 border border-blue-800"
                    : "bg-white hover:bg-blue-50 border border-gray-200 shadow-md hover:shadow-lg"
                }`}
              >
                <div className="relative h-48 w-full">
                  {department.image ? (
                    <Image
                      src={department.image}
                      alt={getDepartmentName(department)}
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
                    {getDepartmentName(department)}
                  </h3>
                  {typeof department.description === "object" &&
                  department.description ? (
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {language === "ar"
                        ? department.description.ar
                        : department.description.en}
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
