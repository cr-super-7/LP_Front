import type { Metadata } from "next";
import InquiryPageClient from "../components/inquiry/InquiryPageClient";

export const metadata: Metadata = {
  title: "Inquiry - LP Company | استشارات - شركة LP",
  description:
    "Explore professors and request consultations on LP Company. استعرض الأساتذة واطلب الاستشارات عبر شركة LP.",
  keywords: [
    "inquiry",
    "consultation",
    "professors",
    "LP Company",
    "استشارات",
    "أساتذة",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/inquiry",
    languages: {
      "ar-SA": "/inquiry",
      "en-US": "/inquiry",
      "x-default": "/inquiry",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/inquiry",
    siteName: "LP Company",
    title: "Inquiry - LP Company | استشارات - شركة LP",
    description:
      "Explore professors and request consultations on LP Company. استعرض الأساتذة واطلب الاستشارات عبر شركة LP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inquiry - LP Company | استشارات - شركة LP",
    description:
      "Explore professors and request consultations on LP Company. استعرض الأساتذة واطلب الاستشارات عبر شركة LP.",
  },
};

export default function InquiryPage() {
  return <InquiryPageClient />;
}
