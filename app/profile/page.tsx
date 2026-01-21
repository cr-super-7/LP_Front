import type { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "Profile - LP Company | الملف الشخصي - شركة LP",
  description:
    "Manage your profile details and settings on LP Company. إدارة بياناتك وإعداداتك على منصة شركة LP.",
  keywords: [
    "profile",
    "account",
    "LP Company",
    "الملف الشخصي",
    "الحساب",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/profile",
    languages: {
      "ar-SA": "/profile",
      "en-US": "/profile",
      "x-default": "/profile",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
