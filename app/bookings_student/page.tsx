import type { Metadata } from "next";
import RoleRedirect from "../components/auth/RoleRedirect";
import BookingsStudentPageClient from "./BookingsStudentPageClient";

export const metadata: Metadata = {
  title: "My Bookings - LP Company | حجوزاتي - شركة LP",
  description:
    "View and manage your bookings on LP Company. عرض وإدارة حجوزاتك على منصة شركة LP.",
  keywords: [
    "bookings",
    "private lessons",
    "LP Company",
    "حجوزات",
    "الدروس الخصوصية",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/bookings_student",
    languages: {
      "ar-SA": "/bookings_student",
      "en-US": "/bookings_student",
      "x-default": "/bookings_student",
    },
  },
  robots: { index: false, follow: false },
};

export default function BookingsStudentPage() {
  return (
    <RoleRedirect>
      <BookingsStudentPageClient />
    </RoleRedirect>
  );
}

