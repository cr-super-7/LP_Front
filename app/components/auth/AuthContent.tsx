"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError } from "../../store/slice/authSlice";
import { register, login } from "../../store/api/authApi";

import type { RootState } from "../../store/store";

export default function AuthContent() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  
  // Get role from URL query parameter, default to "student"
  const selectedRole = useMemo<"student" | "instructor">(() => {
    const roleFromUrl = searchParams.get("role");
    return (roleFromUrl === "instructor" ? "instructor" : "student") as "student" | "instructor";
  }, [searchParams]);
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign Up state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Get image based on selected role
  const getImageSrc = () => {
    return selectedRole === "student" ? "/home/course.png" : "/home/privet_lessons.png";
  };

  // Clear error when switching forms
  useEffect(() => {
    dispatch(clearError());
  }, [isLogin, dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      await login(email, password, dispatch);
      
      // Redirect to home
      router.push("/courses");
    } catch (error: unknown) {
      // Error is already handled by the login function
      console.error("Login error:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      return;
    }

    dispatch(clearError());
    
    try {
      await register({
        email: signUpEmail,
        phone: phoneNumber,
        password: signUpPassword,
        role: selectedRole,
      }, dispatch);
      
      // Redirect to login page after successful registration
      setIsLogin(true);
      // Clear sign up form
      setSignUpEmail("");
      setPhoneNumber("");
      setSignUpPassword("");
      setAgreeToTerms(false);
    } catch (error: unknown) {
      // Error is already handled by the register function
      console.error("Registration error:", error);
    }
  };

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-blue-950">
      {/* Background with abstract lines */}
      <div className="absolute inset-0 bg-blue-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,200 Q300,150 600,200 T1200,200" stroke="#60A5FA" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M0,400 Q300,350 600,400 T1200,400" stroke="#60A5FA" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M0,600 Q300,550 600,600 T1200,600" stroke="#60A5FA" strokeWidth="2" fill="none" opacity="0.3"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Curved overlay on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-400/10 rounded-r-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-white"}`}>
                {isLogin ? t("auth.logIn") : t("auth.signUp")}
              </h2>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                <span className="text-white">Welcome to </span>
                <span className="text-blue-400">LP</span>
                <span className="text-white"> Academy</span>
              </h1>
            </motion.div>

            {/* Forms Container */}
            <div className="relative min-h-[500px]">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >
                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-white/90`}>
                        {t("auth.email")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                          placeholder={t("auth.emailPlaceholder")}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-white/90`}>
                        {t("auth.password")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                          placeholder={t("auth.passwordPlaceholder")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                      >
                        {t("auth.forgotPassword")}
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? t("auth.loading") : t("auth.logIn")}
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6">
                      <p className="text-white/80 text-sm">
                        {t("auth.noAccount")}{" "}
                        <button
                          type="button"
                          onClick={switchForm}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          {t("auth.signUp")}
                        </button>
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSignUp}
                    className="space-y-5"
                  >
                    {/* Phone Number */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-white/90`}>
                        {t("auth.phoneNumber")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📱</span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                          placeholder={t("auth.phonePlaceholder")}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-white/90`}>
                        {t("auth.email")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                          placeholder={t("auth.emailPlaceholder")}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-white/90`}>
                        {t("auth.password")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                        <input
                          type={showSignUpPassword ? "text" : "password"}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          required
                          className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                          placeholder={t("auth.passwordPlaceholder")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                        >
                          {showSignUpPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    {/* Role Display (read-only, set from URL) */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-white/90`}>
                        {t("auth.selectRole")}
                      </label>
                      <div className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white backdrop-blur-sm">
                        {selectedRole === "student" ? t("auth.student") : t("auth.instructor")}
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Terms & Conditions */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        required
                        className="mt-1 mr-2 rounded accent-blue-500"
                      />
                      <label htmlFor="terms" className="text-sm text-white/80">
                        {t("auth.agreeTerms")}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || !agreeToTerms}
                      className={`w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                        isLoading || !agreeToTerms ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? t("auth.loading") : t("auth.signUp")}
                    </button>

                    {/* Log In Link */}
                    <div className="text-center mt-6">
                      <p className="text-white/80 text-sm">
                        {t("auth.haveAccount")}{" "}
                        <button
                          type="button"
                          onClick={switchForm}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          {t("auth.logIn")}
                        </button>
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedRole}-${isLogin ? "login" : "signup"}`}
              initial={{ opacity: 0, x: isLogin ? 100 : -100, scale: 1.1, rotateY: isLogin ? 15 : -15 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, x: isLogin ? -100 : 100, scale: 0.9, rotateY: isLogin ? -15 : 15 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={getImageSrc()}
                alt={selectedRole === "instructor" ? "Instructor" : "Student"}
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 bg-blue-950/20"
              ></motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Decorative elements that move */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-decor" : "signup-decor"}
              initial={{ opacity: 0, y: 50, x: isLogin ? 50 : -50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -50, x: isLogin ? -50 : 50 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="absolute bottom-10 left-10 right-10"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <p className="text-white text-sm font-medium">
                  {isLogin ? t("auth.loginMessage") : t("auth.signUpMessage")}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

