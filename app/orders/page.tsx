import type { Metadata } from "next";
import OrdersPageClient from "./OrdersPageClient";

export const metadata: Metadata = {
  title: "Orders - LP Company | الطلبات - شركة LP",
  description:
    "Track and manage your orders on LP Company. تتبع وأدر طلباتك على منصة شركة LP.",
  keywords: [
    "orders",
    "order history",
    "LP Company",
    "الطلبات",
    "سجل الطلبات",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/orders",
    languages: {
      "ar-SA": "/orders",
      "en-US": "/orders",
      "x-default": "/orders",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersPage() {
  return <OrdersPageClient />;
}
