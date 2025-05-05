"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function LoginSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [formData, setFormData] = useState({
    email: "katie_sims@gmail.com",
    phone: "+45983280932",
    password: "••••••••••",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded-md text-gray-600"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-gray-700"
                onClick={() => handleCopy(formData.email, "Email")}
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
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded-md text-gray-600"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-gray-700"
                onClick={() => handleCopy(formData.phone, "Phone number")}
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

          {/* Password & Security Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Password & Security</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ensure your account stays secure by updating your password
              regularly.
            </p>

            {/* Change Password */}
            <div className="mb-6">
              <label className="text-sm font-medium">Change password</label>
              <div className="relative mt-2">
                <input
                  type="password"
                  value="••••••••••"
                  className="w-full p-2 pr-10 border rounded-md"
                  readOnly
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2">
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

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium">
                  Two-Factor Authentication (2FA)
                </h4>
                <p className="text-sm text-gray-500">
                  Enable 2FA for extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                className="data-[state=checked]:bg-[#20B894]"
              />
            </div>
          </div>

          {/* Active Sessions */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium">Current Device</p>
                <p className="text-sm text-gray-500">Windows PC</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign Out of All Devices</p>
                <p className="text-sm text-gray-500">
                  Log out from all devices except this one.
                </p>
              </div>
              <button className="px-4 py-2 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]">
                Sign Out
              </button>
            </div>
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
