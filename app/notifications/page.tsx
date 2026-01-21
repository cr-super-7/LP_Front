import type { Metadata } from "next";
import NotificationsPageClient from "./NotificationsPageClient";

export const metadata: Metadata = {
  title: "Notifications - LP Company | الإشعارات - شركة LP",
  description:
    "View your latest notifications on LP Company. اعرض أحدث الإشعارات على منصة شركة LP.",
  keywords: [
    "notifications",
    "alerts",
    "LP Company",
    "الإشعارات",
    "تنبيهات",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/notifications",
    languages: {
      "ar-SA": "/notifications",
      "en-US": "/notifications",
      "x-default": "/notifications",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}
