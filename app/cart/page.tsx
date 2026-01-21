import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Cart - LP Company | السلة - شركة LP",
  description:
    "Review selected courses and private lessons before checkout. راجع الدورات والدروس المحددة قبل إتمام الدفع.",
  keywords: [
    "cart",
    "checkout",
    "courses",
    "private lessons",
    "LP Company",
    "السلة",
    "الدفع",
    "دورات",
    "دروس خاصة",
    "شركة LP",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/cart",
    languages: {
      "ar-SA": "/cart",
      "en-US": "/cart",
      "x-default": "/cart",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
