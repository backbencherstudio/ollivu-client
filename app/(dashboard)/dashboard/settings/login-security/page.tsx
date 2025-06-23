"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";
import { useChangePasswordMutation } from "@/src/redux/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";

export default function LoginSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState();

  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  console.log("settings single user", singleUserData?._id);

  const [changePassword] = useChangePasswordMutation();

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${field} copied successfully!`, {
        duration: 2000,
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to copy text", {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  const handleSavePassword = async () => {
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);

    try {
      const response = await changePassword({
        id: singleUserData?._id,
        data: {
          oldPass: oldPassword,
          newPass: newPassword,
        },
      }).unwrap();
      console.log("chagnePass", response);
      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message);
    }
    //   const response = await changePassword({
    //     id: singleUserData?._id,
    //     data: {
    //       oldPass: oldPassword,
    //       newPass: newPassword,
    //     },
    //   });
    //   console.log("chagnePass", response);
  };

  return (
    <div className="">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Login Credentials</h2>
        <p className="text-sm text-gray-500 mb-6">
          Keep your account safe with a secure password and by signing out of
          devices you're not actively using.
        </p>

        <div className="space-y-6">
          {/* Email Address */}
          <div>
            <label className="text-sm font-medium">Email address</label>
            <div className="relative mt-2">
              <input
                type="email"
                name="email"
                value={singleUserData?.email}
                disabled
                className="w-full p-2 pr-10 border rounded-md text-gray-600"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-gray-700"
                onClick={() => handleCopy(singleUserData.email, "Email")}
              >
                <svg
                  className="w-5 h-5 text-gray-400 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-medium">Phone number</label>
            <div className="relative mt-2">
              <input
                type="tel"
                name="phone"
                value={singleUserData?.personalInfo?.phone_number}
                disabled
                // onChange={handleChange}
                className="w-full p-2 pr-10 border rounded-md text-gray-600"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-gray-700"
                onClick={() =>
                  handleCopy(
                    singleUserData?.personalInfo?.phone_number,
                    "Phone number"
                  )
                }
              >
                <svg
                  className="w-5 h-5 text-gray-400 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Password & Security */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Password & Security</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ensure your account stays secure by updating your password
              regularly.
            </p>

            {/* Old Password */}
            <div className="mb-6">
              <label className="text-sm font-medium">Old password</label>
              <div className="relative mt-2">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 pr-10 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-6">
              <label className="text-sm font-medium">New password</label>
              <div className="relative mt-2">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 pr-10 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Save Password Button */}
            <button
              onClick={handleSavePassword}
              className="px-4 py-2 bg-[#20B894] text-white rounded-md hover:bg-[#1a9678]"
            >
              Save Password
            </button>
          </div>

          {/* Delete Account */}
          <div className="pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-sm text-gray-500">
                  Permanently delete your Hotels.com account and data.
                </p>
              </div>
              <button className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
