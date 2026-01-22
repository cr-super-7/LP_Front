import type { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search - LP Company | بحث - شركة LP",
  description:
    "Search across courses, private lessons, and researches on LP Company. ابحث عبر الدورات والدروس الخصوصية والأبحاث في شركة LP.",
  keywords: [
    "search",
    "courses",
    "private lessons",
    "researches",
    "LP Company",
    "بحث",
    "دورات",
    "دروس خصوصية",
    "أبحاث",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/search",
    languages: {
      "ar-SA": "/search",
      "en-US": "/search",
      "x-default": "/search",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/search",
    siteName: "LP Company",
    title: "Search - LP Company | بحث - شركة LP",
    description:
      "Search across courses, private lessons, and researches on LP Company. ابحث عبر الدورات والدروس الخصوصية والأبحاث في شركة LP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search - LP Company | بحث - شركة LP",
    description:
      "Search across courses, private lessons, and researches on LP Company. ابحث عبر الدورات والدروس الخصوصية والأبحاث في شركة LP.",
  },
};

export default function SearchPage() {
  return <SearchPageClient />;
}
