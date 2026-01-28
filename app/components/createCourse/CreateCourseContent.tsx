"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  ArrowLeft,
  Upload,
  ChevronDown,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createCourse } from "../../store/api/courseApi";
import { getCategories } from "../../store/api/categoryApi";
import { getDepartments } from "../../store/api/departmentApi";
import { getOthersCourses } from "../../store/api/othersCoursesApi";
import type { CreateCourseRequest } from "../../store/interface/courseInterface";
import toast from "react-hot-toast";

interface CreateCourseContentProps {
  courseType: "university" | "others";
}

export default function CreateCourseContent({ courseType }: CreateCourseContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.category);
  const { departments } = useAppSelector((state) => state.department);
  const { othersCourses } = useAppSelector((state) => state.othersCourses);
  const { isLoading } = useAppSelector((state) => state.course);

  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    category: "",
    level: "",
    price: "",
    currency: "SAR",
    durationHours: "",
    totalLessons: "",
    department: "",
    othersCourses: "",
    coverImage: null as File | null,
    coverImagePreview: null as string | null,
    isPublished: false,
  });

  // Load categories, departments, and universities on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await getCategories(dispatch);
        if (courseType === "university") {
          await getDepartments(dispatch);
        }
        if (courseType === "others") {
          await getOthersCourses(dispatch);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [dispatch, courseType]);

  const courseLevels = [
    { value: "beginner", label: language === "ar" ? "مبتدئ" : "Beginner" },
    { value: "intermediate", label: language === "ar" ? "متوسط" : "Intermediate" },
    { value: "advanced", label: language === "ar" ? "متقدم" : "Advanced" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
      coverImagePreview: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.titleAr || !formData.titleEn) {
      toast.error(language === "ar" ? "يرجى إدخال عنوان الدورة" : "Please enter course title");
      return;
    }
    if (!formData.descriptionAr || !formData.descriptionEn) {
      toast.error(language === "ar" ? "يرجى إدخال وصف الدورة" : "Please enter course description");
      return;
    }
    if (!formData.category) {
      toast.error(language === "ar" ? "يرجى اختيار الفئة" : "Please select category");
      return;
    }
    if (!formData.level) {
      toast.error(language === "ar" ? "يرجى اختيار المستوى" : "Please select level");
      return;
    }
    if (!formData.price || !formData.durationHours) {
      toast.error(language === "ar" ? "يرجى إدخال السعر وساعات الدورة" : "Please enter price and duration hours");
      return;
    }
    if (courseType === "university" && !formData.department) {
      toast.error(language === "ar" ? "يرجى اختيار القسم" : "Please select department");
      return;
    }
    if (courseType === "others" && !formData.othersCourses) {
      toast.error(language === "ar" ? "يرجى اختيار المكان" : "Please select place");
      return;
    }

    const userId = (user as { id?: string; _id?: string })?.id || (user as { id?: string; _id?: string })?._id;
    if (!userId) {
      toast.error(language === "ar" ? "يرجى تسجيل الدخول" : "Please login");
      return;
    }

    try {
      const courseData: CreateCourseRequest = {
        "title.ar": formData.titleAr,
        "title.en": formData.titleEn,
        "description.ar": formData.descriptionAr,
        "description.en": formData.descriptionEn,
        Teacher: userId,
        category: formData.category,
        courseType: courseType,
        level: formData.level as "beginner" | "intermediate" | "advanced",
        price: parseFloat(formData.price),
        currency: formData.currency,
        durationHours: parseFloat(formData.durationHours),
        thumbnail: formData.coverImage || undefined,
      };

      if (courseType === "university" && formData.department) {
        courseData.department = formData.department;
      }
      if (courseType === "others" && formData.othersCourses) {
        courseData.othersCourses = formData.othersCourses;
      }
      if (formData.totalLessons) {
        courseData.totalLessons = parseInt(formData.totalLessons);
      }
      if (formData.isPublished !== undefined) {
        courseData.isPublished = formData.isPublished;
      }

      await createCourse(courseData, dispatch);
      toast.success(language === "ar" ? "تم إنشاء الدورة بنجاح" : "Course created successfully");
      router.push("/myCoursesTeacher");
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error(
        language === "ar" 
          ? "فشل إنشاء الدورة. يرجى المحاولة مرة أخرى" 
          : "Failed to create course. Please try again"
      );
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "hover:bg-blue-900/50 text-blue-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "إنشاء دورة" : "Create Course"}
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div
          className={`rounded-2xl p-8 shadow-xl ${
            theme === "dark"
              ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Course Cover */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "رفع غلاف الدورة" : "Upload Course Cover"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  theme === "dark"
                    ? "border-blue-700 bg-blue-800/20 hover:border-blue-600"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400"
                }`}
              >
                {formData.coverImagePreview ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={formData.coverImagePreview}
                      alt="Course cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className={`p-4 rounded-lg ${
                          theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
                        }`}
                      >
                        <Upload
                          className={`h-12 w-12 ${
                            theme === "dark" ? "text-blue-300" : "text-blue-600"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-blue-200" : "text-gray-600"
                        }`}
                      >
                        {language === "ar"
                          ? "انقر لرفع صورة الغلاف"
                          : "Click to upload course cover"}
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Course Details - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Name Arabic */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "عنوان الدورة بالعربية" : "Course Title (Arabic)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="titleAr"
                  value={formData.titleAr}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل عنوان الدورة بالعربية" : "Enter course title in Arabic"}
                />
              </div>

              {/* Course Name English */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "عنوان الدورة بالإنجليزية" : "Course Title (English)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "Enter course title in English" : "Enter course title in English"}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "الفئة" : "Category"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">
                      {language === "ar" ? "اختر الفئة" : "Select category"}
                    </option>
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => {
                        // Handle different name structures
                        const categoryName = 
                          typeof cat.name === "string" 
                            ? cat.name 
                            : language === "ar" 
                            ? cat.name?.ar || cat.name?.en || "Unknown"
                            : cat.name?.en || cat.name?.ar || "Unknown";
                        
                        return (
                          <option key={cat._id} value={cat._id}>
                            {categoryName}
                          </option>
                        );
                      })
                    ) : (
                      <option value="" disabled>
                        {language === "ar" ? "لا توجد فئات متاحة" : "No categories available"}
                      </option>
                    )}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  />
                </div>
              </div>

              {/* Course Level */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "مستوى الدورة" : "Course Level"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="level"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, level: e.target.value }))
                    }
                    className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">
                      {language === "ar" ? "اختر المستوى" : "Select level"}
                    </option>
                    {courseLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  />
                </div>
              </div>

              {/* Course Price */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "سعر الدورة" : "Course Price"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="299"
                />
              </div>

              {/* Currency - Fixed to SAR */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "العملة" : "Currency"}
                </label>
                <div
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  }`}
                >
                  <span className={theme === "dark" ? "text-blue-200" : "text-gray-700"}>
                    SAR
                  </span>
                </div>
              </div>

              {/* Course Hours */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "ساعات الدورة" : "Course Hours"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="40"
                />
              </div>

              {/* Total Lessons */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "عدد الدروس" : "Total Lessons"}
                </label>
                <input
                  type="number"
                  name="totalLessons"
                  value={formData.totalLessons}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="10"
                />
              </div>

              {/* Is Published */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                  }
                  className={`w-5 h-5 rounded border-2 cursor-pointer ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-blue-500"
                      : "bg-gray-50 border-gray-300 text-blue-600"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <label
                  htmlFor="isPublished"
                  className={`text-sm font-semibold cursor-pointer ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "هل الدورة منشورة؟" : "Is the course published?"}
                  <span className="text-gray-500 text-xs font-normal ml-1">
                    ({language === "ar" ? "اختياري، القيمة الافتراضية: false" : "Optional, Default: false"})
                  </span>
                </label>
              </div>

              {/* Department (for university courses) */}
              {courseType === "university" && (
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-blue-950"
                    }`}
                  >
                    {language === "ar" ? "القسم" : "Department"}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, department: e.target.value }))
                      }
                      className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                        theme === "dark"
                          ? "bg-blue-800/30 border-blue-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">
                        {language === "ar" ? "اختر القسم" : "Select department"}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {language === "ar" ? dept.name.ar : dept.name.en}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Others Courses (for others courses) */}
              {courseType === "others" && (
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-blue-950"
                    }`}
                  >
                    {language === "ar" ? "المكان" : "Place"}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="othersCourses"
                      value={formData.othersCourses}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, othersCourses: e.target.value }))
                      }
                      className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                        theme === "dark"
                          ? "bg-blue-800/30 border-blue-700 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="">
                        {language === "ar" ? "اختر المكان" : "Select place"}
                      </option>
                      {othersCourses.map((place) => (
                        <option key={place._id} value={place._id}>
                          {typeof place.name === "string"
                            ? place.name
                            : language === "ar"
                            ? place.name.ar
                            : place.name.en}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none ${
                        theme === "dark" ? "text-blue-300" : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description Arabic */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "وصف الدورة بالعربية" : "Description (Arabic)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border resize-none ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={
                    language === "ar"
                      ? "أدخل وصف الدورة بالعربية..."
                      : "Enter course description in Arabic..."
                  }
                />
              </div>

              {/* Description English */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "وصف الدورة بالإنجليزية" : "Description (English)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border resize-none ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={
                    language === "ar"
                      ? "Enter course description in English..."
                      : "Enter course description in English..."
                  }
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-blue-800/30">
              <button
                type="button"
                onClick={() => router.back()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-blue-800/50 hover:bg-blue-800 text-blue-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isLoading
                  ? language === "ar"
                    ? "جاري الإنشاء..."
                    : "Creating..."
                  : language === "ar"
                  ? "إنشاء"
                  : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

