"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { getResearches } from "../../store/api/researchApi";
import { getCourses } from "../../store/api/courseApi";
import { getPrivateLessons } from "../../store/api/privateLessonApi";
import type { Research } from "../../store/interface/researchInterface";
import type { Course } from "../../store/interface/courseInterface";
import type { PrivateLesson } from "../../store/interface/privateLessonInterface";

interface SearchCardProps {
  keyValue: string;
  href: string;
  title: string;
  description: string;
  image: string;
  badge: string;
}

export default function SearchResultsContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [isLoading, setIsLoading] = useState(true);
  const [researches, setResearches] = useState<Research[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [privateLessons, setPrivateLessons] = useState<PrivateLesson[]>([]);

  useEffect(() => {
    let isActive = true;
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [researchesData, coursesData, lessonsData] = await Promise.all([
          getResearches(dispatch),
          getCourses({ page: 1, limit: 100 }, dispatch),
          getPrivateLessons(dispatch),
        ]);

        if (!isActive) return;
        setResearches(researchesData || []);
        setCourses(coursesData?.courses || []);
        setPrivateLessons(lessonsData || []);
      } catch (error) {
        console.error("Failed to load search data:", error);
        if (isActive) {
          setResearches([]);
          setCourses([]);
          setPrivateLessons([]);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isActive = false;
    };
  }, [dispatch]);

  const normalizedQuery = query.toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const filteredResearches = useMemo(() => {
    if (!hasQuery) return [];
    return researches.filter((research) => {
      const haystack = [
        research.title.ar,
        research.title.en,
        research.description.ar,
        research.description.en,
        research.researcherName.ar,
        research.researcherName.en,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [hasQuery, normalizedQuery, researches]);

  const filteredCourses = useMemo(() => {
    if (!hasQuery) return [];
    return courses.filter((course) => {
      const haystack = [
        course.title.ar,
        course.title.en,
        course.description.ar,
        course.description.en,
        course.teacher,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [hasQuery, normalizedQuery, courses]);

  const filteredPrivateLessons = useMemo(() => {
    if (!hasQuery) return [];
    return privateLessons.filter((lesson) => {
      const haystack = [
        lesson.lessonName.ar,
        lesson.lessonName.en,
        lesson.description.ar,
        lesson.description.en,
        lesson.instructorName.ar,
        lesson.instructorName.en,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [hasQuery, normalizedQuery, privateLessons]);

  const totalResults =
    filteredResearches.length +
    filteredCourses.length +
    filteredPrivateLessons.length;

  const renderCard = ({ keyValue, href, title, description, image, badge }: SearchCardProps) => (
    <Link
      key={keyValue}
      href={href}
      className={`group rounded-xl overflow-hidden transition-all duration-300 ${
        theme === "dark"
          ? "bg-blue-900/50 border border-blue-800 hover:bg-blue-900"
          : "bg-white border border-gray-200 hover:bg-blue-50 shadow-md hover:shadow-xl"
      }`}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
              theme === "dark"
                ? "bg-blue-800/80 text-blue-200"
                : "bg-blue-600/90 text-white"
            }`}
          >
            {badge}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3
          className={`text-lg font-bold mb-2 line-clamp-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm line-clamp-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1
          className={`text-2xl md:text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {language === "ar" ? "نتائج البحث" : "Search Results"}
        </h1>
        <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {hasQuery
            ? language === "ar"
              ? `نتائج البحث عن "${query}" (${totalResults})`
              : `Results for "${query}" (${totalResults})`
            : language === "ar"
            ? "اكتب كلمة البحث في شريط البحث بالأعلى."
            : "Type a search keyword in the bar above."}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : !hasQuery ? (
        <div
          className={`rounded-lg p-8 text-center ${
            theme === "dark" ? "bg-blue-900/30" : "bg-gray-50"
          }`}
        >
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {language === "ar"
              ? "ابدأ بالبحث عن دورة أو درس خصوصي أو بحث."
              : "Start searching for a course, private lesson, or research."}
          </p>
        </div>
      ) : totalResults === 0 ? (
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
        <div className="space-y-10">
          {filteredCourses.length > 0 && (
            <section>
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {language === "ar" ? "الدورات" : "Courses"} ({filteredCourses.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) =>
                  renderCard({
                    keyValue: course._id,
                    href: `/courses/${course._id}`,
                    title: language === "ar" ? course.title.ar : course.title.en,
                    description:
                      language === "ar" ? course.description.ar : course.description.en,
                    image: course.thumbnail || "/home/course.png",
                    badge: language === "ar" ? "دورة" : "Course",
                  })
                )}
              </div>
            </section>
          )}

          {filteredPrivateLessons.length > 0 && (
            <section>
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {language === "ar" ? "الدروس الخصوصية" : "Private Lessons"} (
                {filteredPrivateLessons.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrivateLessons.map((lesson) =>
                  renderCard({
                    keyValue: lesson._id,
                    href: `/private-lessons/${lesson._id}`,
                    title:
                      language === "ar"
                        ? lesson.lessonName.ar || lesson.lessonName.en
                        : lesson.lessonName.en || lesson.lessonName.ar,
                    description:
                      language === "ar"
                        ? lesson.description.ar || lesson.description.en
                        : lesson.description.en || lesson.description.ar,
                    image: lesson.instructorImage || "/home/privet_lessons.png",
                    badge: language === "ar" ? "درس خصوصي" : "Private Lesson",
                  })
                )}
              </div>
            </section>
          )}

          {filteredResearches.length > 0 && (
            <section>
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {language === "ar" ? "الأبحاث" : "Researches"} ({filteredResearches.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResearches.map((research) =>
                  renderCard({
                    keyValue: research._id,
                    href: `/researches_student/${research._id}`,
                    title:
                      language === "ar" ? research.title.ar : research.title.en,
                    description:
                      language === "ar"
                        ? research.description.ar
                        : research.description.en,
                    image: research.file || "/home/privet_lessons.png",
                    badge: language === "ar" ? "بحث" : "Research",
                  })
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
