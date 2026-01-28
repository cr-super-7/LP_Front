import type { Metadata } from "next";
import ResearchesPageClient from "../researches/ResearchesPageClient";
import RoleRedirect from "../components/auth/RoleRedirect";

export const metadata: Metadata = {
  title: "Researches - LP Company | الأبحاث - شركة LP",
  description:
    "Browse academic researches and resources on LP Company. تصفح الأبحاث الأكاديمية والموارد التعليمية على منصة شركة LP.",
  keywords: [
    "researches",
    "research",
    "academic",
    "resources",
    "LP Company",
    "أبحاث",
    "بحث علمي",
    "أبحاث أكاديمية",
    "موارد تعليمية",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/researches_student",
    languages: {
      "ar-SA": "/researches_student",
      "en-US": "/researches_student",
      "x-default": "/researches_student",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/researches_student",
    siteName: "LP Company",
    title: "Researches - LP Company | الأبحاث - شركة LP",
    description:
      "Browse academic researches and resources on LP Company. تصفح الأبحاث الأكاديمية والموارد التعليمية على منصة شركة LP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Researches - LP Company | الأبحاث - شركة LP",
    description:
      "Browse academic researches and resources on LP Company. تصفح الأبحاث الأكاديمية والموارد التعليمية على منصة شركة LP.",
  },
};

export default function ResearchesStudentPage() {
  return (
    <RoleRedirect>
      <ResearchesPageClient />
    </RoleRedirect>
  );
}

