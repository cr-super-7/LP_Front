import type { Metadata, Viewport } from "next";
import Header from "./components/layout/Header";
import Hero from "./components/home/Hero";
import EducationalPlatform from "./components/home/EducationalPlatform";
import Properties from "./components/home/Properties";
import Blogs from "./components/home/Blogs";

export const metadata: Metadata = {
  title: "LB Company - Your All-in-One Learning Platform",
  description:
    "LB Company is a comprehensive educational platform offering private lessons and specialized courses for all academic levels - primary, middle school, high school, and university.",
  keywords: [
    "LB Company",
    "educational platform",
    "private lessons",
    "online courses",
    "academic tutoring",
    "primary school",
    "middle school",
    "high school",
    "university courses",
    "online learning",
  ],
  authors: [{ name: "LB Company" }],
  openGraph: {
    title: "LB Company - Your All-in-One Learning Platform",
    description:
      "LB Company is a comprehensive educational platform offering private lessons and specialized courses for all academic levels.",
    type: "website",
    locale: "ar_SA",
    siteName: "LB Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "LB Company - Your All-in-One Learning Platform",
    description:
      "LB Company is a comprehensive educational platform offering private lessons and specialized courses for all academic levels.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-900 via-blue-800 to-blue-900">
      <Header />
      <Hero />
      <EducationalPlatform />
      <Properties />
      <Blogs />
    </div>
  );
}
