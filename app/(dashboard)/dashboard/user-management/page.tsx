"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

export default function UserManagement() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div>UserManagement</div>
    </ProtectedRoute>
  );
}
