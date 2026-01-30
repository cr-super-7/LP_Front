"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { getConsultationById } from "../../store/api/consultationApi";
import { ArrowLeft, Calendar, Clock, Hash, MessageSquare, Phone, User, ExternalLink } from "lucide-react";
import ConsultationChatPanel from "../consultations/shared/ConsultationChatPanel";

export default function InquiryTeacherDetailsContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentConsultation, isLoading } = useAppSelector((state: RootState) => state.consultation);

  const consultationId = params?.id as string;

  useEffect(() => {
    if (!consultationId) return;
    getConsultationById(consultationId, dispatch).catch((e) => {
      console.error("Failed to load consultation:", e);
    });
  }, [consultationId, dispatch]);

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

  const statusLabel = (value: string) => {
    if (language === "ar") {
      if (value === "pending") return "قيد الانتظار";
      if (value === "active") return "نشطة";
      if (value === "completed") return "مكتملة";
      if (value === "cancelled") return "ملغاة";
      return value;
    }
    return value;
  };

  const typeLabel = (value: string) => {
    if (language === "ar") {
      if (value === "call") return "مكالمة";
      if (value === "chat") return "محادثة";
      return value;
    }
    return value;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes || minutes <= 0) return language === "ar" ? "غير محدد" : "Not set";
    if (language === "ar") return `${minutes} دقيقة`;
    return `${minutes} min`;
  };

  if (!consultationId) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className={`${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
          {language === "ar" ? "معرف الاستشارة غير موجود" : "Consultation ID not found"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!currentConsultation) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className={`${theme === "dark" ? "text-blue-200" : "text-gray-700"}`}>
          {language === "ar" ? "الاستشارة غير موجودة" : "Consultation not found"}
        </p>
      </div>
    );
  }

  const studentLabel =
    typeof currentConsultation.student === "string"
      ? currentConsultation.student
      : currentConsultation.student.email || currentConsultation.student._id;

  const meetLink = currentConsultation.meetLink;
  const canOpenMeetLink = typeof meetLink === "string" && meetLink.startsWith("http");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
            theme === "dark"
              ? "bg-blue-900/50 text-blue-200 hover:bg-blue-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ArrowLeft className={`${isRTL ? "rotate-180" : ""}`} size={18} />
          <span>{language === "ar" ? "رجوع" : "Back"}</span>
        </button>

        <h1 className={`text-xl md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {language === "ar" ? "تفاصيل الاستشارة" : "Consultation Details"}
        </h1>
      </div>

      <div
        className={`rounded-2xl p-6 ${
          theme === "dark"
            ? "bg-blue-900/50 border border-blue-800"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-2">
            <Hash className={`${theme === "dark" ? "text-blue-200" : "text-blue-600"}`} size={18} />
            <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>
              {language === "ar" ? "المعرف:" : "ID:"} {currentConsultation._id}
            </span>
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              currentConsultation.status === "active"
                ? theme === "dark"
                  ? "bg-green-900/80 text-green-200"
                  : "bg-green-100 text-green-700"
                : currentConsultation.status === "pending"
                ? theme === "dark"
                  ? "bg-yellow-900/80 text-yellow-200"
                  : "bg-yellow-100 text-yellow-700"
                : currentConsultation.status === "completed"
                ? theme === "dark"
                  ? "bg-blue-900/80 text-blue-200"
                  : "bg-blue-100 text-blue-700"
                : theme === "dark"
                ? "bg-gray-900/60 text-gray-200"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {statusLabel(currentConsultation.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className={`${theme === "dark" ? "text-blue-200" : "text-blue-600"}`} size={18} />
            <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>
              {language === "ar" ? "الطالب:" : "Student:"} {studentLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentConsultation.type === "call" ? (
              <Phone className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
            ) : (
              <MessageSquare className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
            )}
            <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              {language === "ar" ? "النوع:" : "Type:"} {typeLabel(currentConsultation.type)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
            <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              {language === "ar" ? "الموعد:" : "Scheduled:"} {formatDateTime(currentConsultation.scheduledAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
            <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              {language === "ar" ? "تم الإنشاء:" : "Created:"} {formatDateTime(currentConsultation.createdAt)}
            </span>
          </div>

          {currentConsultation.startedAt && (
            <div className="flex items-center gap-2">
              <Clock className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
              <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                {language === "ar" ? "بدأت:" : "Started:"} {formatDateTime(currentConsultation.startedAt)}
              </span>
            </div>
          )}

          {currentConsultation.endedAt && (
            <div className="flex items-center gap-2">
              <Clock className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
              <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                {language === "ar" ? "انتهت:" : "Ended:"} {formatDateTime(currentConsultation.endedAt)}
              </span>
            </div>
          )}

          {!!currentConsultation.duration && currentConsultation.duration > 0 && (
            <div className="flex items-center gap-2">
              <Clock className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
              <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                {language === "ar" ? "المدة:" : "Duration:"} {formatDuration(currentConsultation.duration)}
              </span>
            </div>
          )}

          {meetLink && (
            <div className="flex items-center gap-2 md:col-span-2">
              <ExternalLink className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`} size={18} />
              <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                {language === "ar" ? "رابط الاجتماع:" : "Meeting link:"}{" "}
                {canOpenMeetLink ? (
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"} underline break-all`}
                  >
                    {meetLink}
                  </a>
                ) : (
                  <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} break-all`}>{meetLink}</span>
                )}
              </span>
            </div>
          )}
        </div>

        {currentConsultation.type === "chat" && (
          <div className="mt-6">
            <ConsultationChatPanel consultationId={currentConsultation._id} />
          </div>
        )}

        {currentConsultation.notes && (
          <div
            className={`mt-6 rounded-xl p-4 ${
              theme === "dark"
                ? "bg-blue-950/60 border border-blue-800"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {language === "ar" ? "ملاحظات" : "Notes"}
            </div>
            <div className={`mt-2 text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              {currentConsultation.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

