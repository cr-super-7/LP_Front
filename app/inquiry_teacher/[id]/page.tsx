import type { Metadata } from "next";
import RoleRedirect from "../../components/auth/RoleRedirect";
import InquiryTeacherDetailsPageClient from "../../components/inquiryTeacher/InquiryTeacherDetailsPageClient";

export const metadata: Metadata = {
  title: "Inquiry Details (Teacher) - LP Company | تفاصيل الاستشارة (للمدرس) - شركة LP",
  description:
    "View consultation details as an instructor. عرض تفاصيل الاستشارة كمدرس.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function InquiryTeacherDetailsPage() {
  return (
    <RoleRedirect blockRole="student" redirectTo="/inquiry">
      <InquiryTeacherDetailsPageClient />
    </RoleRedirect>
  );
}

