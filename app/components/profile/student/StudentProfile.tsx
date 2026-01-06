"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Pencil, Lock } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import Sidebar from "../../layout/Sidebar";
import Navbar from "../../layout/Navbar";
import Background from "../../layout/Background";
import Footer from "../../layout/Footer";
import { useAppDispatch } from "../../../store/hooks";
import { updateProfile, changePassword } from "../../../store/api/authApi";
import type { UserProfile } from "../../../store/interface/auth.interface";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../../../store/interface/auth.interface";

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

export default function StudentProfile({ user, onUpdate }: StudentProfileProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const dispatch = useAppDispatch();
  const isRTL = language === "ar";

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
                        {user?.totalCourses ?? 5}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <ProfileStat
                        color="orange"
                        label={language === "ar" ? "في السلة" : "Cart"}
                        value={String(user?.cartCount ?? 3)}
                      />
                      <ProfileStat
                        color="indigo"
                        label={language === "ar" ? "قيد التقدّم" : "In Progress"}
                        value={String(user?.inProgressCount ?? 3)}
                      />
                      <ProfileStat
                        color="green"
                        label={language === "ar" ? "مكتملة" : "Completed"}
                        value={String(user?.completedCount ?? 6)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top course */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-white">
                {language === "ar" ? "أفضل دوراتي" : "My Top Course"}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <CourseCard highlight />
                <CourseCard />
              </div>
            </section>

            {/* All courses */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-white">
                {language === "ar" ? "دوراتي" : "My Courses"}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
              </div>
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
};

function CourseCard({ highlight }: CourseCardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl bg-slate-900/80 text-white shadow-xl ring-1 ring-slate-700/60 ${
        highlight ? "scale-[1.01] border border-blue-400/60" : ""
      }`}
    >
      <div className="relative h-40 w-full">
        <Image
          src="/images/courses/course-placeholder.jpg"
          alt="Course image"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Introduction To UI</h3>
          <p className="text-xs text-slate-300">
            15 Lessons • 500 Std • 15 h
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-slate-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold">
              Advanced
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <span className="text-base">★</span> 4.3
            </span>
          </div>
          <span className="font-bold text-blue-300">1400 $</span>
        </div>

        <button className="mt-3 w-full rounded-full bg-blue-600 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500">
          View
        </button>
      </div>
    </article>
  );
}


