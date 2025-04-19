"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import { useState } from "react";

export default function UserManagement() {
  const { data: users, isLoading, error } = useGetAllUsersQuery({});
  console.log("users: ", users);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
        <h1>Users: </h1>
      </div>
    </ProtectedRoute>
  );
}
