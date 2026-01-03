"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function LoginContent() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Add login logic here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      theme === "dark" 
        ? "bg-linear-to-br from-blue-950 via-blue-900 to-blue-950" 
        : "bg-linear-to-br from-gray-50 via-white to-gray-50"
    }`}>
      <main className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full rounded-2xl p-8 shadow-2xl backdrop-blur-xl ${
            theme === "dark" 
              ? "bg-blue-900/80 border border-blue-700/50" 
              : "bg-white/80 border border-gray-200/50"
          }`}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2">
              <span className="text-blue-400">LP</span>
              <span className={theme === "dark" ? "text-white" : "text-blue-950"}> Company</span>
            </div>
            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>
              {t("login.title")}
            </h1>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {t("login.subtitle")}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("login.email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === "dark"
                    ? "bg-blue-900/50 border-blue-800 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                placeholder={t("login.emailPlaceholder")}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("login.password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    theme === "dark"
                      ? "bg-blue-900/50 border-blue-800 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  placeholder={t("login.passwordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className={`mr-2 rounded ${
                    theme === "dark" ? "accent-blue-500" : "accent-blue-600"
                  }`}
                />
                <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {t("login.rememberMe")}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className={`text-sm font-medium hover:underline ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? t("login.loading") : t("login.submit")}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center ${theme === "dark" ? "border-blue-800" : "border-gray-300"}`}>
                <div className={`w-full border-t ${theme === "dark" ? "border-blue-800" : "border-gray-300"}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === "dark" ? "bg-blue-900/50 text-gray-400" : "bg-white text-gray-500"}`}>
                  {t("login.or")}
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {t("login.noAccount")}{" "}
                <Link
                  href="/register"
                  className={`font-semibold hover:underline ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {t("login.signUp")}
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

