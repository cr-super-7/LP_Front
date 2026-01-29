"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { deleteConsultation, getProfessorConsultations } from "../../store/api/consultationApi";
import type { Consultation } from "../../store/interface/consultationInterface";
import { Calendar, MessageSquare, Phone, Trash2, User } from "lucide-react";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";

type StatusFilter = "all" | "pending" | "active" | "completed" | "cancelled";
type TypeFilter = "all" | "call" | "chat";

export default function InquiryTeacherContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const dispatch = useAppDispatch();
  const { consultations, isLoading } = useAppSelector((state: RootState) => state.consultation);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await getProfessorConsultations(
          status === "all" ? undefined : status,
          type === "all" ? undefined : type,
          dispatch
        );
      } catch (e) {
        console.error("Failed to load consultations:", e);
      }
    };
    load();
  }, [status, type, dispatch]);

  const handleDeleteClick = (consultationId: string) => {
    setConsultationToDelete(consultationId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!consultationToDelete) return;
    try {
      await deleteConsultation(consultationToDelete, dispatch);
      // Ensure the list stays in sync with current filters
      await getProfessorConsultations(
        status === "all" ? undefined : status,
        type === "all" ? undefined : type,
        dispatch
      );
      setConsultationToDelete(null);
    } catch (e) {
      console.error("Failed to delete consultation:", e);
    }
  };

  const sorted = useMemo(() => {
    const copy = [...consultations];
    copy.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return copy;
  }, [consultations]);

  const getStudentLabel = (c: Consultation) => {
    if (typeof c.student === "string") return c.student;
    return c.student.email || c.student._id;
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return language === "ar" ? "غير محدد" : "Not set";
    const date = new Date(iso);
    return date.toLocaleString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusLabel = (value: Consultation["status"]) => {
    if (language === "ar") {
      if (value === "pending") return "قيد الانتظار";
      if (value === "active") return "نشطة";
      if (value === "completed") return "مكتملة";
      return "ملغاة";
    }
    return value;
  };

  const typeLabel = (value: Consultation["type"]) => {
    if (language === "ar") return value === "call" ? "مكالمة" : "محادثة";
    return value;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {language === "ar" ? "طلبات الاستشارات" : "Consultation Requests"}
        </h1>
        <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {language === "ar"
            ? "هنا ستجد كل الاستشارات الخاصة بك كمدرس."
            : "Here you can manage your consultations as an instructor."}
        </p>
      </div>

      <div
        className={`mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl p-4 ${
          theme === "dark"
            ? "bg-blue-900/40 border border-blue-800"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div>
          <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
            {language === "ar" ? "الحالة" : "Status"}
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
              theme === "dark"
                ? "bg-blue-950 border-blue-800 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          >
            <option value="all">{language === "ar" ? "الكل" : "All"}</option>
            <option value="pending">{language === "ar" ? "قيد الانتظار" : "pending"}</option>
            <option value="active">{language === "ar" ? "نشطة" : "active"}</option>
            <option value="completed">{language === "ar" ? "مكتملة" : "completed"}</option>
            <option value="cancelled">{language === "ar" ? "ملغاة" : "cancelled"}</option>
          </select>
        </div>

        <div>
          <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
            {language === "ar" ? "النوع" : "Type"}
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TypeFilter)}
            className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
              theme === "dark"
                ? "bg-blue-950 border-blue-800 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          >
            <option value="all">{language === "ar" ? "الكل" : "All"}</option>
            <option value="call">{language === "ar" ? "مكالمة" : "call"}</option>
            <option value="chat">{language === "ar" ? "محادثة" : "chat"}</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : sorted.length === 0 ? (
        <div className={`rounded-lg p-8 text-center ${theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"}`}>
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {language === "ar" ? "لا توجد استشارات حالياً." : "No consultations yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((c) => (
            <Link
              key={c._id}
              href={`/inquiry_teacher/${c._id}`}
              className={`rounded-2xl overflow-hidden transition-all duration-300 group ${
                theme === "dark"
                  ? "bg-blue-900/50 border border-blue-800"
                  : "bg-white border border-gray-200 shadow-md hover:shadow-xl"
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <User className={`${theme === "dark" ? "text-blue-200" : "text-blue-600"}`} size={18} />
                    <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold text-sm`}>
                      {getStudentLabel(c)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        c.status === "active"
                          ? theme === "dark"
                            ? "bg-green-900/80 text-green-200"
                            : "bg-green-100 text-green-700"
                          : c.status === "pending"
                          ? theme === "dark"
                            ? "bg-yellow-900/80 text-yellow-200"
                            : "bg-yellow-100 text-yellow-700"
                          : c.status === "completed"
                          ? theme === "dark"
                            ? "bg-blue-900/80 text-blue-200"
                            : "bg-blue-100 text-blue-700"
                          : theme === "dark"
                          ? "bg-gray-900/60 text-gray-200"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {statusLabel(c.status)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(c._id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "bg-red-600/20 hover:bg-red-600/30 text-red-300"
                          : "bg-red-50 hover:bg-red-100 text-red-600"
                      }`}
                      aria-label={language === "ar" ? "حذف الاستشارة" : "Delete consultation"}
                      title={language === "ar" ? "حذف" : "Delete"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {c.type === "call" ? (
                      <Phone className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={16} />
                    ) : (
                      <MessageSquare className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={16} />
                    )}
                    <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                      {typeLabel(c.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={16} />
                    <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                      {formatDateTime(c.scheduledAt)}
                    </span>
                  </div>
                </div>

                <div className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {language === "ar" ? "تم الإنشاء:" : "Created:"} {formatDateTime(c.createdAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setConsultationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={language === "ar" ? "تأكيد حذف الاستشارة" : "Confirm Delete Consultation"}
        message={
          language === "ar"
            ? "هل أنت متأكد من حذف هذه الاستشارة؟ سيتم حذف المحادثة المرتبطة إن وُجدت."
            : "Are you sure you want to delete this consultation? Related chat messages (if any) will be deleted."
        }
      />
    </div>
  );
}

