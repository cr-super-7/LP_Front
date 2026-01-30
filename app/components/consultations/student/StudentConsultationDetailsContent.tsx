"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Hash,
  MessageSquare,
  Phone,
  User,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTheme } from "../../../contexts/ThemeContext";
import type { Consultation } from "../../../store/interface/consultationInterface";
import ConsultationChatPanel from "../shared/ConsultationChatPanel";

type Props = {
  consultation: Consultation;
};

export default function StudentConsultationDetailsContent({ consultation }: Props) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const router = useRouter();

  const container = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return language === "ar" ? "غير محدد" : "Not set";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
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
      if (value === "cancelled") return "ملغاة";
      return value;
    }
    return value;
  };

  const typeLabel = (value: Consultation["type"]) => {
    if (language === "ar") return value === "call" ? "مكالمة" : "محادثة";
    return value;
  };

  const professorLabel = (() => {
    if (typeof consultation.professor === "string") return consultation.professor;
    const p = consultation.professor;
    if (p?.name) return language === "ar" ? p.name.ar : p.name.en;
    return p?.user?.email || p?._id || (language === "ar" ? "أستاذ" : "Professor");
  })();

  const meetLink = consultation.meetLink;
  const canOpenMeetLink = typeof meetLink === "string" && meetLink.startsWith("http");

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <motion.button
          type="button"
          onClick={() => router.back()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
            theme === "dark"
              ? "bg-blue-900/40 border-blue-800 text-blue-200 hover:bg-blue-900/60"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ArrowLeft className={`${isRTL ? "rotate-180" : ""}`} size={18} />
          <span>{language === "ar" ? "رجوع" : "Back"}</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <Sparkles className={`${theme === "dark" ? "text-blue-300" : "text-blue-600"} h-5 w-5`} />
          <h1 className={`text-xl md:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
            {language === "ar" ? "تفاصيل الاستشارة" : "Consultation Details"}
          </h1>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div
          className={`relative overflow-hidden rounded-3xl p-6 md:p-7 shadow-xl ${
            theme === "dark"
              ? "bg-blue-900/45 backdrop-blur-sm border border-blue-800/60"
              : "bg-white border border-gray-200"
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-0 opacity-40 ${
              theme === "dark"
                ? "bg-linear-to-br from-blue-600/20 via-transparent to-cyan-400/10"
                : "bg-linear-to-br from-blue-50 via-white to-cyan-50"
            }`}
          />

          <div className="relative flex items-start justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center border ${
                  theme === "dark"
                    ? "bg-blue-950/50 border-blue-800 text-blue-200"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                <Hash size={18} />
              </div>
              <div>
                <div className={`text-xs ${theme === "dark" ? "text-blue-200/80" : "text-gray-500"}`}>
                  {language === "ar" ? "رقم الاستشارة" : "Consultation ID"}
                </div>
                <div className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold break-all`}>
                  {consultation._id}
                </div>
              </div>
            </div>

            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                consultation.status === "active"
                  ? theme === "dark"
                    ? "bg-green-500/15 text-green-200 border-green-400/30"
                    : "bg-green-50 text-green-700 border-green-200"
                  : consultation.status === "pending"
                    ? theme === "dark"
                      ? "bg-yellow-500/15 text-yellow-200 border-yellow-400/30"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : consultation.status === "completed"
                      ? theme === "dark"
                        ? "bg-blue-500/15 text-blue-200 border-blue-400/30"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                      : theme === "dark"
                        ? "bg-gray-500/15 text-gray-200 border-gray-400/30"
                        : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {statusLabel(consultation.status)}
            </span>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={item} className="rounded-2xl border p-4 flex items-start gap-3">
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                  theme === "dark" ? "bg-blue-950/60 text-blue-200" : "bg-blue-50 text-blue-700"
                }`}
              >
                <User size={18} />
              </div>
              <div className="min-w-0">
                <div className={`text-xs ${theme === "dark" ? "text-blue-200/80" : "text-gray-500"}`}>
                  {language === "ar" ? "الأستاذ" : "Professor"}
                </div>
                <div className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold break-all`}>
                  {professorLabel}
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="rounded-2xl border p-4 flex items-start gap-3">
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                  theme === "dark" ? "bg-blue-950/60 text-blue-200" : "bg-blue-50 text-blue-700"
                }`}
              >
                {consultation.type === "call" ? <Phone size={18} /> : <MessageSquare size={18} />}
              </div>
              <div>
                <div className={`text-xs ${theme === "dark" ? "text-blue-200/80" : "text-gray-500"}`}>
                  {language === "ar" ? "النوع" : "Type"}
                </div>
                <div className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>
                  {typeLabel(consultation.type)}
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="rounded-2xl border p-4 flex items-start gap-3">
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                  theme === "dark" ? "bg-blue-950/60 text-blue-200" : "bg-blue-50 text-blue-700"
                }`}
              >
                <Calendar size={18} />
              </div>
              <div>
                <div className={`text-xs ${theme === "dark" ? "text-blue-200/80" : "text-gray-500"}`}>
                  {language === "ar" ? "الموعد" : "Scheduled"}
                </div>
                <div className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>
                  {formatDateTime(consultation.scheduledAt)}
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="rounded-2xl border p-4 flex items-start gap-3">
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                  theme === "dark" ? "bg-blue-950/60 text-blue-200" : "bg-blue-50 text-blue-700"
                }`}
              >
                <Calendar size={18} />
              </div>
              <div>
                <div className={`text-xs ${theme === "dark" ? "text-blue-200/80" : "text-gray-500"}`}>
                  {language === "ar" ? "تم الإنشاء" : "Created"}
                </div>
                <div className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>
                  {formatDateTime(consultation.createdAt)}
                </div>
              </div>
            </motion.div>
  
            {meetLink && (
              <motion.div variants={item} className="rounded-2xl border p-4 flex items-start gap-3 md:col-span-2">
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                    theme === "dark" ? "bg-blue-950/60 text-blue-200" : "bg-blue-50 text-blue-700"
                  }`}
                >
                  <ExternalLink size={18} />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs ${theme === "dark" ? "text-blue-200/80" : "text-gray-500"}`}>
                    {language === "ar" ? "رابط الاجتماع" : "Meeting link"}
                  </div>
                  {canOpenMeetLink ? (
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block mt-1 text-sm font-semibold underline break-all ${
                        theme === "dark" ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      {meetLink}
                    </a>
                  ) : (
                    <div className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold break-all`}>
                      {meetLink}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {consultation.type === "chat" && (
            <motion.div variants={item} className="relative mt-6">
              <ConsultationChatPanel consultationId={consultation._id} />
            </motion.div>
          )}

          {consultation.notes && (
            <motion.div variants={item} className="relative mt-6">
              <div
                className={`rounded-2xl p-5 border ${
                  theme === "dark"
                    ? "bg-blue-950/50 border-blue-800 text-blue-100"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className={`${theme === "dark" ? "text-blue-300" : "text-blue-600"} h-4 w-4`} />
                  <div className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                    {language === "ar" ? "ملاحظات" : "Notes"}
                  </div>
                </div>
                <div className={`mt-2 text-sm leading-relaxed ${theme === "dark" ? "text-blue-100/90" : "text-gray-700"}`}>
                  {consultation.notes}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

