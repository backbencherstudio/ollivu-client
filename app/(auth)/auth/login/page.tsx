"use client";

import { useLoginUserMutation } from "@/src/redux/features/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import loginImg from "@/public/login.png";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: "", password: "" });

    let hasError = false;
    const newErrors = { email: "", password: "" };
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await loginUser({
        email,
        password,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Login successful!");

        // Check for stored selections
        const storedUsers = localStorage.getItem("selectedUsers");
        const storedService = localStorage.getItem("selectedService");
        const redirectUserId = localStorage.getItem("redirectUserId");
        const redirectPath = localStorage.getItem("redirectPath");

        if (storedUsers && storedService) {
          // Check if redirect path exists (for service-list)
          if (redirectPath) {
            localStorage.removeItem("redirectPath");
            router.push(redirectPath);
          } else {
            router.push("/#service-categories");
          }
        } else if (redirectUserId) {
          localStorage.removeItem("redirectUserId");
          router.push(`/service-result/${redirectUserId}`);
        } else {
          router.push("/");
        }
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.data?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-[1224px] w-full flex flex-col md:flex-row ounded-lg overflow-hidden shadow-lg">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <Image
            src={loginImg}
            alt="Login Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2  p-8">
          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Login to your account
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-sm text-black block mb-2">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Input your email"
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-sm text-black block mb-2">
                Password<span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Input your password"
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none pr-10"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              <button
                type="button"
                className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.563 0 3.06-.362 4.396-1.01m2.624-2.09A10.45 10.45 0 0 0 21.75 12c-.417-.723-.948-1.414-1.574-2.057m-2.624-2.09A9.956 9.956 0 0 0 12 6c-1.563 0-3.06.362-4.396 1.01m0 0A10.45 10.45 0 0 0 3.98 8.223m0 0L2.25 6.75m1.73 1.473 16.77 16.77"
                    />
                  </svg>
                ) : (
                  // Eye SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12C3.285 7.943 7.522 5 12 5c4.478 0 8.715 2.943 9.75 7-.417.723-.948 1.414-1.574 2.057A9.956 9.956 0 0 1 12 18c-1.563 0-3.06-.362-4.396-1.01A10.45 10.45 0 0 1 2.25 12zm9.75 2.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-end items-center text-sm text-gray-500">
              <Link href="/auth/forgot-password">
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                >
                  Forgot Password
                </button>
              </Link>
            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all cursor-pointer"
            >
              {isLoading ? "Logging in..." : "Log in ↗"}
            </button>
          </form>
          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            You're new in here?{" "}
            <a href="/auth/signup" className="text-[#20B894] hover:underline">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
