"use client";

import { useEffect, useState } from "react";
import TeacherProfile from "../components/profile/teacher/TeacherProfile";
import StudentProfile from "../components/profile/student/StudentProfile";
import NoUserProfile from "../components/profile/NoUserProfile";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUserProfile } from "../store/api/authApi";
import type { UserProfile } from "../store/interface/auth.interface";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const authIds = authUser as { id?: string; _id?: string } | null;
        const userId = authIds?.id || authIds?._id;

        if (!userId) {
          setError(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        const userProfile = await getUserProfile(userId, dispatch);
        setProfile(userProfile);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authUser, dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return <NoUserProfile />;
  }

  const isTeacher = profile.role === "instructor";

  return isTeacher ? (
    <TeacherProfile
      user={{
        id: profile._id,
        fullName: authUser?.email || profile.email,
        role: profile.role,
        avatarUrl: profile.profilePicture,
      }}
    />
  ) : (
    <StudentProfile
      user={{
        id: profile._id,
        fullName: authUser?.email || profile.email,
        role: profile.role,
        avatarUrl: profile.profilePicture,
      }}
    />
  );
}
