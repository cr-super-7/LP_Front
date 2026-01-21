import type { Metadata } from "next";
import CreateCoursePageClient from "./CreateCoursePageClient";

export const metadata: Metadata = {
  title: "Create Course - LP Company | إنشاء دورة - شركة LP",
  description:
    "Create a new course on LP Company. أنشئ دورة جديدة على منصة شركة LP.",
  keywords: [
    "create course",
    "instructor",
    "LP Company",
    "إنشاء دورة",
    "مدرب",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/create-course",
    languages: {
      "ar-SA": "/create-course",
      "en-US": "/create-course",
      "x-default": "/create-course",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCoursePage() {
  return <CreateCoursePageClient />;
}

