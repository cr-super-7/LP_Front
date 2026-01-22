"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MessageCircle, PhoneCall } from "lucide-react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getProfessorById } from "../../store/api/professorApi";
import type { Professor } from "../../store/interface/professorInterface";
import ProfessorReviews from "./ProfessorReviews";

export default function InquiryDetailsContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const params = useParams();
  const professorId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [professor, setProfessor] = useState<Professor | null>(null);

  useEffect(() => {
    let isActive = true;
    const loadProfessor = async () => {
      try {
        setIsLoading(true);
        const data = await getProfessorById(professorId);
        if (!isActive) return;
        setProfessor(data);
      } catch (error) {
        console.error("Failed to load professor details:", error);
        if (isActive) setProfessor(null);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    if (professorId) {
      loadProfessor();
    }
    return () => {
      isActive = false;
    };
  }, [professorId]);

  const formattedData = useMemo(() => {
    if (!professor) return null;
    const displayName =
      language === "ar" ? professor.name.ar : professor.name.en;
    const description =
      language === "ar" ? professor.description.ar : professor.description.en;
    const vision = language === "ar" ? professor.vision.ar : professor.vision.en;
    const message =
      language === "ar" ? professor.message.ar : professor.message.en;
    const achievements = professor.achievements || [];
    return {
      displayName,
      description,
      vision,
      message,
      achievements,
      image: professor.image || professor.user.profilePicture,
    };
  }, [language, professor]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!professor || !formattedData) {
    return (
      <div
        className={`rounded-lg p-8 text-center ${
          theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
        }`}
      >
        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {language === "ar"
            ? "لا توجد بيانات لهذا الأستاذ."
            : "Professor details are unavailable."}
        </p>
      </div>
    );
  }

  const ratingValue = Number.isFinite(professor.rating) ? professor.rating : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div
        className={`grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 rounded-3xl overflow-hidden ${
          theme === "dark"
            ? "bg-blue-900/60 border border-blue-800"
            : "bg-white border border-gray-200 shadow-lg"
        }`}
      >
        <div className="relative min-h-[320px]">
          {formattedData.image ? (
            <Image
              src={formattedData.image}
              alt={formattedData.displayName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div
              className={`h-full w-full flex items-center justify-center text-3xl font-semibold ${
                theme === "dark" ? "bg-blue-950 text-blue-200" : "bg-blue-50 text-blue-700"
              }`}
            >
              {formattedData.displayName.slice(0, 2)}
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                professor.isAvailable
                  ? theme === "dark"
                    ? "bg-green-900/80 text-green-200"
                    : "bg-green-100 text-green-700"
                  : theme === "dark"
                  ? "bg-gray-800/80 text-gray-200"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {professor.isAvailable
                ? language === "ar"
                  ? "متاح للاستشارة"
                  : "Available"
                : language === "ar"
                ? "غير متاح"
                : "Unavailable"}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {formattedData.displayName}
            </h1>
            <p
              className={`mt-2 text-sm md:text-base ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {formattedData.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`px-3 py-1 rounded-full ${
                theme === "dark" ? "bg-blue-950 text-blue-200" : "bg-blue-50 text-blue-700"
              }`}
            >
              ★ {ratingValue.toFixed(1)}
            </span>
            <span
              className={`px-3 py-1 rounded-full ${
                theme === "dark" ? "bg-blue-950 text-blue-200" : "bg-blue-50 text-blue-700"
              }`}
            >
              {language === "ar" ? "التقييمات" : "Reviews"}: {professor.totalReviews ?? 0}
            </span>
            <span
              className={`px-3 py-1 rounded-full ${
                theme === "dark" ? "bg-blue-950 text-blue-200" : "bg-blue-50 text-blue-700"
              }`}
            >
              {language === "ar" ? "الاستشارات" : "Consultations"}: {professor.totalConsultations}
            </span>
          </div>

          <div
            className={`rounded-xl p-4 ${
              theme === "dark" ? "bg-blue-950/70 text-blue-100" : "bg-gray-50 text-gray-700"
            }`}
          >
            <p className="text-sm font-semibold">
              {language === "ar" ? "الرؤية" : "Vision"}
            </p>
            <p className="mt-1 text-sm">{formattedData.vision}</p>
          </div>

          <div
            className={`rounded-xl p-4 ${
              theme === "dark" ? "bg-blue-950/70 text-blue-100" : "bg-gray-50 text-gray-700"
            }`}
          >
            <p className="text-sm font-semibold">
              {language === "ar" ? "الرسالة" : "Message"}
            </p>
            <p className="mt-1 text-sm">{formattedData.message}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-xl font-semibold ${
                theme === "dark" ? "text-blue-300" : "text-blue-700"
              }`}
            >
              {professor.consultationPrice} {professor.currency}
            </span>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                professor.isAvailable
                  ? theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-400"
                  : "bg-gray-200 text-gray-500"
              }`}
              disabled={!professor.isAvailable}
            >
              {language === "ar" ? "احجز استشارة" : "Book Inquiry"}
            </button>
          </div>
        </div>
      </div>

      {formattedData.achievements.length > 0 && (
        <section
          className={`rounded-2xl p-6 ${
            theme === "dark" ? "bg-blue-900/50 border border-blue-800" : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الإنجازات" : "Achievements"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formattedData.achievements.map((achievement) => (
              <div
                key={achievement._id}
                className={`rounded-xl p-4 text-sm ${
                  theme === "dark" ? "bg-blue-950/70 text-blue-100" : "bg-gray-50 text-gray-700"
                }`}
              >
                {language === "ar" ? achievement.ar : achievement.en}
              </div>
            ))}
          </div>
        </section>
      )}

      <ProfessorReviews professorId={professor._id} />

      <section
        className={`rounded-2xl p-6 ${
          theme === "dark" ? "bg-blue-900/50 border border-blue-800" : "bg-white border border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {language === "ar"
            ? "اختر طريقة الاستشارة"
            : "Choose a method to receive inquiries"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            className={`rounded-2xl p-6 text-center transition-transform hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-blue-950/70 text-blue-100"
                : "bg-blue-50 text-blue-900"
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
                theme === "dark" ? "bg-blue-900/80" : "bg-blue-100"
              }`}
            >
              <MessageCircle className="h-12 w-12" />
            </div>
            <p className="text-lg font-semibold">
              {language === "ar" ? "دردشة" : "Chat"}
            </p>
            <p className="text-sm mt-2">
              {language === "ar"
                ? "ابدأ محادثة فورية مع الأستاذ"
                : "Start a direct chat with the professor"}
            </p>
          </button>
          <button
            type="button"
            className={`rounded-2xl p-6 text-center transition-transform hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-blue-950/70 text-blue-100"
                : "bg-blue-50 text-blue-900"
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
                theme === "dark" ? "bg-blue-900/80" : "bg-blue-100"
              }`}
            >
              <PhoneCall className="h-12 w-12" />
            </div>
            <p className="text-lg font-semibold">
              {language === "ar" ? "مكالمة صوتية" : "Voice meeting"}
            </p>
            <p className="text-sm mt-2">
              {language === "ar"
                ? "احجز موعداً لمكالمة صوتية"
                : "Book a scheduled voice meeting"}
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
