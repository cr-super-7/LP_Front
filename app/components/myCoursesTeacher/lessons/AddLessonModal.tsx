"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { X, Upload, Video } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createLesson, updateLesson } from "../../../store/api/lessonApi";
import ReviewPendingModal from "./ReviewPendingModal";
import toast from "react-hot-toast";
import type { CreateLessonRequest, UpdateLessonRequest, Lesson } from "../../../store/interface/lessonInterface";

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  lesson?: Lesson | null;
  onSuccess: () => void;
}

export default function AddLessonModal({
  isOpen,
  onClose,
  courseId,
  lesson,
  onSuccess,
}: AddLessonModalProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.lesson);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    duration: "",
    isFree: false,
    videoFile: null as File | null,
    videoPreview: null as string | null,
  });

  const isEditMode = !!lesson;

  // Update form data when lesson changes or modal opens
  useEffect(() => {
    if (isOpen && lesson) {
      // Edit mode - load lesson data
      setFormData({
        titleAr: typeof lesson.title === "string" ? lesson.title : lesson.title.ar || "",
        titleEn: typeof lesson.title === "string" ? lesson.title : lesson.title.en || "",
        duration: lesson.duration?.toString() || "",
        isFree: lesson.isFree || false,
        videoFile: null,
        videoPreview: lesson.videoUrl || null,
      });
    } else if (isOpen && !lesson) {
      // Add mode - reset form
      setFormData({
        titleAr: "",
        titleEn: "",
        duration: "",
        isFree: false,
        videoFile: null,
        videoPreview: null,
      });
    }
  }, [isOpen, lesson]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        videoFile: file,
        videoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const removeVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videoFile: null,
      videoPreview: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.titleAr || !formData.titleEn) {
      toast.error(language === "ar" ? "يرجى إدخال عنوان الدرس" : "Please enter lesson title");
      return;
    }

    if (!isEditMode && !formData.videoFile) {
      toast.error(language === "ar" ? "يرجى رفع فيديو الدرس" : "Please upload lesson video");
      return;
    }

    if (!formData.duration || parseFloat(formData.duration) <= 0) {
      toast.error(language === "ar" ? "يرجى إدخال مدة الدرس بالدقائق" : "Please enter lesson duration in minutes");
      return;
    }

    try {
      if (isEditMode && lesson) {
        const updateData: UpdateLessonRequest = {
          "title.ar": formData.titleAr,
          "title.en": formData.titleEn,
        };

        if (formData.videoFile) {
          updateData.videoUrl = formData.videoFile;
        }
        if (formData.duration) {
          updateData.duration = parseFloat(formData.duration);
        }
        updateData.isFree = formData.isFree;

        await updateLesson(lesson._id, updateData, dispatch);
        // Close modal and reload lessons after successful update
        onSuccess();
        onClose();
      } else {
        if (!formData.videoFile) {
          toast.error(language === "ar" ? "يرجى رفع فيديو الدرس" : "Please upload lesson video");
          return;
        }

        const lessonData: CreateLessonRequest = {
          "title.ar": formData.titleAr,
          "title.en": formData.titleEn,
          course: courseId,
          videoUrl: formData.videoFile,
          duration: parseFloat(formData.duration),
        };

        if (formData.isFree) {
          lessonData.isFree = formData.isFree;
        }

        await createLesson(lessonData, dispatch);
        // Show review modal after successful creation
        setShowReviewModal(true);
      }

      // Reset form only if not in edit mode (for create mode, form will reset after review modal closes)
      if (isEditMode) {
        setFormData({
          titleAr: "",
          titleEn: "",
          duration: "",
          isFree: false,
          videoFile: null,
          videoPreview: null,
        });
      }
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  };

  const handleReviewModalClose = () => {
    setShowReviewModal(false);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
          theme === "dark"
            ? "bg-blue-900/95 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800/30 sticky top-0 bg-inherit z-10">
          <h2
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {isEditMode
              ? language === "ar"
                ? "تعديل الدرس"
                : "Edit Lesson"
              : language === "ar"
              ? "إضافة درس جديد"
              : "Add New Lesson"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Arabic */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "عنوان الدرس بالعربية" : "Lesson Title (Arabic)"}
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
              placeholder={language === "ar" ? "أدخل عنوان الدرس بالعربية" : "Enter lesson title in Arabic"}
              required
            />
          </div>

          {/* Title English */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "عنوان الدرس بالإنجليزية" : "Lesson Title (English)"}
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
              placeholder={language === "ar" ? "Enter lesson title in English" : "Enter lesson title in English"}
              required
            />
          </div>

          {/* Video Upload */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "فيديو الدرس" : "Lesson Video"}
              {!isEditMode && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                theme === "dark"
                  ? "border-blue-700 bg-blue-800/20 hover:border-blue-600"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400"
              }`}
            >
              {formData.videoPreview || (isEditMode && lesson?.videoUrl) ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Video
                      className={`h-16 w-16 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-blue-200" : "text-gray-600"
                    }`}
                  >
                    {formData.videoFile
                      ? formData.videoFile.name
                      : isEditMode
                      ? language === "ar"
                        ? "فيديو موجود (اختر ملف جديد للتحديث)"
                        : "Video exists (select new file to update)"
                      : ""}
                  </p>
                  {formData.videoFile && (
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      {language === "ar" ? "إزالة" : "Remove"}
                    </button>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    required={!isEditMode}
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
                        ? "انقر لرفع فيديو الدرس"
                        : "Click to upload lesson video"}
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "مدة الدرس بالدقائق" : "Lesson Duration (minutes)"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === "dark"
                  ? "bg-blue-800/30 border-blue-700 text-white placeholder-blue-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="30"
              min="1"
              required
            />
          </div>

          {/* Is Free */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFree"
              name="isFree"
              checked={formData.isFree}
              onChange={handleInputChange}
              className={`w-5 h-5 rounded border-2 cursor-pointer ${
                theme === "dark"
                  ? "bg-blue-800/30 border-blue-700 text-blue-500"
                  : "bg-gray-50 border-gray-300 text-blue-600"
              } focus:ring-2 focus:ring-blue-500`}
            />
            <label
              htmlFor="isFree"
              className={`text-sm font-semibold cursor-pointer ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "هل الدرس مجاني؟" : "Is the lesson free?"}
              <span className="text-gray-500 text-xs font-normal ml-1">
                ({language === "ar" ? "اختياري" : "Optional"})
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
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
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
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
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isEditMode
                ? language === "ar"
                  ? "تحديث"
                  : "Update"
                : language === "ar"
                ? "إضافة"
                : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* Review Pending Modal */}
      <ReviewPendingModal
        isOpen={showReviewModal}
        onClose={handleReviewModalClose}
      />
    </div>
  );
}
