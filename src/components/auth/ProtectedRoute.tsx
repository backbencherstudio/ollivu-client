"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifiedUser, isAdmin } from "@/src/utils/token-varify";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const router = useRouter();
  const user = verifiedUser();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [router, allowedRoles]);

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;