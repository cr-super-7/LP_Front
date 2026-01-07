"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  ArrowLeft,
  Calendar,
  Upload,
  ChevronDown,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateCourseContentProps {
  courseType: "university" | "professional";
}

export default function CreateCourseContent({ courseType }: CreateCourseContentProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState({
    courseName: "",
    courseLevel: "",
    coursePrice: "",
    courseHours: "",
    description: "",
    coverImage: null as File | null,
    coverImagePreview: null as string | null,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", { ...formData, courseType });
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
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>
                {language === "ar" ? "آخر تحديث:" : "Last update:"} 1 Apr 2025, 02:35pm
              </span>
            </div>
            <button
              onClick={() => router.back()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-800/50 hover:bg-blue-800 text-blue-200"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {language === "ar" ? "التالي >" : "Next >"}
            </button>
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
              {/* Course Name */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "اسم الدورة" : "Course Name"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل اسم الدورة" : "Enter course name"}
                />
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
                    name="courseLevel"
                    value={formData.courseLevel}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, courseLevel: e.target.value }))
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
                  type="text"
                  name="coursePrice"
                  value={formData.coursePrice}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "1300 SR" : "1300 SR"}
                />
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
                  type="text"
                  name="courseHours"
                  value={formData.courseHours}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "11 HR" : "11 HR"}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "الوصف" : "Description"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border resize-none ${
                  theme === "dark"
                    ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={
                  language === "ar"
                    ? "أدخل وصف الدورة..."
                    : "Enter course description..."
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

