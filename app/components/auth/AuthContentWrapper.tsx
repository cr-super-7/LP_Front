"use client";

import { Suspense } from "react";
import AuthContent from "./AuthContent";

export default function AuthContentWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-blue-950">
      <div className="text-white">Loading...</div>
    </div>}>
      <AuthContent />
    </Suspense>
  );
}

