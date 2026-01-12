"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { ArrowLeft, ChevronDown, X, FileText, File } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createResearch } from "../../store/api/researchApi";
import { getDepartments } from "../../store/api/departmentApi";
import { getOthersPlaces } from "../../store/api/othersPlaceApi";
import type { CreateResearchRequest } from "../../store/interface/researchInterface";
import toast from "react-hot-toast";

export default function CreateResearchContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector((state) => state.department);
  const { othersPlaces } = useAppSelector((state) => state.othersPlace);
  const { isLoading } = useAppSelector((state) => state.research);

  // Get researchType from query parameter
  const researchTypeParam = searchParams.get("researchType") as "university" | "others" | null;

  // Redirect if no researchType is provided
  useEffect(() => {
    if (!researchTypeParam || (researchTypeParam !== "university" && researchTypeParam !== "others")) {
      toast.error(language === "ar" ? "يرجى اختيار نوع البحث" : "Please select research type");
      router.push("/researches/my-researches");
    }
  }, [researchTypeParam, router, language]);

  const [activeTab, setActiveTab] = useState<"writing" | "upload">("writing");
  const [formData, setFormData] = useState({
    researchType: researchTypeParam || "university",
    researcherNameAr: "",
    researcherNameEn: "",
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    researchDataAr: "",
    researchDataEn: "",
    department: "",
    othersPlace: "",
    coverImage: null as File | null,
    coverImagePreview: null as string | null,
    researchFile: null as File | null,
  });

  // Load departments or othersPlaces on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (formData.researchType === "university") {
          await getDepartments(dispatch);
        } else if (formData.researchType === "others") {
          await getOthersPlaces(dispatch);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [dispatch, formData.researchType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const removeCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
      coverImagePreview: null,
    }));
  };

  const handleResearchFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        researchFile: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.researcherNameAr || !formData.researcherNameEn) {
      toast.error(language === "ar" ? "يرجى إدخال اسم الباحث" : "Please enter researcher name");
      return;
    }
    if (!formData.titleAr || !formData.titleEn) {
      toast.error(language === "ar" ? "يرجى إدخال عنوان البحث" : "Please enter research title");
      return;
    }
    if (!formData.descriptionAr || !formData.descriptionEn) {
      toast.error(language === "ar" ? "يرجى إدخال الوصف" : "Please enter description");
      return;
    }
    if (!formData.researchFile) {
      toast.error(language === "ar" ? "يرجى رفع ملف البحث" : "Please upload research file");
      return;
    }
    if (formData.researchType === "university" && !formData.department) {
      toast.error(language === "ar" ? "يرجى اختيار القسم" : "Please select department");
      return;
    }
    if (formData.researchType === "others" && !formData.othersPlace) {
      toast.error(language === "ar" ? "يرجى اختيار المكان الآخر" : "Please select others place");
      return;
    }

    try {
      const researchData: CreateResearchRequest = {
        file: formData.researchFile,
        "researcherName.ar": formData.researcherNameAr,
        "researcherName.en": formData.researcherNameEn,
        "title.ar": formData.titleAr,
        "title.en": formData.titleEn,
        "description.ar": formData.descriptionAr,
        "description.en": formData.descriptionEn,
        researchType: formData.researchType as "university" | "others",
      };

      if (formData.researchType === "university" && formData.department) {
        researchData.department = formData.department;
      }
      if (formData.researchType === "others" && formData.othersPlace) {
        researchData.othersPlace = formData.othersPlace;
      }

      await createResearch(researchData, dispatch);
      toast.success(language === "ar" ? "تم إنشاء البحث بنجاح" : "Research created successfully");
      router.push("/researches/my-researches");
    } catch (error) {
      console.error("Failed to create research:", error);
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
              {language === "ar" ? "إنشاء بحث" : "Create Research"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar" ? "آخر تحديث:" : "Last update:"} {new Date().toLocaleDateString()}
            </p>
            <button
              onClick={() => router.back()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-800/50 hover:bg-blue-800 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
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
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-blue-800/30">
            <button
              onClick={() => setActiveTab("writing")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "writing"
                  ? theme === "dark"
                    ? "border-blue-500 text-blue-300"
                    : "border-blue-600 text-blue-600"
                  : theme === "dark"
                  ? "border-transparent text-blue-400 hover:text-blue-300"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {language === "ar" ? "الكتابة" : "Writing"}
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "upload"
                  ? theme === "dark"
                    ? "border-blue-500 text-blue-300"
                    : "border-blue-600 text-blue-600"
                  : theme === "dark"
                  ? "border-transparent text-blue-400 hover:text-blue-300"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {language === "ar" ? "رفع PDF" : "Upload PDF"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content based on active tab */}
            {activeTab === "writing" ? (
              <>
                {/* Upload Research Cover - Writing Tab */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-white" : "text-blue-950"
                    }`}
                  >
                    {language === "ar" ? "رفع غلاف البحث" : "Upload Research Cover"}
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
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeCoverImage}
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
                          onChange={handleCoverImageUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-4">
                          <div
                            className={`p-4 rounded-lg ${
                              theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
                            }`}
                          >
                            <FileText
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
                              ? "انقر لرفع غلاف البحث"
                              : "Click to upload research cover"}
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Researcher Name - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "اسم الباحث بالعربية" : "Researcher Name (Arabic)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="researcherNameAr"
                  value={formData.researcherNameAr}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل اسم الباحث بالعربية" : "Enter researcher name in Arabic"}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "اسم الباحث بالإنجليزية" : "Researcher Name (English)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="researcherNameEn"
                  value={formData.researcherNameEn}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "Enter researcher name in English" : "Enter researcher name in English"}
                />
              </div>
            </div>

            {/* Research Title and Level - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "عنوان البحث" : "Research Title"}
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
                  placeholder={language === "ar" ? "أدخل عنوان البحث" : "Enter research title"}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "مستوى البحث" : "Research Level"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="researchLevel"
                    className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="advanced">
                      {language === "ar" ? "متقدم" : "Advanced"}
                    </option>
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  />
                </div>
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
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                placeholder={language === "ar" ? "أدخل الوصف" : "Enter description"}
              />
            </div>

            {/* Research Data - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "بيانات البحث بالعربية" : "Research Data (Arabic)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="researchDataAr"
                  value={formData.researchDataAr}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder={language === "ar" ? "أدخل بيانات البحث بالعربية" : "Enter research data in Arabic"}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "بيانات البحث بالإنجليزية" : "Research Data (English)"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="researchDataEn"
                  value={formData.researchDataEn}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder={language === "ar" ? "Enter research data in English" : "Enter research data in English"}
                />
              </div>
            </div>

            {/* Department or Others Place */}
            {formData.researchType === "university" ? (
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
            ) : (
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "المكان الآخر" : "Others Place"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="othersPlace"
                    value={formData.othersPlace}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">
                      {language === "ar" ? "اختر المكان الآخر" : "Select others place"}
                    </option>
                    {othersPlaces.map((place) => {
                      const placeName = typeof place.name === "string" 
                        ? place.name 
                        : language === "ar" 
                        ? place.name.ar || place.name.en 
                        : place.name.en || place.name.ar;
                      return (
                        <option key={place._id} value={place._id}>
                          {placeName}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none ${
                      theme === "dark" ? "text-blue-300" : "text-gray-500"
                    }`}
                  />
                </div>
              </div>
            )}
              </>
            ) : (
              <>
                {/* Upload PDF Tab - Upload Sections + Form Fields */}
                {/* Upload Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Cover Image */}
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 ${
                        theme === "dark" ? "text-white" : "text-blue-950"
                      }`}
                    >
                      {language === "ar" ? "رفع غلاف البحث" : "Upload Research Cover"}
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
                            alt="Cover preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeCoverImage}
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
                            onChange={handleCoverImageUpload}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center gap-4">
                            <div
                              className={`p-4 rounded-lg ${
                                theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
                              }`}
                            >
                              <FileText
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
                                ? "انقر لرفع غلاف البحث"
                                : "Click to upload research cover"}
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* PDF File */}
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-3 ${
                        theme === "dark" ? "text-white" : "text-blue-950"
                      }`}
                    >
                      {language === "ar" ? "رفع ملف البحث PDF" : "Upload Research PDF"}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                        theme === "dark"
                          ? "border-blue-700 bg-blue-800/20 hover:border-blue-600"
                          : "border-gray-300 bg-gray-50 hover:border-blue-400"
                      }`}
                    >
                      {formData.researchFile ? (
                        <div className="flex flex-col items-center gap-4">
                          <div
                            className={`p-4 rounded-lg ${
                              theme === "dark" ? "bg-green-800/50" : "bg-green-100"
                            }`}
                          >
                            <File
                              className={`h-12 w-12 ${
                                theme === "dark" ? "text-green-300" : "text-green-600"
                              }`}
                            />
                          </div>
                          <p
                            className={`text-sm font-semibold ${
                              theme === "dark" ? "text-green-300" : "text-green-600"
                            }`}
                          >
                            {formData.researchFile.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, researchFile: null }))}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            {language === "ar" ? "إزالة" : "Remove"}
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResearchFileUpload}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center gap-4">
                            <div
                              className={`p-4 rounded-lg ${
                                theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
                              }`}
                            >
                              <File
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
                                ? "انقر لرفع ملف البحث"
                                : "Click to upload research file"}
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Research Title and Level - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        theme === "dark" ? "text-white" : "text-blue-950"
                      }`}
                    >
                      {language === "ar" ? "عنوان البحث" : "Research Title"}
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
                      placeholder={language === "ar" ? "أدخل عنوان البحث" : "Enter research title"}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        theme === "dark" ? "text-white" : "text-blue-950"
                      }`}
                    >
                      {language === "ar" ? "مستوى البحث" : "Research Level"}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="researchLevel"
                        className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                          theme === "dark"
                            ? "bg-blue-800/30 border-blue-700 text-white"
                            : "bg-gray-50 border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="advanced">
                          {language === "ar" ? "متقدم" : "Advanced"}
                        </option>
                      </select>
                      <ChevronDown
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none ${
                          theme === "dark" ? "text-blue-300" : "text-gray-500"
                        }`}
                      />
                    </div>
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
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    placeholder={language === "ar" ? "أدخل الوصف" : "Enter description"}
                  />
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
