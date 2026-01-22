"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getProfessors } from "../../store/api/professorApi";
import type { Professor } from "../../store/interface/professorInterface";

type AvailabilityFilter = "all" | "available" | "unavailable";

export default function InquiryContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");

  useEffect(() => {
    let isActive = true;
    const loadProfessors = async () => {
      try {
        setIsLoading(true);
        const data = await getProfessors({
          specialization: specialization === "all" ? undefined : specialization,
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
  }, [availability, specialization]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProfessors = useMemo(() => {
    if (!normalizedQuery) return professors;
    return professors.filter((professor) => {
      const haystack = [
        professor.user.email,
        professor.user.phone || "",
        professor.specialization,
        professor.bio,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, professors]);

  const specializations = useMemo(() => {
    const values = new Set<string>();
    professors.forEach((professor) => {
      if (professor.specialization) values.add(professor.specialization);
    });
    return Array.from(values);
  }, [professors]);

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
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl p-4 ${
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
                  ? "ابحث بالاسم أو التخصص أو البريد"
                  : "Search by name, specialization, or email"
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
              {language === "ar" ? "التخصص" : "Specialization"}
            </label>
            <select
              value={specialization}
              onChange={(event) => setSpecialization(event.target.value)}
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                theme === "dark"
                  ? "bg-blue-950 border-blue-800 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            >
              <option value="all">{language === "ar" ? "كل التخصصات" : "All specializations"}</option>
              {specializations.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
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
            return (
              <div
                key={professor._id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-900/50 border border-blue-800"
                    : "bg-white border border-gray-200 shadow-md hover:shadow-xl"
                }`}
              >
                <div className="relative h-44">
                  {professor.user.profilePicture ? (
                    <Image
                      src={professor.user.profilePicture}
                      alt={professor.user.email}
                      fill
                      className="object-cover"
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
                      {professor.specialization}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {professor.bio}
                    </p>
                  </div>
                  <div
                    className={`flex flex-wrap items-center gap-3 text-xs ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <span>
                      {language === "ar" ? "الخبرة" : "Experience"}: {professor.experience}{" "}
                      {language === "ar" ? "سنة" : "years"}
                    </span>
                    <span>
                      {language === "ar" ? "الاستشارات" : "Consultations"}: {professor.totalConsultations}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`text-base font-semibold ${
                        theme === "dark" ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      {formatPrice(professor.consultationPrice, professor.currency)}
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
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
            );
          })}
        </div>
      )}
    </div>
  );
}
