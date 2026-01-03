import type { Metadata } from "next";
import AuthContentWrapper from "../components/auth/AuthContentWrapper";

export const metadata: Metadata = {
  title: "Login - LP Company | تسجيل الدخول - شركة LP",
  description: "Login to your LP Company account to access courses, private lessons, and educational content. سجل الدخول إلى حسابك في شركة LP للوصول إلى الدورات والدروس الخاصة والمحتوى التعليمي.",
  keywords: [
    "login",
    "sign in",
    "LP Company",
    "account",
    "educational platform",
    "تسجيل الدخول",
    "حساب",
    "منصة تعليمية",
    "شركة LP",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <AuthContentWrapper />;
}

