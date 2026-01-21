import type { Metadata } from "next";
import ResearchesPageClient from "./ResearchesPageClient";

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
    canonical: "/researches",
    languages: {
      "ar-SA": "/researches",
      "en-US": "/researches",
      "x-default": "/researches",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/researches",
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

export default function ResearchesPage() {
  return <ResearchesPageClient />;
}
