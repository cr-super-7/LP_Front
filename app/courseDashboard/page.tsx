import type { Metadata } from "next";
import CourseDashboardPageClient from "./CourseDashboardPageClient";

export const metadata: Metadata = {
  title: "Course Dashboard - LP Company | لوحة الدورة - شركة LP",
  description:
    "Manage course details and progress on LP Company. إدارة تفاصيل الدورة وتقدمها على منصة شركة LP.",
  keywords: [
    "course dashboard",
    "course management",
    "LP Company",
    "لوحة الدورة",
    "إدارة الدورات",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/courseDashboard",
    languages: {
      "ar-SA": "/courseDashboard",
      "en-US": "/courseDashboard",
      "x-default": "/courseDashboard",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CourseDashboardPage() {
  return <CourseDashboardPageClient />;
}

