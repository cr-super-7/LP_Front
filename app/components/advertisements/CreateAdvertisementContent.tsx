"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { ArrowLeft, Upload, ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createAdvertisement } from "../../store/api/advertisementApi";
import type { CreateAdvertisementRequest } from "../../store/interface/advertisementInterface";
import toast from "react-hot-toast";

export default function CreateAdvertisementContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.advertisement);

  const [formData, setFormData] = useState({
    descriptionAr: "",
    descriptionEn: "",
    advertisementType: "" as "privateLessons" | "courses" | "researches" | "all" | "",
    image: null as File | null,
    imagePreview: null as string | null,
  });

  const advertisementTypes = [
    {
      value: "privateLessons",
      label: language === "ar" ? "الدروس الخصوصية" : "Private Lessons",
    },
    {
      value: "courses",
      label: language === "ar" ? "الكورسات" : "Courses",
    },
    {
      value: "researches",
      label: language === "ar" ? "الأبحاث" : "Researches",
    },
    {
      value: "all",
      label: language === "ar" ? "الكل" : "All",
    },
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
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.image) {
      toast.error(language === "ar" ? "يرجى رفع صورة الإعلان" : "Please upload advertisement image");
      return;
    }
    if (!formData.descriptionAr || !formData.descriptionEn) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال وصف الإعلان بالعربية والإنجليزية"
          : "Please enter advertisement description in both Arabic and English"
      );
      return;
    }
    if (!formData.advertisementType) {
      toast.error(
        language === "ar" ? "يرجى اختيار نوع الإعلان" : "Please select advertisement type"
      );
      return;
    }

    try {
      const advertisementData: CreateAdvertisementRequest = {
        image: formData.image,
        "description.ar": formData.descriptionAr,
        "description.en": formData.descriptionEn,
        advertisementType: formData.advertisementType as
          | "privateLessons"
          | "courses"
          | "researches"
          | "all",
      };

      await createAdvertisement(advertisementData, dispatch);
      toast.success(
        language === "ar"
          ? "تم إنشاء الإعلان بنجاح وهو قيد المراجعة"
          : "Advertisement created successfully and pending approval"
      );
      router.push("/profile");
    } catch (error) {
      console.error("Failed to create advertisement:", error);
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
              {language === "ar" ? "إنشاء إعلان" : "Create Advertisement"}
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
            {/* Upload Advertisement Image */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar" ? "رفع صورة الإعلان" : "Upload Advertisement Image"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  theme === "dark"
                    ? "border-blue-700 bg-blue-800/20 hover:border-blue-600"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400"
                }`}
              >
                {formData.imagePreview ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={formData.imagePreview}
                      alt="Advertisement preview"
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
                          ? "انقر لرفع صورة الإعلان"
                          : "Click to upload advertisement image"}
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Advertisement Details - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description Arabic */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "وصف الإعلان بالعربية" : "Description (Arabic)"}
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
                      ? "أدخل وصف الإعلان بالعربية..."
                      : "Enter advertisement description in Arabic..."
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
                  {language === "ar" ? "وصف الإعلان بالإنجليزية" : "Description (English)"}
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
                      ? "Enter advertisement description in English..."
                      : "Enter advertisement description in English..."
                  }
                />
              </div>

              {/* Advertisement Type */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "نوع الإعلان" : "Advertisement Type"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="advertisementType"
                    value={formData.advertisementType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        advertisementType: e.target.value as
                          | "privateLessons"
                          | "courses"
                          | "researches"
                          | "all"
                          | "",
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                      theme === "dark"
                        ? "bg-blue-800/30 border-blue-700 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">
                      {language === "ar" ? "اختر نوع الإعلان" : "Select advertisement type"}
                    </option>
                    {advertisementTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
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
            </div>

            {/* Info Message */}
            <div
              className={`p-4 rounded-lg ${
                theme === "dark" ? "bg-blue-800/30 border border-blue-700" : "bg-blue-50 border border-blue-200"
              }`}
            >
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-blue-200" : "text-blue-700"
                }`}
              >
                {language === "ar"
                  ? "ملاحظة: سيتم مراجعة الإعلان من قبل الإدارة قبل الموافقة عليه ونشره."
                  : "Note: The advertisement will be reviewed by the administration before approval and publication."}
              </p>
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
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
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
