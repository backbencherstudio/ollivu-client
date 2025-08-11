"use client";

import { useLoginUserMutation } from "@/src/redux/features/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import loginImg from "@/public/login.png";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useGetCurrentUserQuery } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const currentUser = verifiedUser();
  const { data: currentUserData, isLoading: isCurrentUserLoading } =
    useGetCurrentUserQuery(currentUser?.userId, {
      skip: !currentUser?.userId,
    });

  // Ensure we have the current user's data
  const currentUserInfo = currentUserData?.data;

  useEffect(() => {
    if (currentUserInfo && !isCurrentUserLoading) {
      validateProfileAndRedirect();
    }
  }, [currentUserInfo, isCurrentUserLoading]);

  const validateProfileAndRedirect = () => {
    // Check if the profile is complete
    const isPersonalInfoValid = isValid(currentUserInfo?.personalInfo);
    const isAddressInfoValid = isValid(currentUserInfo?.addressInfo);
    const isServicesValid = currentUserInfo?.my_service?.length > 0;
    const isPortfolioValid = currentUserInfo?.portfolio?.length > 0;
    const isCertificateValid = currentUserInfo?.cartificate?.length > 0;
    const isAboutMeValid = currentUserInfo?.about_me?.trim().length > 0;

    // Perform redirection based on profile completeness
    if (
      isPersonalInfoValid &&
      isAddressInfoValid &&
      isServicesValid &&
      isPortfolioValid &&
      isCertificateValid &&
      isAboutMeValid
    ) {
      router.push("/");
    } else {
      router.push("/dashboard/user-profile"); 
    }
  };

  // Define a reusable validation function
  const isValid = (data) => {
    if (!data) return false;
    return Object.values(data).every((value) => {
      if (Array.isArray(value)) {
        return value.length > 0; 
      }
      if (typeof value === "string") {
        return value.trim().length > 0; 
      }
      return value !== null && value !== undefined; 
    });
  };

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
        }

        // After successful login, check if the profile is complete and redirect
        if (!isCurrentUserLoading) {
          validateProfileAndRedirect(); // Re-check and perform the correct redirection
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

  if (isCurrentUserLoading || isLoading) {
    return <div>Loading...</div>;
  }

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

          <button
            type="button"
            className="mb-4 text-[#20B894] hover:underline flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ArrowLeft />
            Back to Home
          </button>

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
                {showPassword ? <Eye /> : <EyeOff />}
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
            You're new here?{" "}
            <a href="/auth/signup" className="text-[#20B894] hover:underline">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
