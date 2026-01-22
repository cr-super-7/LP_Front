import type { Metadata } from "next";
import PrivateLessonsPageClient from "./PrivateLessonsPageClient";

export const metadata: Metadata = {
  title: "Private Lessons - LP Company | الدروس الخاصة - شركة LP",
  description:
    "Find private lessons with qualified instructors on LP Company. اعثر على دروس خاصة مع مدربين مؤهلين على منصة شركة LP.",
  keywords: [
    "private lessons",
    "tutoring",
    "instructors",
    "LP Company",
    "دروس خاصة",
    "دروس خصوصية",
    "مدربين",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/privet_lessons",
    languages: {
      "ar-SA": "/privet_lessons",
      "en-US": "/privet_lessons",
      "x-default": "/privet_lessons",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/privet_lessons",
    siteName: "LP Company",
    title: "Private Lessons - LP Company | الدروس الخاصة - شركة LP",
    description:
      "Find private lessons with qualified instructors on LP Company. اعثر على دروس خاصة مع مدربين مؤهلين على منصة شركة LP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Lessons - LP Company | الدروس الخاصة - شركة LP",
    description:
      "Find private lessons with qualified instructors on LP Company. اعثر على دروس خاصة مع مدربين مؤهلين على منصة شركة LP.",
  },
};

export default function PrivateLessonsPage() {
  return <PrivateLessonsPageClient />;
}
