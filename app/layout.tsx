import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ReduxProvider from "./providers/ReduxProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LP Company - Your All-in-One Learning Platform | شركة LP - منصتك التعليمية الشاملة",
    template: "%s | LP Company",
  },
  description:
    "LP Company is a comprehensive educational platform offering private lessons and specialized courses for all academic levels. شركة LP هي منصة تعليمية شاملة تقدم دروساً خاصة ودورات متخصصة لجميع المستويات الأكاديمية - الابتدائية والمتوسطة والثانوية والجامعية.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          id="init-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                  const language = localStorage.getItem('language') || 'en';
                  document.documentElement.setAttribute('lang', language);
                  document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
                } catch (e) {
                  document.documentElement.setAttribute('lang', 'en');
                  document.documentElement.setAttribute('dir', 'ltr');
                }
              })();
            `,
          }}
        />
        <ReduxProvider>
          <ThemeProvider>
            <LanguageProvider>
              {children}
              <Toaster 
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </LanguageProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
