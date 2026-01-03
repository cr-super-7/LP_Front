import type { Metadata, Viewport } from "next";
import Script from "next/script";
import HomeContent from "./components/home/HomeContent";

export const metadata: Metadata = {
  title: "LP Company - Your All-in-One Learning Platform | شركة LP - منصتك التعليمية الشاملة",
  description:
    "LP Company is a comprehensive educational platform offering private lessons and specialized courses for all academic levels - primary, middle school, high school, and university. شركة LP هي منصة تعليمية شاملة تقدم دروساً خاصة ودورات متخصصة لجميع المستويات الأكاديمية - الابتدائية والمتوسطة والثانوية والجامعية.",
  keywords: [
    // English keywords
    "LP Company",
    "educational platform",
    "learning platform",
    "online education",
    "e-learning",
    "private lessons",
    "online courses",
    "academic tutoring",
    "primary school",
    "middle school",
    "high school",
    "university courses",
    "online learning",
    "distance learning",
    "educational services",
    "tutoring services",
    "Saudi Arabia education",
    "KSA online learning",
    // Arabic keywords
    "شركة LP",
    "منصة تعليمية",
    "منصة تعلم",
    "تعليم أونلاين",
    "تعليم إلكتروني",
    "دروس خاصة",
    "دورات أونلاين",
    "دروس خصوصية",
    "مرحلة ابتدائية",
    "مرحلة متوسطة",
    "مرحلة ثانوية",
    "دورات جامعية",
    "تعلم أونلاين",
    "تعليم عن بعد",
    "خدمات تعليمية",
    "خدمات دروس خصوصية",
    "تعليم السعودية",
    "تعليم أونلاين السعودية",
  ],
  authors: [{ name: "LP Company", url: "https://lpcompany.com" }],
  creator: "LP Company",
  publisher: "LP Company",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
    languages: {
      "ar-SA": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "LP Company",
    title: "LP Company - Your All-in-One Learning Platform | شركة LP - منصتك التعليمية الشاملة",
    description:
      "LP Company is a comprehensive educational platform offering private lessons and specialized courses for all academic levels. شركة LP هي منصة تعليمية شاملة تقدم دروساً خاصة ودورات متخصصة لجميع المستويات الأكاديمية.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LP Company - Educational Platform | شركة LP - منصة تعليمية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LP Company - Your All-in-One Learning Platform | شركة LP - منصتك التعليمية الشاملة",
    description:
      "LP Company is a comprehensive educational platform offering private lessons and specialized courses for all academic levels. شركة LP هي منصة تعليمية شاملة تقدم دروساً خاصة ودورات متخصصة لجميع المستويات الأكاديمية.",
    images: ["/og-image.jpg"],
    creator: "@LPCompany",
    site: "@LPCompany",
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
  category: "education",
  classification: "Educational Platform",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function Home() {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "LP Company",
    "alternateName": "شركة LP",
    "url": "https://lpcompany.com",
    "logo": "https://lpcompany.com/logo.png",
    "description": "Comprehensive educational platform offering private lessons and specialized courses for all academic levels. منصة تعليمية شاملة تقدم دروساً خاصة ودورات متخصصة لجميع المستويات الأكاديمية.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressRegion": "Riyadh"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Arabic", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/lpcompany",
      "https://www.twitter.com/lpcompany",
      "https://www.linkedin.com/company/lpcompany",
      "https://www.instagram.com/lpcompany"
    ],
    "offers": {
      "@type": "Offer",
      "category": "Educational Services",
      "description": "Private lessons and specialized courses for all academic levels"
    }
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LP Company",
    "alternateName": "شركة LP",
    "url": "https://lpcompany.com",
    "description": "Comprehensive educational platform offering private lessons and specialized courses. منصة تعليمية شاملة تقدم دروساً خاصة ودورات متخصصة.",
    "inLanguage": ["ar", "en"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://lpcompany.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <HomeContent />
    </>
  );
}
