"use client";

import { useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDeleteModalProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isRTL = language === "ar";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultTitle = language === "ar" ? "تأكيد الحذف" : "Confirm Delete";
  const defaultMessage = language === "ar"
    ? "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."
    : "Are you sure you want to delete this item? This action cannot be undone.";

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
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full animate-ping ${
                  theme === "dark" ? "bg-red-400/30" : "bg-red-500/30"
                }`}
              />
              <div
                className={`relative p-4 rounded-full ${
                  theme === "dark" ? "bg-red-800/50" : "bg-red-100"
                }`}
              >
                <AlertTriangle
                  className={`h-12 w-12 ${
                    theme === "dark" ? "text-red-300" : "text-red-600"
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
              {title || defaultTitle}
            </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {message || defaultMessage}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                theme === "dark"
                  ? "bg-blue-800/50 hover:bg-blue-800 text-blue-200"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } hover:scale-105 active:scale-95`}
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                theme === "dark"
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
              } hover:scale-105 active:scale-95`}
            >
              {language === "ar" ? "حذف" : "Delete"}
            </button>
          </div>
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
