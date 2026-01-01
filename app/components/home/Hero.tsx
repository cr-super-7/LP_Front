"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Hero() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <section className="relative flex min-h-[700px] items-center justify-between px-8 py-20 overflow-x-hidden">

      {/* Left side - Text content */}
      <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
        <p className={`text-2xl font-medium ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t("hero.welcome")}</p>
        <h1 className="text-7xl font-bold leading-tight">
          <span className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"} drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] [text-shadow:2px_2px_4px_rgba(255,255,255,0.3)]`}>
            LB
          </span>{" "}
          <span className={theme === "dark" ? "text-white" : "text-blue-950"}>{t("hero.academy")}</span>
        </h1>
        <p className={`text-xl font-light ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>
          {t("hero.tagline")}
        </p>
      </div>

      {/* Right side - Three student images with yellow ring */}
      <div className="relative z-10 flex items-center overflow-hidden">
        {/* Three student images in rounded rectangular frames */}
        <div className="relative flex items-end gap-4">
          {/* Student 1 - Left (Male with books, green plaid shirt) */}
          <div className="relative w-44 h-64 rounded-2xl overflow-hidden shadow-2xl bg-blue-500">
            <div className="absolute inset-0 bg-linear-to-b from-blue-400 to-blue-600 flex items-center justify-center">
              <div className="w-32 h-40 bg-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-4xl">👨‍🎓</div>
              </div>
            </div>
          </div>

          {/* Student 2 - Center (Female with yellow books, red hoodie) - Largest */}
          <div className="relative w-56 h-80 rounded-2xl overflow-hidden shadow-2xl bg-yellow-400">
            <div className="absolute inset-0 bg-linear-to-b from-yellow-300 to-yellow-500 flex items-center justify-center">
              <div className="w-40 h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-5xl">👩‍🎓</div>
              </div>
            </div>
          </div>

          {/* Student 3 - Right (Male with tablet, orange sweater) */}
          <div className="relative w-48 h-68 rounded-2xl overflow-hidden shadow-2xl bg-teal-400">
            <div className="absolute inset-0 bg-linear-to-b from-teal-300 to-teal-500 flex items-center justify-center">
              <div className="w-34 h-40 bg-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-4xl">👨‍💻</div>
              </div>
            </div>
          </div>
        </div>

        {/* Yellow ring that curves around the images from top right */}
        <div className="absolute -right-16 -top-12 w-[500px] h-[500px] pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full"
            fill="none"
          >
            <path
              d="M 450 50 Q 400 100, 350 150 Q 300 200, 250 250 Q 200 300, 150 350 Q 100 400, 50 450"
              stroke="#FCD34D"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

