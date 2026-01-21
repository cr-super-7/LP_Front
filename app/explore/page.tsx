import type { Metadata } from "next";
import ExplorePageClient from "./ExplorePageClient";

export const metadata: Metadata = {
  title: "Explore - LP Company | استكشف - شركة LP",
  description:
    "Explore universities, colleges, departments, categories, and courses on LP Company. استكشف الجامعات والكليات والأقسام والفئات والدورات على منصة شركة LP.",
  keywords: [
    "explore",
    "universities",
    "colleges",
    "departments",
    "categories",
    "courses",
    "LP Company",
    "استكشف",
    "جامعات",
    "كليات",
    "أقسام",
    "فئات",
    "دورات",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/explore",
    languages: {
      "ar-SA": "/explore",
      "en-US": "/explore",
      "x-default": "/explore",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/explore",
    siteName: "LP Company",
    title: "Explore - LP Company | استكشف - شركة LP",
    description:
      "Explore universities, colleges, departments, categories, and courses on LP Company. استكشف الجامعات والكليات والأقسام والفئات والدورات على منصة شركة LP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore - LP Company | استكشف - شركة LP",
    description:
      "Explore universities, colleges, departments, categories, and courses on LP Company. استكشف الجامعات والكليات والأقسام والفئات والدورات على منصة شركة LP.",
  },
};

export default function ExplorePage() {
  return <ExplorePageClient />;
}
