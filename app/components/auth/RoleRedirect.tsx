 "use client";
 
 import { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
 import { useAppSelector } from "../../store/hooks";
 import type { RootState } from "../../store/store";
 
 type Role = "student" | "instructor";
 
 type RoleRedirectProps = {
   children: React.ReactNode;
   blockRole?: Role;
   redirectTo?: string;
 };
 
 export default function RoleRedirect({
   children,
   blockRole = "instructor",
   redirectTo = "/courseDashboard",
 }: RoleRedirectProps) {
   const router = useRouter();
   const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
   const [mounted, setMounted] = useState(false);
 
   useEffect(() => {
     const timer = setTimeout(() => setMounted(true), 0);
     return () => clearTimeout(timer);
   }, []);
 
   useEffect(() => {
     if (!mounted) return;
     if (isAuthenticated && user?.role === blockRole) {
       router.replace(redirectTo);
     }
   }, [mounted, isAuthenticated, user?.role, blockRole, redirectTo, router]);
 
   return <>{children}</>;
 }
