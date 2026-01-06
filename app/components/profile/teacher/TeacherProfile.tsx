"use client";

import Image from "next/image";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../layout/Sidebar";
import Navbar from "../../layout/Navbar";
import Background from "../../layout/Background";
import Footer from "../../layout/Footer";

export type UserProfile = {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "student" | "instructor" | "teacher" | string;
  roleName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  createdAt?: string;
  totalCourses?: number;
  cartCount?: number;
  inProgressCount?: number;
  completedCount?: number;
};

type TeacherProfileProps = {
  user?: UserProfile | null;
};

export default function TeacherProfile({ user }: TeacherProfileProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const textAlign = isRTL ? "text-right" : "text-left";
  const normalizedRole = (user?.role || user?.roleName || "").toLowerCase();
  const isTeacherRole =
    normalizedRole === "teacher" ||
    normalizedRole === "instructor" ||
    normalizedRole === "معلم" ||
    normalizedRole === "مدرس";
  const roleLabel =
    language === "ar"
      ? isTeacherRole
        ? "المعلّم"
        : "الطالب"
      : isTeacherRole
      ? "Teacher"
      : "Student";

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        theme === "dark" ? "bg-blue-950" : "bg-gray-50"
      }`}
    >
      <Background />

      <div className="relative z-10">
        <Sidebar />
        <Navbar />

        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Profile header */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 shadow-2xl px-6 py-10 sm:px-10 sm:py-12">
              {/* subtle waves */}
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />
                <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-indigo-500 blur-3xl" />
              </div>

              <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                {/* Avatar */}
                <div className="relative h-32 w-32 shrink-0 rounded-full border-4 border-blue-300 bg-blue-900/50 shadow-xl">
                  <Image
                    src={
                      user?.avatarUrl || "/images/profile/teacher-placeholder.jpg"
                    }
                    alt="Teacher avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-md hover:bg-blue-400">
                    Edit
                  </button>
                </div>

                {/* Name + stats */}
                <div className="flex-1 space-y-4">
                  <div className={textAlign}>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
                      {roleLabel.toUpperCase()}
                    </p>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      {user?.email ||
                        user?.fullName ||
                        user?.name ||
                        "DR. Linda Tromp"}
                    </h1>
                    {(user?.bio || user?.location) && (
                      <p className="mt-1 text-sm text-blue-100 line-clamp-2">
                        {user?.bio || user?.location}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className={`space-y-1 ${textAlign}`}>
                      <p className="text-sm font-medium text-blue-200">
                        {language === "ar" ? "جميع الدورات" : "All Courses"}
                      </p>
                      <p className="text-3xl font-extrabold text-white">
                        {user?.totalCourses ?? 11}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <ProfileStat
                        color="orange"
                        label={language === "ar" ? "في السلة" : "Cart"}
                        value={String(user?.cartCount ?? 3)}
                      />
                      <ProfileStat
                        color="indigo"
                        label={language === "ar" ? "قيد التقدّم" : "In Progress"}
                        value={String(user?.inProgressCount ?? 3)}
                      />
                      <ProfileStat
                        color="green"
                        label={language === "ar" ? "مكتملة" : "Completed"}
                        value={String(user?.completedCount ?? 6)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top course */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-white">
                {language === "ar" ? "أفضل دوراتي" : "My Top Course"}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <CourseCard highlight />
                <CourseCard />
              </div>
            </section>

            {/* All courses */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-white">
                {language === "ar" ? "دوراتي" : "My Courses"}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
              </div>
            </section>
          </div>
        </main>

        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

type ProfileStatProps = {
  label: string;
  value: string;
  color: "orange" | "indigo" | "green";
};

function ProfileStat({ label, value, color }: ProfileStatProps) {
  const colorClasses: Record<ProfileStatProps["color"], string> = {
    orange:
      "from-orange-500/90 to-orange-600/90 border-orange-300/60 shadow-orange-500/40",
    indigo:
      "from-indigo-500/90 to-indigo-600/90 border-indigo-300/60 shadow-indigo-500/40",
    green:
      "from-emerald-500/90 to-emerald-600/90 border-emerald-300/60 shadow-emerald-500/40",
  };

  return (
    <div
      className={`inline-flex min-w-[140px] items-center justify-center gap-2 rounded-full border bg-gradient-to-r px-5 py-2 text-sm font-semibold text-white shadow-lg ${colorClasses[color]}`}
    >
      <span>{value}</span>
      <span>{label}</span>
    </div>
  );
}

type CourseCardProps = {
  highlight?: boolean;
};

function CourseCard({ highlight }: CourseCardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl bg-slate-900/80 text-white shadow-xl ring-1 ring-slate-700/60 ${
        highlight ? "scale-[1.01] border border-blue-400/60" : ""
      }`}
    >
      <div className="relative h-40 w-full">
        <Image
          src="/images/courses/course-placeholder.jpg"
          alt="Course image"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Introduction To UI</h3>
          <p className="text-xs text-slate-300">
            15 Lessons • 500 Std • 15 h
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-slate-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold">
              Advanced
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <span className="text-base">★</span> 4.3
            </span>
          </div>
          <span className="font-bold text-blue-300">1400 $</span>
        </div>

        <button className="mt-3 w-full rounded-full bg-blue-600 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500">
          View
        </button>
      </div>
    </article>
  );
}


