"use client";

import { useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { CheckCircle, Clock, X } from "lucide-react";

interface ReviewPendingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewPendingModal({
  isOpen,
  onClose,
}: ReviewPendingModalProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === "ar";

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 ${
          theme === "dark"
            ? "bg-blue-900/95 backdrop-blur-sm border border-blue-800/50"
            : "bg-white border border-gray-200"
        } animate-scaleIn`}
        style={{
          animation: "scaleIn 0.3s ease-out",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} p-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "hover:bg-blue-800/50 text-blue-300"
              : "hover:bg-gray-100 text-gray-600"
          }`}
          aria-label={language === "ar" ? "إغلاق" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          {/* Success Icon with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full animate-ping ${
                  theme === "dark" ? "bg-green-400/30" : "bg-green-500/30"
                }`}
              />
              <div
                className={`relative p-4 rounded-full ${
                  theme === "dark" ? "bg-green-800/50" : "bg-green-100"
                }`}
              >
                <CheckCircle
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-green-300" : "text-green-600"
                  } animate-scaleIn`}
                  style={{
                    animation: "scaleIn 0.5s ease-out 0.2s both",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "تم إنشاء الدرس بنجاح!" : "Lesson Created Successfully!"}
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "تم حفظ الدرس بنجاح في النظام"
                : "The lesson has been successfully saved"}
            </p>
          </div>

          {/* Review Info Card */}
          <div
            className={`p-6 rounded-xl border ${
              theme === "dark"
                ? "bg-blue-800/30 border-blue-700/50"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-yellow-800/30" : "bg-yellow-100"
                }`}
              >
                <Clock
                  className={`h-6 w-6 ${
                    theme === "dark" ? "text-yellow-300" : "text-yellow-600"
                  } animate-pulse`}
                />
              </div>
              <div className={`flex-1 text-${isRTL ? "right" : "left"}`}>
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar" ? "قيد المراجعة" : "Under Review"}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar"
                    ? "سيتم مراجعة الدرس من قبل الأدمن. ستحصل على إشعار عند الموافقة عليه أو رفضه بعد مراجعة المحتوى."
                    : "Your lesson will be reviewed by an admin. You will receive a notification once it's approved or rejected after content review."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
            } hover:scale-105 active:scale-95`}
          >
            {language === "ar" ? "حسناً، فهمت" : "Got it, thanks!"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
