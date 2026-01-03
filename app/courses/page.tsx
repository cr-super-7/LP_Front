import type { Metadata } from "next";
import Script from "next/script";
import CoursesContent from "../components/courses/CoursesContent";

export const metadata: Metadata = {
  title: {
    default: "Courses - LP Company | الدورات - شركة LP",
    template: "%s | LP Company",
  },
  description: "Browse and discover comprehensive courses and educational content on LP Company platform. تصفح واكتشف الدورات الشاملة والمحتوى التعليمي على منصة شركة LP. Online courses, programming, mathematics, science, languages, and more.",
  keywords: [
    // English keywords
    "courses",
    "online courses",
    "online learning",
    "e-learning",
    "education",
    "LP Company",
    "educational platform",
    "programming courses",
    "mathematics courses",
    "science courses",
    "language courses",
    "university courses",
    "academic courses",
    "certified courses",
    "professional development",
    // Arabic keywords
    "دورات",
    "دورات أونلاين",
    "تعليم أونلاين",
    "تعليم إلكتروني",
    "منصة تعليمية",
    "شركة LP",
    "دورات برمجة",
    "دورات رياضيات",
    "دورات علوم",
    "دورات لغات",
    "دورات جامعية",
    "دورات أكاديمية",
    "دورات معتمدة",
    "تطوير مهني",
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
    canonical: "/courses",
    languages: {
      "ar-SA": "/courses",
      "en-US": "/courses",
      "x-default": "/courses",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "/courses",
    siteName: "LP Company",
    title: "Courses - LP Company | الدورات - شركة LP",
    description: "Browse and discover comprehensive courses and educational content on LP Company platform. تصفح واكتشف الدورات الشاملة والمحتوى التعليمي على منصة شركة LP.",
    images: [
      {
        url: "/og-courses.jpg",
        width: 1200,
        height: 630,
        alt: "LP Company Courses - دورات شركة LP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses - LP Company | الدورات - شركة LP",
    description: "Browse and discover comprehensive courses and educational content on LP Company platform. تصفح واكتشف الدورات الشاملة والمحتوى التعليمي على منصة شركة LP.",
    images: ["/og-courses.jpg"],
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

export default function CoursesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Courses - LP Company | الدورات - شركة LP",
    "description": "Browse and discover comprehensive courses and educational content on LP Company platform. تصفح واكتشف الدورات الشاملة والمحتوى التعليمي على منصة شركة LP.",
    "provider": {
      "@type": "Organization",
      "name": "LP Company",
      "url": "https://lpcompany.com",
      "logo": "https://lpcompany.com/logo.png",
      "sameAs": [
        "https://www.facebook.com/lpcompany",
        "https://www.twitter.com/lpcompany",
        "https://www.linkedin.com/company/lpcompany"
      ]
    },
    "inLanguage": ["ar", "en"],
    "courseMode": "online",
    "educationalLevel": "Beginner, Intermediate, Advanced",
    "teaches": [
      "Programming",
      "Mathematics",
      "Science",
      "Languages",
      "Professional Development"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  };

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
      "addressCountry": "SA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Arabic", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/lpcompany",
      "https://www.twitter.com/lpcompany",
      "https://www.linkedin.com/company/lpcompany"
    ]
  };

  return (
    <>
      <Script
        id="course-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <CoursesContent />
    </>
  );
}

