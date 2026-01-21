import type { Metadata } from "next";
import ReportPageClient from "./ReportPageClient";

export const metadata: Metadata = {
  title: "Reports - LP Company | التقارير - شركة LP",
  description:
    "Access reports and insights on LP Company. الوصول إلى التقارير والرؤى على منصة شركة LP.",
  keywords: [
    "reports",
    "analytics",
    "LP Company",
    "تقارير",
    "تحليلات",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/report",
    languages: {
      "ar-SA": "/report",
      "en-US": "/report",
      "x-default": "/report",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReportPage() {
  return <ReportPageClient />;
}
