import type { Metadata } from "next";
import InquiryDetailsPageClient from "../../components/inquiry/InquiryDetailsPageClient";
import RoleRedirect from "../../components/auth/RoleRedirect";

export const metadata: Metadata = {
  title: "Inquiry Details - LP Company | تفاصيل الاستشارة - شركة LP",
  description:
    "View professor details and choose a consultation method. عرض تفاصيل الأستاذ واختيار طريقة الاستشارة.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function InquiryDetailsPage() {
  return (
    <RoleRedirect>
      <InquiryDetailsPageClient />
    </RoleRedirect>
  );
}
