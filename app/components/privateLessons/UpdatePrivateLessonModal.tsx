"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { X, Upload, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updatePrivateLesson, getPrivateLessonById } from "../../store/api/privateLessonApi";
import { getDepartments } from "../../store/api/departmentApi";
import type { PrivateLesson, UpdatePrivateLessonRequest, ScheduleItem } from "../../store/interface/privateLessonInterface";
import toast from "react-hot-toast";

interface UpdatePrivateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: PrivateLesson;
  onUpdateSuccess: () => void;
}

export default function UpdatePrivateLessonModal({
  isOpen,
  onClose,
  lesson,
  onUpdateSuccess,
}: UpdatePrivateLessonModalProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector((state) => state.department);
  const { isLoading } = useAppSelector((state) => state.privateLesson);

  // Initialize form data from lesson
  const [formData, setFormData] = useState({
    lessonType: lesson.lessonType,
    instructorNameAr: lesson.instructorName.ar || "",
    instructorNameEn: lesson.instructorName.en || "",
    locationUrl: lesson.locationUrl || "",
    jobTitleAr: lesson.jobTitle?.ar || "",
    jobTitleEn: lesson.jobTitle?.en || "",
    department: lesson.department?._id || "",
    lessonNameAr: lesson.lessonName.ar || "",
    lessonNameEn: lesson.lessonName.en || "",
    lessonLevel: lesson.lessonLevel || "",
    price: lesson.price?.toString() || "",
    currency: lesson.currency || "SAR",
    courseHours: lesson.courseHours?.toString() || "",
    descriptionAr: lesson.description.ar || "",
    descriptionEn: lesson.description.en || "",
    instructorImage: null as File | null,
    instructorImagePreview: lesson.instructorImage || null as string | null,
    schedule: (lesson.schedule || []) as ScheduleItem[],
    isPublished: lesson.isPublished || false,
  });

  // Load departments on mount (only if lessonType is department)
  useEffect(() => {
    const loadData = async () => {
      try {
        if (formData.lessonType === "department") {
          await getDepartments(dispatch);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    if (isOpen) {
      loadData();
    }
  }, [dispatch, formData.lessonType, isOpen]);

  const lessonLevels = [
    { value: "beginner", label: language === "ar" ? "مبتدئ" : "Beginner" },
    { value: "intermediate", label: language === "ar" ? "متوسط" : "Intermediate" },
    { value: "advanced", label: language === "ar" ? "متقدم" : "Advanced" },
  ];

  const currencies = [
    { value: "SAR", label: "SAR" },
    { value: "EGP", label: "EGP" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        instructorImage: file,
        instructorImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      instructorImage: null,
      instructorImagePreview: lesson.instructorImage || null,
    }));
  };

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          date: "",
          time: "",
          duration: 1,
        },
      ],
    }));
  };

  const removeScheduleItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const updateScheduleItem = (index: number, field: keyof ScheduleItem, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.instructorNameAr || !formData.instructorNameEn) {
      toast.error(language === "ar" ? "يرجى إدخال اسم المدرس" : "Please enter instructor name");
      return;
    }
    if (!formData.locationUrl) {
      toast.error(language === "ar" ? "يرجى إدخال رابط الموقع" : "Please enter location URL");
      return;
    }
    if (!formData.lessonNameAr || !formData.lessonNameEn) {
      toast.error(language === "ar" ? "يرجى إدخال اسم الدرس" : "Please enter lesson name");
      return;
    }
    if (!formData.lessonLevel) {
      toast.error(language === "ar" ? "يرجى اختيار المستوى" : "Please select level");
      return;
    }
    if (!formData.price) {
      toast.error(language === "ar" ? "يرجى إدخال السعر" : "Please enter price");
      return;
    }
    if (!formData.descriptionAr || !formData.descriptionEn) {
      toast.error(language === "ar" ? "يرجى إدخال الوصف" : "Please enter description");
      return;
    }
    if (formData.lessonType === "department" && !formData.department) {
      toast.error(language === "ar" ? "يرجى اختيار القسم" : "Please select department");
      return;
    }

    try {
      const lessonData: UpdatePrivateLessonRequest = {
        lessonType: formData.lessonType as "department" | "professional",
        "instructorName.ar": formData.instructorNameAr,
        "instructorName.en": formData.instructorNameEn,
        locationUrl: formData.locationUrl,
        "lessonName.ar": formData.lessonNameAr,
        "lessonName.en": formData.lessonNameEn,
        lessonLevel: formData.lessonLevel as "beginner" | "intermediate" | "advanced",
        price: parseFloat(formData.price),
        currency: formData.currency as "SAR" | "EGP",
        "description.ar": formData.descriptionAr,
        "description.en": formData.descriptionEn,
        instructorImage: formData.instructorImage || undefined,
      };

      if (formData.jobTitleAr) lessonData["jobTitle.ar"] = formData.jobTitleAr;
      if (formData.jobTitleEn) lessonData["jobTitle.en"] = formData.jobTitleEn;
      if (formData.lessonType === "department" && formData.department) {
        lessonData.department = formData.department;
      }
      if (formData.courseHours) lessonData.courseHours = parseFloat(formData.courseHours);
      if (formData.schedule.length > 0) lessonData.schedule = formData.schedule;
      if (formData.isPublished !== undefined) lessonData.isPublished = formData.isPublished;

      await updatePrivateLesson(lesson._id, lessonData, dispatch);
      toast.success(language === "ar" ? "تم تحديث الدرس الخاص بنجاح" : "Private lesson updated successfully");
      // Reload the lesson
      await getPrivateLessonById(lesson._id, dispatch);
      onUpdateSuccess();
    } catch (error) {
      console.error("Failed to update private lesson:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto ${
          theme === "dark"
            ? "bg-blue-900/95 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-blue-800/30 bg-inherit z-10">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "تعديل الدرس الخاص" : "Update Private Lesson"}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-blue-800/50 text-blue-300"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Instructor Image */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "صورة المدرس" : "Instructor Image"}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  theme === "dark"
                    ? "border-blue-700 bg-blue-800/20 hover:border-blue-600"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400"
                }`}
              >
                {formData.instructorImagePreview ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={formData.instructorImagePreview}
                      alt="Instructor preview"
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
                          ? "انقر لرفع صورة المدرس"
                          : "Click to upload instructor image"}
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Instructor Details - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instructor Name Arabic */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "اسم المدرس بالعربية" : "Instructor Name (Arabic)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="instructorNameAr"
                  value={formData.instructorNameAr}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل اسم المدرس بالعربية" : "Enter instructor name in Arabic"}
                />
              </div>

              {/* Instructor Name English */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "اسم المدرس بالإنجليزية" : "Instructor Name (English)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="instructorNameEn"
                  value={formData.instructorNameEn}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "Enter instructor name in English" : "Enter instructor name in English"}
                />
              </div>

              {/* Job Title Arabic */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "المسمى الوظيفي بالعربية" : "Job Title (Arabic)"}
                </label>
                <input
                  type="text"
                  name="jobTitleAr"
                  value={formData.jobTitleAr}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل المسمى الوظيفي بالعربية" : "Enter job title in Arabic"}
                />
              </div>

              {/* Job Title English */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "المسمى الوظيفي بالإنجليزية" : "Job Title (English)"}
                </label>
                <input
                  type="text"
                  name="jobTitleEn"
                  value={formData.jobTitleEn}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "Enter job title in English" : "Enter job title in English"}
                />
              </div>

              {/* Location URL */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "رابط الموقع (Google Maps)" : "Location URL (Google Maps)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="url"
                  name="locationUrl"
                  value={formData.locationUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>

            {/* Department - Only for department type */}
            {formData.lessonType === "department" && (
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
                    onChange={handleInputChange}
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

            {/* Lesson Details - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lesson Name Arabic */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "اسم الدرس بالعربية" : "Lesson Name (Arabic)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="lessonNameAr"
                  value={formData.lessonNameAr}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل اسم الدرس بالعربية" : "Enter lesson name in Arabic"}
                />
              </div>

              {/* Lesson Name English */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "اسم الدرس بالإنجليزية" : "Lesson Name (English)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="lessonNameEn"
                  value={formData.lessonNameEn}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "Enter lesson name in English" : "Enter lesson name in English"}
                />
              </div>

              {/* Lesson Level */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "مستوى الدرس" : "Lesson Level"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="lessonLevel"
                    value={formData.lessonLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">
                      {language === "ar" ? "اختر المستوى" : "Select level"}
                    </option>
                    {lessonLevels.map((level) => (
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

              {/* Currency */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "العملة" : "Currency"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {currencies.map((curr) => (
                      <option key={curr.value} value={curr.value}>
                        {curr.label}
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

              {/* Price */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "السعر" : "Price"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0.00"
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
                </label>
                <input
                  type="number"
                  name="courseHours"
                  value={formData.courseHours}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description Arabic */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "الوصف بالعربية" : "Description (Arabic)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder={language === "ar" ? "أدخل الوصف بالعربية" : "Enter description in Arabic"}
                />
              </div>

              {/* Description English */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "الوصف بالإنجليزية" : "Description (English)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder={language === "ar" ? "Enter description in English" : "Enter description in English"}
                />
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label
                  className={`block text-sm font-semibold ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "الجدول الزمني" : "Schedule"}
                </label>
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === "ar" ? "إضافة موعد" : "Add Schedule"}</span>
                </button>
              </div>
              <div className="space-y-4">
                {formData.schedule.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      theme === "dark"
                        ? "bg-blue-800/20 border-blue-700"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "التاريخ" : "Date"}
                        </label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateScheduleItem(index, "date", e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            theme === "dark"
                              ? "bg-blue-800/30 border-blue-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "الوقت" : "Time"}
                        </label>
                        <input
                          type="time"
                          value={item.time}
                          onChange={(e) => updateScheduleItem(index, "time", e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            theme === "dark"
                              ? "bg-blue-800/30 border-blue-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${
                            theme === "dark" ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {language === "ar" ? "المدة (ساعات)" : "Duration (hours)"}
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={item.duration}
                          onChange={(e) => updateScheduleItem(index, "duration", parseFloat(e.target.value) || 1)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            theme === "dark"
                              ? "bg-blue-800/30 border-blue-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeScheduleItem(index)}
                          className={`w-full px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                            theme === "dark"
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>{language === "ar" ? "حذف" : "Remove"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.schedule.length === 0 && (
                  <p
                    className={`text-sm text-center py-4 ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  >
                    {language === "ar"
                      ? "لا توجد مواعيد. انقر على 'إضافة موعد' لإضافة موعد جديد."
                      : "No schedule items. Click 'Add Schedule' to add a new item."}
                  </p>
                )}
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                }
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="isPublished"
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "نشر الدرس" : "Publish Lesson"}
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  theme === "dark"
                    ? "bg-blue-800/50 hover:bg-blue-800 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                }`}
              >
                {isLoading
                  ? language === "ar"
                    ? "جاري التحديث..."
                    : "Updating..."
                  : language === "ar"
                  ? "تحديث الدرس"
                  : "Update Lesson"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
