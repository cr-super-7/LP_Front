import type { Metadata } from "next";
import MyCoursesTeacherPageClient from "./MyCoursesTeacherPageClient";

export const metadata: Metadata = {
  title: "My Courses - LP Company | دوراتي - شركة LP",
  description:
    "View and manage your courses on LP Company. استعرض وأدر دوراتك على منصة شركة LP.",
  keywords: [
    "my courses",
    "courses",
    "LP Company",
    "دوراتي",
    "دورات",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/myCoursesTeacher",
    languages: {
      "ar-SA": "/myCoursesTeacher",
      "en-US": "/myCoursesTeacher",
      "x-default": "/myCoursesTeacher",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyCoursesTeacherPage() {
  return <MyCoursesTeacherPageClient />;
}

