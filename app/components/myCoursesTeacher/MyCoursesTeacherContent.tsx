"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Pencil,
  Paperclip,
  Globe,
  BookOpen,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import CourseTypeModal from "./CourseTypeModal";

interface Course {
  id: number;
  title: string;
  lessons: number;
  hours: number;
  level: string;
  description: string;
  createdDate: string;
  status: string;
  image: string;
}

export default function MyCoursesTeacherContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - سيتم استبدالها بالبيانات من API
  const continueCreatingCourses: Course[] = [
    {
      id: 1,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "This course have no statue",
      image: "/home/privet_lessons.png",
    },
    {
      id: 2,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "This course have no statue",
      image: "/home/privet_lessons.png",
    },
    {
      id: 3,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "This course have no statue",
      image: "/home/privet_lessons.png",
    },
    {
      id: 4,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "This course have no statue",
      image: "/home/privet_lessons.png",
    },
    {
      id: 5,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "This course have no statue",
      image: "/home/privet_lessons.png",
    },
  ];

  const publishedCourses: Course[] = [
    {
      id: 6,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "Published",
      image: "/home/privet_lessons.png",
    },
    {
      id: 7,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "Published",
      image: "/home/privet_lessons.png",
    },
    {
      id: 8,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "Published",
      image: "/home/privet_lessons.png",
    },
    {
      id: 9,
      title: "Introduction To UI",
      lessons: 15,
      hours: 15,
      level: "Advanced",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      createdDate: "1 Apr 2025",
      status: "Published",
      image: "/home/privet_lessons.png",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Top Banner */}
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
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-gray-700/80" : "bg-gray-300/80"}`}></div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {/* Pencil Icon - Yellow with red eraser */}
                <div className="relative">
                  <Pencil className="h-6 w-6 text-yellow-400" strokeWidth={2.5} />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
                  {language === "ar"
                    ? "شارك خبرتك. ألهم العقول."
                    : "Share Your Expertise. Inspire Minds."}
                </h1>
              </div>
              <p className={`text-lg max-w-2xl ${theme === "dark" ? "text-white/90" : "text-blue-950/90"}`}>
                {language === "ar"
                  ? "أنشئ دورتك التالية وساعد المتعلمين على النمو — سواء كانت دورة سريعة أو برنامج كامل، أنت على بعد خطوات قليلة من إحداث تأثير."
                  : "Create your next course and help learners grow — whether it's a quick tutorial or a full program, you're just a few steps away from making an impact."}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <span>{language === "ar" ? "إنشاء دورة جديدة" : "Create new Course"}</span>
              {language === "ar" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Course Type Modal */}
      <CourseTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Continue Creating Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Paperclip
            className={`h-6 w-6 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "متابعة الإنشاء" : "Continue Creating"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {continueCreatingCourses.map((course) => (
            <CourseCard key={course.id} course={course} theme={theme} language={language} />
          ))}
        </div>
      </div>

      {/* Published Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe
              className={`h-6 w-6 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}
            >
              {language === "ar" ? "منشور" : "Published"}
            </h2>
          </div>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {publishedCourses.length}{" "}
            {language === "ar" ? "دورة منشورة حتى الآن" : "Courses Published till now"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCourses.map((course) => (
            <CourseCard key={course.id} course={course} theme={theme} language={language} isPublished />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  theme: "dark" | "light";
  language: "ar" | "en";
  isPublished?: boolean;
}

function CourseCard({ course, theme, language, isPublished = false }: CourseCardProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Course Image */}
      <div className="relative w-full h-48">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {course.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {course.lessons}{" "}
              {language === "ar" ? "درس" : "Lessons"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {course.hours} {language === "ar" ? "س" : "h"}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              theme === "dark"
                ? "bg-blue-800/50 text-blue-300"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {course.level}
          </span>
        </div>

        {/* Description */}
        <p
          className={`text-sm line-clamp-2 ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {course.description}
        </p>

        {/* Created Date */}
        <p
          className={`text-xs ${
            theme === "dark" ? "text-blue-300" : "text-gray-500"
          }`}
        >
          {language === "ar" ? "تم الإنشاء في" : "Created on"} {course.createdDate}
        </p>

        {/* Status */}
        {!isPublished && (
          <div className="flex items-center gap-2">
            <RefreshCw
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-xs ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {course.status}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {language === "ar" ? "متابعة" : "Continue"}
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

