import type { Metadata } from "next";
import RoleRedirect from "../components/auth/RoleRedirect";
import InquiryTeacherPageClient from "../components/inquiryTeacher/InquiryTeacherPageClient";

export const metadata: Metadata = {
  title: "Inquiry (Teacher) - LP Company | الاستشارات (للمدرس) - شركة LP",
  description:
    "Manage consultations as an instructor on LP Company. إدارة الاستشارات كمدرس على شركة LP.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/inquiry_teacher",
    languages: {
      "ar-SA": "/inquiry_teacher",
      "en-US": "/inquiry_teacher",
      "x-default": "/inquiry_teacher",
    },
  },
};

export default function InquiryTeacherPage() {
  return (
    <RoleRedirect blockRole="student" redirectTo="/inquiry">
      <InquiryTeacherPageClient />
    </RoleRedirect>
  );
}

