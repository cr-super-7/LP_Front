"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import Link from "next/link";
import { getProfessors } from "../../store/api/professorApi";
import type { Professor } from "../../store/interface/professorInterface";

type AvailabilityFilter = "all" | "available" | "unavailable";

export default function InquiryContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");

  useEffect(() => {
    let isActive = true;
    const loadProfessors = async () => {
      try {
        setIsLoading(true);
        const data = await getProfessors({
          isAvailable:
            availability === "all"
              ? undefined
              : availability === "available",
        });
        if (!isActive) return;
        setProfessors(data || []);
      } catch (error) {
        console.error("Failed to load professors:", error);
        if (isActive) setProfessors([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadProfessors();
    return () => {
      isActive = false;
    };
  }, [availability]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProfessors = useMemo(() => {
    if (!normalizedQuery) return professors;
    return professors.filter((professor) => {
      const haystack = [
        professor.name.ar,
        professor.name.en,
        professor.description.ar,
        professor.description.en,
        professor.vision.ar,
        professor.vision.en,
        professor.message.ar,
        professor.message.en,
        professor.user.email,
        professor.user.phone || "",
        ...(professor.achievements || []).flatMap((achievement) => [
          achievement.ar,
          achievement.en,
        ]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, professors]);

  const getAvailabilityLabel = (value: AvailabilityFilter) => {
    if (language === "ar") {
      if (value === "available") return "متاح الآن";
      if (value === "unavailable") return "غير متاح";
      return "الكل";
    }
    if (value === "available") return "Available";
    if (value === "unavailable") return "Unavailable";
    return "All";
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price} ${currency}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "ar" ? "الاستشارات" : "Inquiry"}
          </h1>
          <p
            className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {language === "ar"
              ? "اختر أستاذك المناسب واحجز استشارتك بكل سهولة."
              : "Find the right professor and book your consultation easily."}
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl p-4 ${
            theme === "dark" ? "bg-blue-900/40 border border-blue-800" : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div>
            <label
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {language === "ar" ? "ابحث" : "Search"}
            </label>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={
                language === "ar"
                  ? "ابحث بالاسم أو الرسالة أو البريد"
                  : "Search by name, message, or email"
              }
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                theme === "dark"
                  ? "bg-blue-950 border-blue-800 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
          <div>
            <label
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {language === "ar" ? "الحالة" : "Availability"}
            </label>
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                theme === "dark"
                  ? "bg-blue-950 border-blue-800 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            >
              {(["all", "available", "unavailable"] as AvailabilityFilter[]).map(
                (value) => (
                  <option key={value} value={value}>
                    {getAvailabilityLabel(value)}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProfessors.length === 0 ? (
        <div
          className={`rounded-lg p-8 text-center ${
            theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
          }`}
        >
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {language === "ar"
              ? "لا توجد نتائج مطابقة حالياً."
              : "No matching results found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessors.map((professor) => {
            const initials = professor.user.email?.slice(0, 2).toUpperCase();
            const ratingValue = Number.isFinite(professor.rating)
              ? professor.rating
              : 0;
            const displayName =
              language === "ar" ? professor.name.ar : professor.name.en;
            const description =
              language === "ar"
                ? professor.description.ar
                : professor.description.en;
            const message =
              language === "ar" ? professor.message.ar : professor.message.en;
            const achievements = professor.achievements || [];
            return (
              <Link
                key={professor._id}
                href={`/inquiry/${professor._id}`}
                className={`rounded-2xl overflow-hidden transition-all duration-300 group ${
                  theme === "dark"
                    ? "bg-blue-900/50 border border-blue-800"
                    : "bg-white border border-gray-200 shadow-md hover:shadow-xl"
                }`}
              >
                <div className="relative h-44">
                  {professor.image || professor.user.profilePicture ? (
                    <Image
                      src={professor.image || professor.user.profilePicture || ""}
                      alt={displayName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div
                      className={`h-full w-full flex items-center justify-center text-2xl font-semibold ${
                        theme === "dark" ? "bg-blue-950 text-blue-200" : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
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
                          ? "متاح"
                          : "Available"
                        : language === "ar"
                        ? "غير متاح"
                        : "Unavailable"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                    ★ {ratingValue.toFixed(1)}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3
                      className={`text-lg font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {displayName}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {description}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg px-3 py-2 text-xs ${
                      theme === "dark" ? "bg-blue-950/70 text-blue-100" : "bg-blue-50 text-blue-800"
                    }`}
                  >
                    {language === "ar" ? "رسالة الأستاذ" : "Professor message"}:{" "}
                    <span className="line-clamp-2">{message}</span>
                  </div>

                  {achievements.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {achievements.slice(0, 3).map((achievement) => (
                        <span
                          key={achievement._id}
                          className={`text-xs px-2 py-1 rounded-full ${
                            theme === "dark"
                              ? "bg-blue-900/80 text-blue-200"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {language === "ar" ? achievement.ar : achievement.en}
                        </span>
                      ))}
                      {achievements.length > 3 && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            theme === "dark"
                              ? "bg-blue-900/80 text-blue-200"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          +{achievements.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`text-base font-semibold ${
                        theme === "dark" ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      {formatPrice(professor.consultationPrice, professor.currency)}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {language === "ar" ? "التقييمات" : "Reviews"}:{" "}
                      {professor.totalReviews ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
