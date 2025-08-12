"use client";

import { useLoginUserMutation } from "@/src/redux/features/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import loginImg from "@/public/login.png";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useGetCurrentUserQuery, usersApi } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { store } from "@/src/redux/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isRedirecting, setIsRedirecting] = useState(false);

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
    // Only redirect if user is already logged in (not after fresh login)
    if (
      currentUserInfo &&
      !isCurrentUserLoading &&
      !isLoading &&
      !isRedirecting
    ) {
      console.log(
        "User already logged in, checking profile and redirecting..."
      );
      setIsRedirecting(true);
      validateProfileAndRedirect();
    }
  }, [currentUserInfo, isCurrentUserLoading, isLoading, isRedirecting]);

  // Enhanced validation function for nested objects
  const isObjectValid = (obj) => {
    if (!obj || typeof obj !== "object") return false;

    // Check if all values in the object are non-empty
    return Object.values(obj).every((value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "number") return true; // Numbers are valid if they exist
      if (Array.isArray(value)) return value.length > 0;
      return true;
    });
  };

  // Enhanced validation function for arrays
  const isArrayValid = (arr) => {
    if (!Array.isArray(arr)) return false;
    return arr.length > 0;
  };

  // Enhanced validation function for strings
  const isStringValid = (str) => {
    if (typeof str !== "string") return false;
    return str.trim().length > 0;
  };

  const validateProfileAndRedirect = () => {
    if (!currentUserInfo) {
      console.log("No current user info available");
      setIsRedirecting(false);
      return;
    }

    console.log("Validating profile..."); // Debug log

    // Detailed validation with logging
    const isPersonalInfoValid = isObjectValid(currentUserInfo?.personalInfo);
    console.log(
      "Personal info valid:",
      isPersonalInfoValid,
      currentUserInfo?.personalInfo
    );

    const isAddressInfoValid = isObjectValid(currentUserInfo?.addressInfo);
    console.log(
      "Address info valid:",
      isAddressInfoValid,
      currentUserInfo?.addressInfo
    );

    const isServicesValid = isArrayValid(currentUserInfo?.my_service);
    console.log(
      "Services valid:",
      isServicesValid,
      currentUserInfo?.my_service
    );

    // Handle both string and array for portfolio
    const isPortfolioValid = currentUserInfo?.portfolio
      ? Array.isArray(currentUserInfo.portfolio)
        ? currentUserInfo.portfolio.length > 0
        : typeof currentUserInfo.portfolio === "string" &&
          currentUserInfo.portfolio.trim().length > 0
      : false;
    console.log(
      "Portfolio valid:",
      isPortfolioValid,
      currentUserInfo?.portfolio
    );

    // Handle both string and array for certificate
    const isCertificateValid = currentUserInfo?.cartificate
      ? Array.isArray(currentUserInfo.cartificate)
        ? currentUserInfo.cartificate.length > 0
        : typeof currentUserInfo.cartificate === "string" &&
          currentUserInfo.cartificate.trim().length > 0
      : false;
    console.log(
      "Certificate valid:",
      isCertificateValid,
      currentUserInfo?.cartificate
    );

    const isAboutMeValid = isStringValid(currentUserInfo?.about_me);
    console.log("About me valid:", isAboutMeValid, currentUserInfo?.about_me);

    // Check overall profile completeness
    const isProfileComplete =
      isPersonalInfoValid &&
      isAddressInfoValid &&
      isServicesValid &&
      isPortfolioValid &&
      isCertificateValid &&
      isAboutMeValid;

    console.log("Profile complete:", isProfileComplete);

    // Perform redirection based on profile completeness
    if (isProfileComplete) {
      console.log("Redirecting to home page");
      router.push("/");
    } else {
      console.log("Redirecting to profile completion page");
      router.push("/dashboard/user-profile");
    }
  };

  const handlePostLoginRedirect = async (userInfo) => {
    console.log("Handling post-login redirect...");
    setIsRedirecting(true);

    // Check for stored selections first (higher priority)
    const storedUsers = localStorage.getItem("selectedUsers");
    const storedService = localStorage.getItem("selectedService");
    const redirectUserId = localStorage.getItem("redirectUserId");
    const redirectPath = localStorage.getItem("redirectPath");

    if (storedUsers && storedService) {
      if (redirectPath) {
        localStorage.removeItem("redirectPath");
        console.log("Redirecting to stored path:", redirectPath);
        router.push(redirectPath);
        return;
      } else {
        console.log("Redirecting to service categories");
        router.push("/#service-categories");
        return;
      }
    } else if (redirectUserId) {
      localStorage.removeItem("redirectUserId");
      console.log("Redirecting to service result:", redirectUserId);
      router.push(`/service-result/${redirectUserId}`);
      return;
    }

    // If no stored selections, validate profile and redirect accordingly
    if (userInfo) {
      // Detailed validation
      const isPersonalInfoValid = isObjectValid(userInfo?.personalInfo);
      const isAddressInfoValid = isObjectValid(userInfo?.addressInfo);
      const isServicesValid = isArrayValid(userInfo?.my_service);

      const isPortfolioValid = userInfo?.portfolio
        ? Array.isArray(userInfo.portfolio)
          ? userInfo.portfolio.length > 0
          : typeof userInfo.portfolio === "string" &&
            userInfo.portfolio.trim().length > 0
        : false;

      const isCertificateValid = userInfo?.cartificate
        ? Array.isArray(userInfo.cartificate)
          ? userInfo.cartificate.length > 0
          : typeof userInfo.cartificate === "string" &&
            userInfo.cartificate.trim().length > 0
        : false;

      const isAboutMeValid = isStringValid(userInfo?.about_me);

      const isProfileComplete =
        isPersonalInfoValid &&
        isAddressInfoValid &&
        isServicesValid &&
        isPortfolioValid &&
        isCertificateValid &&
        isAboutMeValid;

      console.log("Profile complete after login:", isProfileComplete);

      if (isProfileComplete) {
        console.log("Redirecting to home page");
        router.push("/");
      } else {
        console.log("Redirecting to profile completion page");
        router.push("/dashboard/user-profile");
      }
    }
  };

  const handleLogin = async (e) => {
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

        // After successful login, we need to get the fresh user data
        // and then redirect. We'll wait a bit for the token to be set and data to be fetched
        setTimeout(async () => {
          try {
            // Get fresh user data after login
            const freshCurrentUser = verifiedUser();
            if (freshCurrentUser?.userId) {
              // Imperatively fetch fresh user data via RTK Query
              const result = await store.dispatch(
                usersApi.endpoints.getCurrentUser.initiate(
                  freshCurrentUser.userId,
                  { forceRefetch: true }
                )
              );
              const freshUserData: any = (result as any).data;
              if (freshUserData?.data) {
                await handlePostLoginRedirect(freshUserData.data);
                return;
              }
            }
            // Fallback: redirect to home if user data not available
            router.push("/");
          } catch (error) {
            console.error("Error fetching fresh user data:", error);
            router.push("/");
          }
        }, 100); // Small delay to ensure token is set
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error?.data?.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  // Show loading if:
  // 1. Login is in progress
  // 2. User data is loading for already logged-in user
  // 3. We're in the process of redirecting
  if (isLoading || (currentUser && isCurrentUserLoading) || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">
          {isLoading
            ? "Logging in..."
            : isRedirecting
            ? "Redirecting..."
            : "Loading..."}
        </div>
      </div>
    );
  }

  // Don't show login form if user is already logged in and we have their data
  if (currentUser && currentUserInfo && !isRedirecting) {
    // This shouldn't normally happen as useEffect should handle redirect
    // But just in case, trigger redirect here too
    setTimeout(() => {
      if (!isRedirecting) {
        setIsRedirecting(true);
        validateProfileAndRedirect();
      }
    }, 0);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-[1224px] w-full flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <Image
            src={loginImg}
            alt="Login Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-8">
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
                disabled={isLoading || isRedirecting}
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
                disabled={isLoading || isRedirecting}
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
                disabled={isLoading || isRedirecting}
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
                  disabled={isLoading || isRedirecting}
                >
                  Forgot Password
                </button>
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all cursor-pointer disabled:opacity-50"
              disabled={isLoading || isRedirecting}
            >
              {isLoading
                ? "Logging in..."
                : isRedirecting
                ? "Redirecting..."
                : "Log in ↗"}
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
