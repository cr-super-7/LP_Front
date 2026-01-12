"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Lightbulb, Link2, User, ExternalLink, ChevronRight, ChevronLeft, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyResearches } from "../../store/api/researchApi";
import type { Research } from "../../store/interface/researchInterface";
import ResearchTypeModal from "./ResearchTypeModal";
import { useState } from "react";

export default function MyResearchesContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { researches, isLoading } = useAppSelector((state) => state.research);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load researches on mount
  useEffect(() => {
    const loadResearches = async () => {
      try {
        await getMyResearches(dispatch);
      } catch (error) {
        console.error("Failed to load researches:", error);
      }
    };
    loadResearches();
  }, [dispatch]);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleContinue = (researchId: string) => {
    // TODO: Navigate to research details/edit page when available
    router.push(`/researches/${researchId}`);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Top Banner - Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-800/30">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <Image
            src="/myCourse.jpg"
            alt="Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Dark Blue Overlay */}
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-gray-700/80" : "bg-gray-300/80"
          }`}
        ></div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {/* Lightbulb Icon - Yellow */}
                <Lightbulb className="h-6 w-6 text-yellow-400" strokeWidth={2.5} fill="currentColor" />
                <h1
                  className={`text-3xl md:text-4xl font-bold ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar"
                    ? "شارك خبرتك. ألهم العقول."
                    : "Share Your Expertise. Inspire Minds."}
                </h1>
              </div>
              <p
                className={`text-lg max-w-2xl ${
                  theme === "dark" ? "text-white/90" : "text-blue-950/90"
                }`}
              >
                {language === "ar"
                  ? "أنشئ دورة البحث التالية وساعد المتعلمين على النمو — سواء كانت دورة سريعة أو برنامج كامل، أنت على بعد خطوات قليلة من إحداث تأثير."
                  : "Create your next course and help learners grow — whether it's a quick tutorial or a full program, you're just a few steps away from making an impact."}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <span>
                {language === "ar" ? "إنشاء دورة جديدة" : "Create new Course"}
              </span>
              {language === "ar" ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Continue Creating Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
            }`}
          >
            <Link2
              className={`h-6 w-6 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
          </div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "متابعة الإنشاء" : "Continue Creating"}
          </h2>
        </div>

        {/* Research Cards Grid */}
        {isLoading ? (
          <div
            className={`text-center py-8 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : researches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researches.map((research) => (
              <ResearchCard
                key={research._id}
                research={research}
                theme={theme}
                language={language}
                onContinue={() => handleContinue(research._id)}
              />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            <p className="text-lg">
              {language === "ar"
                ? "لا توجد أبحاث بعد. ابدأ بإنشاء بحث جديد!"
                : "No researches yet. Start by creating a new research!"}
            </p>
          </div>
        )}
      </div>

      {/* Research Type Modal */}
      <ResearchTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

interface ResearchCardProps {
  research: Research;
  theme: "dark" | "light";
  language: "ar" | "en";
  onContinue?: () => void;
}

function ResearchCard({
  research,
  theme,
  language,
  onContinue,
}: ResearchCardProps) {
  // Get localized content
  const title =
    language === "ar" ? research.title.ar || research.title.en : research.title.en || research.title.ar;

  const description =
    language === "ar"
      ? research.description.ar || research.description.en
      : research.description.en || research.description.ar;

  const researcherName =
    language === "ar"
      ? research.researcherName.ar || research.researcherName.en
      : research.researcherName.en || research.researcherName.ar;

  // Get image URL - using file URL as thumbnail or default image
  const imageUrl = research.file || "/home/privet_lessons.png";

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Research Image */}
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Approval Status Badge */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-sm ${
            research.isApproved
              ? "bg-green-600/80 text-white"
              : "bg-yellow-600/80 text-white"
          }`}
        >
          {research.isApproved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-semibold">
                {language === "ar" ? "مقبول" : "Approved"}
              </span>
            </>
          ) : (
            <>
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">
                {language === "ar" ? "قيد المراجعة" : "Under Review"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Research Content */}
      <div
        className={`p-5 space-y-4 ${
          theme === "dark" 
            ? "bg-blue-950" 
            : "bg-linear-to-b from-blue-50 to-blue-100"
        }`}
      >
        {/* Title */}
        <h3
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm leading-relaxed ${
            theme === "dark" ? "text-white" : "text-blue-700"
          }`}
        >
          {description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2">
          <User
            className={`h-4 w-4 ${
              theme === "dark" ? "text-white" : "text-blue-600"
            }`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-white" : "text-blue-700"
            }`}
          >
            {researcherName}
          </span>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border-2 ${
            theme === "dark"
              ? "bg-transparent border-blue-500 text-blue-500 hover:bg-blue-500/10"
              : "bg-transparent border-blue-400 text-blue-600 hover:bg-blue-400/10"
          }`}
        >
          <span>{language === "ar" ? "متابعة" : "Continue"}</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
