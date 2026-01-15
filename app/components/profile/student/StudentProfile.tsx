"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Pencil, Lock } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../layout/Sidebar";
import Navbar from "../../layout/Navbar";
import Background from "../../layout/Background";
import Footer from "../../layout/Footer";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateProfile, changePassword, getUserProfile } from "../../../store/api/authApi";
import { getMyEnrollments } from "../../../store/api/enrollmentApi";
import { getCart } from "../../../store/api/cartApi";
import { getMyProgress } from "../../../store/api/progressApi";
import type { UserProfile } from "../../../store/interface/auth.interface";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../../../store/interface/auth.interface";
import type { Enrollment } from "../../../store/interface/enrollmentInterface";
import type { Course } from "../../../store/interface/courseInterface";

type StudentProfileData = UserProfile & {
  totalCourses?: number;
  cartCount?: number;
  inProgressCount?: number;
  completedCount?: number;
};

type StudentProfileProps = {
  user?: StudentProfileData | null;
  onUpdate?: () => void;
};

export default function StudentProfile({ user: propUser, onUpdate }: StudentProfileProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const isRTL = language === "ar";

  const [user, setUser] = useState<StudentProfileData | null>(propUser || null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    bio: user?.bio || "",
    location: user?.location || "",
  });
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    oldPassword: "",
    newPassword: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load user data and statistics
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const authIds = authUser as { id?: string; _id?: string } | null;
        const userId = authIds?.id || authIds?._id;

        if (userId) {
          // Load user profile
          const userProfile = await getUserProfile(userId, dispatch);
          setUser(userProfile as StudentProfileData);

          // Load enrollments
          const myEnrollments = await getMyEnrollments(dispatch);
          setEnrollments(myEnrollments);
          const totalCourses = myEnrollments.length;
          const activeEnrollments = myEnrollments.filter((e) => e.status === "active");
          setInProgressCount(activeEnrollments.length);
          setCompletedCount(myEnrollments.filter((e) => e.status === "completed").length);

          // Load cart
          try {
            const cart = await getCart(dispatch);
            setCartCount(cart.items?.length || 0);
          } catch (error) {
            // Cart might be empty
            setCartCount(0);
          }

          // Load progress to calculate in-progress courses
          try {
            const progress = await getMyProgress(dispatch);
            const inProgress = progress.filter((p) => p.overallProgress > 0 && p.overallProgress < 100);
            setInProgressCount(inProgress.length);
          } catch (error) {
            // Progress might not be available
          }

          // Update user with statistics
          setUser((prev) => ({
            ...prev,
            ...userProfile,
            totalCourses,
            cartCount: cartCount,
            inProgressCount: inProgressCount,
            completedCount: completedCount,
          } as StudentProfileData));
        }
      } catch (error) {
        console.error("Failed to load student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [authUser, dispatch]);

  const textAlign = isRTL ? "text-right" : "text-left";
  const roleLabel = language === "ar" ? "الطالب" : "Student";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData: UpdateProfileRequest = {
        bio: formData.bio,
        location: formData.location,
      };

      if (selectedFile) {
        updateData.profilePicture = selectedFile;
      }

      await updateProfile(updateData, dispatch);
      setIsEditModalOpen(false);
      
      // Reload user data
      const authIds = authUser as { id?: string; _id?: string } | null;
      const userId = authIds?.id || authIds?._id;
      if (userId) {
        const updatedProfile = await getUserProfile(userId, dispatch);
        setUser(updatedProfile as StudentProfileData);
        setFormData({
          bio: updatedProfile.bio || "",
          location: updatedProfile.location || "",
        });
      }
      
      if (onUpdate) {
        onUpdate();
      }
      // Reset file selection
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    try {
      await changePassword(passwordData, dispatch);
      setIsChangePasswordModalOpen(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        theme === "dark" ? "bg-blue-950" : "bg-gray-50"
      }`}
    >
      <Background />

      <div className="relative z-10">
        <Sidebar />
        <Navbar />

        <main className={`${isRTL ? "mr-64" : "ml-64"} mt-16 p-6`}>
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Profile header */}
            <section
              className={`relative overflow-hidden rounded-3xl shadow-2xl px-6 py-10 sm:px-10 sm:py-12 ${
                theme === "dark"
                  ? "bg-linear-to-br from-blue-700 via-blue-800 to-indigo-900"
                  : "bg-linear-to-br from-blue-100 via-blue-200 to-indigo-100"
              }`}
            >
              {/* subtle waves */}
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div
                  className={`absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl ${
                    theme === "dark" ? "bg-blue-500" : "bg-blue-300"
                  }`}
                />
                <div
                  className={`absolute -right-16 top-10 h-64 w-64 rounded-full blur-3xl ${
                    theme === "dark" ? "bg-indigo-500" : "bg-indigo-300"
                  }`}
                />
              </div>

              <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                {/* Avatar */}
                <div
                  className={`relative h-32 w-32 shrink-0 rounded-full border-4 shadow-xl ${
                    theme === "dark"
                      ? "border-blue-300 bg-blue-900/50"
                      : "border-blue-400 bg-blue-50"
                  }`}
                >
                  <Image
                    src={
                      user?.profilePicture || "/home/privet_lessons.png"
                    }
                    alt="Student avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-md hover:bg-blue-400"
                  >
                    <Pencil className="h-3 w-3" />
                    {language === "ar" ? "تعديل" : "Edit"}
                  </button>
                </div>

                {/* Name + stats */}
                <div className="flex-1 space-y-4">
                  <div className={textAlign}>
                    <p
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === "dark" ? "text-blue-200" : "text-blue-700"
                      }`}
                    >
                      {roleLabel.toUpperCase()}
                    </p>
                    <h1
                      className={`text-2xl font-bold sm:text-3xl ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user?.email}
                    </h1>
                    
                    {/* User Details */}
                    <div className="mt-3 space-y-2">
                      {user?.phone && (
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            theme === "dark" ? "text-blue-100" : "text-gray-700"
                          }`}
                        >
                          <Phone
                            className={`h-4 w-4 ${
                              theme === "dark" ? "text-blue-300" : "text-blue-600"
                            }`}
                          />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user?.bio && (
                        <p
                          className={`text-sm line-clamp-2 ${
                            theme === "dark" ? "text-blue-100" : "text-gray-700"
                          }`}
                        >
                          <span
                            className={`font-medium ${
                              theme === "dark" ? "text-blue-300" : "text-blue-600"
                            }`}
                          >
                            {language === "ar" ? "نبذة: " : "Bio: "}
                          </span>
                          {user.bio}
                        </p>
                      )}
                      {user?.location && (
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-blue-100" : "text-gray-700"
                          }`}
                        >
                          <span
                            className={`font-medium ${
                              theme === "dark" ? "text-blue-300" : "text-blue-600"
                            }`}
                          >
                            {language === "ar" ? "الموقع: " : "Location: "}
                          </span>
                          {user.location}
                        </p>
                      )}
                      
                      {/* Change Password Button */}
                      <button
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="mt-3 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        <Lock className="h-4 w-4" />
                        {language === "ar" ? "تغيير كلمة المرور" : "Change Password"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className={`space-y-1 ${textAlign}`}>
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-blue-200" : "text-blue-700"
                        }`}
                      >
                        {language === "ar" ? "جميع الدورات" : "All Courses"}
                      </p>
                      <p
                        className={`text-3xl font-extrabold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {isLoading ? "..." : (user?.totalCourses ?? enrollments.length ?? 0)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <ProfileStat
                        color="orange"
                        label={language === "ar" ? "في السلة" : "Cart"}
                        value={String(isLoading ? "..." : (user?.cartCount ?? cartCount ?? 0))}
                      />
                      <ProfileStat
                        color="indigo"
                        label={language === "ar" ? "قيد التقدّم" : "In Progress"}
                        value={String(isLoading ? "..." : (user?.inProgressCount ?? inProgressCount ?? 0))}
                      />
                      <ProfileStat
                        color="green"
                        label={language === "ar" ? "مكتملة" : "Completed"}
                        value={String(isLoading ? "..." : (user?.completedCount ?? completedCount ?? 0))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top course */}
            {enrollments.length > 0 && (
              <section className="space-y-6">
                <h2 className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}>
                  {language === "ar" ? "أفضل دوراتي" : "My Top Course"}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {enrollments.slice(0, 2).map((enrollment, index) => {
                    const course = typeof enrollment.course === "object" 
                      ? enrollment.course 
                      : null;
                    if (!course) return null;
                    return (
                      <CourseCard 
                        key={enrollment._id} 
                        highlight={index === 0}
                        course={course as Course}
                        enrollment={enrollment}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* All courses */}
            <section className="space-y-6">
              <h2 className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-blue-950"
              }`}>
                {language === "ar" ? "دوراتي" : "My Courses"}
              </h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : enrollments.length === 0 ? (
                <div className={`text-center py-12 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}>
                  {language === "ar" 
                    ? "لا توجد دورات مسجلة حالياً" 
                    : "No enrolled courses yet"}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrollments.map((enrollment) => {
                    const course = typeof enrollment.course === "object" 
                      ? enrollment.course 
                      : null;
                    if (!course) return null;
                    return (
                      <CourseCard 
                        key={enrollment._id}
                        course={course as Course}
                        enrollment={enrollment}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>

        <div className={`${isRTL ? "mr-64" : "ml-64"}`}>
          <Footer />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${
              theme === "dark" ? "bg-blue-950" : "bg-white"
            } p-6 sm:p-8`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} p-2 rounded-full ${
                theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={theme === "dark" ? "text-white" : "text-gray-700"}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Header */}
            <h2
              className={`text-2xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {language === "ar" ? "تعديل البروفايل" : "Edit Profile"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar" ? "صورة البروفايل" : "Profile Picture"}
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-blue-500">
                    <Image
                      src={previewUrl || user?.profilePicture || "/home/privet_lessons.png"}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`block w-full text-sm ${
                      theme === "dark"
                        ? "text-blue-200 file:bg-blue-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:cursor-pointer"
                        : "text-gray-700 file:bg-blue-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:cursor-pointer"
                    }`}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar" ? "نبذة" : "Bio"}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className={`w-full rounded-lg border px-4 py-2 ${
                    theme === "dark"
                      ? "bg-blue-900 border-blue-700 text-white placeholder-blue-300"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل نبذتك الشخصية..." : "Enter your bio..."}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar" ? "الموقع" : "Location"}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full rounded-lg border px-4 py-2 ${
                    theme === "dark"
                      ? "bg-blue-900 border-blue-700 text-white placeholder-blue-300"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل موقعك..." : "Enter your location..."}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting
                    ? language === "ar"
                      ? "جاري الحفظ..."
                      : "Saving..."
                    : language === "ar"
                    ? "حفظ"
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsChangePasswordModalOpen(false)}
          />

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
              theme === "dark" ? "bg-blue-950" : "bg-white"
            } p-6 sm:p-8`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsChangePasswordModalOpen(false)}
              className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} p-2 rounded-full ${
                theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={theme === "dark" ? "text-white" : "text-gray-700"}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Lock className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {language === "ar" ? "تغيير كلمة المرور" : "Change Password"}
                </h2>
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
                {language === "ar"
                  ? "أدخل كلمة المرور الحالية والجديدة"
                  : "Enter your current password and new password"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar" ? "كلمة المرور الحالية" : "Current Password"}
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  required
                  className={`w-full rounded-lg border px-4 py-2 ${
                    theme === "dark"
                      ? "bg-blue-900 border-blue-700 text-white placeholder-blue-300"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل كلمة المرور الحالية..." : "Enter current password..."}
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-blue-200" : "text-gray-700"
                  }`}
                >
                  {language === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className={`w-full rounded-lg border px-4 py-2 ${
                    theme === "dark"
                      ? "bg-blue-900 border-blue-700 text-white placeholder-blue-300"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === "ar" ? "أدخل كلمة المرور الجديدة..." : "Enter new password..."}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    setPasswordData({ oldPassword: "", newPassword: "" });
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isChangingPassword
                    ? language === "ar"
                      ? "جاري التغيير..."
                      : "Changing..."
                    : language === "ar"
                    ? "تغيير"
                    : "Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type ProfileStatProps = {
  label: string;
  value: string;
  color: "orange" | "indigo" | "green";
};

function ProfileStat({ label, value, color }: ProfileStatProps) {
  const colorClasses: Record<ProfileStatProps["color"], string> = {
    orange:
      "from-orange-500/90 to-orange-600/90 border-orange-300/60 shadow-orange-500/40",
    indigo:
      "from-indigo-500/90 to-indigo-600/90 border-indigo-300/60 shadow-indigo-500/40",
    green:
      "from-emerald-500/90 to-emerald-600/90 border-emerald-300/60 shadow-emerald-500/40",
  };

  return (
    <div
      className={`inline-flex min-w-[140px] items-center justify-center gap-2 rounded-full border bg-linear-to-r px-5 py-2 text-sm font-semibold text-white shadow-lg ${colorClasses[color]}`}
    >
      <span>{value}</span>
      <span>{label}</span>
    </div>
  );
}

type CourseCardProps = {
  highlight?: boolean;
  course?: Course;
  enrollment?: Enrollment;
};

function CourseCard({ highlight, course, enrollment }: CourseCardProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  if (!course) {
    return null;
  }

  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const courseDescription = language === "ar" ? course.description.ar : course.description.en;
  const levelLabel = 
    course.level === "beginner" 
      ? (language === "ar" ? "مبتدئ" : "Beginner")
      : course.level === "intermediate"
      ? (language === "ar" ? "متوسط" : "Intermediate")
      : (language === "ar" ? "متقدم" : "Advanced");

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl ${
        theme === "dark" 
          ? "bg-blue-900/50 text-white shadow-xl ring-1 ring-blue-700/60" 
          : "bg-white text-gray-900 shadow-lg ring-1 ring-gray-200"
      } ${
        highlight ? "scale-[1.01] border-2 border-blue-400/60" : ""
      }`}
    >
      <div className="relative h-40 w-full">
        <Image
          src={course.thumbnail || "/images/courses/course-placeholder.jpg"}
          alt={courseTitle}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold line-clamp-1">{courseTitle}</h3>
          <p className={`text-xs ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}>
            {course.totalLessons || 0} {language === "ar" ? "درس" : "Lessons"} • {course.durationHours}h
          </p>
        </div>

        <p className={`line-clamp-2 text-sm ${
          theme === "dark" ? "text-blue-200" : "text-gray-600"
        }`}>
          {courseDescription}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              theme === "dark" ? "bg-blue-800" : "bg-blue-100"
            }`}>
              {levelLabel}
            </span>
          </div>
          <span className={`font-bold ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}>
            {course.price} {course.currency}
          </span>
        </div>

        {enrollment && (
          <div className={`text-xs ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}>
            {language === "ar" ? "الحالة: " : "Status: "}
            {enrollment.status === "active" 
              ? (language === "ar" ? "نشط" : "Active")
              : enrollment.status === "completed"
              ? (language === "ar" ? "مكتمل" : "Completed")
              : (language === "ar" ? "ملغي" : "Cancelled")}
          </div>
        )}

        <button className="mt-3 w-full rounded-full bg-blue-600 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors">
          {language === "ar" ? "عرض" : "View"}
        </button>
      </div>
    </article>
  );
}


