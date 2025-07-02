"use client";

import Link from "next/link";
import { useState } from "react";
import { useCreateUserMutation } from "@/src/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
    confirmInfo: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add error state
  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Update handleSubmit function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Validate fields
    let hasError = false;
    const newErrors = {
      firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
      hasError = true;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      hasError = true;
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (!form.agreeTerms) {
      toast.error("Please accept the Terms and Conditions");
      return;
    }

    if (!form.confirmInfo) {
      toast.error("Please confirm that your information is accurate");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await createUser({
        first_name: form.firstName,
        email: form.email,
        password: form.password,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        router.push(`/auth/verify-otp?email=${encodeURIComponent(form.email)}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-[1224px] w-full flex flex-col md:flex-row overflow-hidden shadow-lg">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <img
            src="/signup.png"
            alt="Signup Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Signup Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Create account
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label className="text-sm text-black block mb-2">
                First Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Input your first name"
                className={`w-full px-4 py-2 rounded-[8px] border ${
                  errors.firstName ? "border-red-500" : "border-[#20B894]"
                } bg-transparent text-black focus:outline-none`}
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="text-sm text-black block mb-2">
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Input your email"
                className={`w-full px-4 py-2 rounded-[8px] border ${
                  errors.email ? "border-red-500" : "border-[#20B894]"
                } bg-transparent text-black focus:outline-none`}
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-sm text-black block mb-2">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Input your password"
                  className={`w-full px-4 py-2 rounded-[8px] border ${
                    errors.password ? "border-red-500" : "border-[#20B894]"
                  } bg-transparent text-black focus:outline-none pr-10`}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-off SVG
                    // <svg
                    //   xmlns="http://www.w3.org/2000/svg"
                    //   fill="none"
                    //   viewBox="0 0 24 24"
                    //   strokeWidth={1.5}
                    //   stroke="currentColor"
                    //   className="w-5 h-5"
                    // >
                    //   <path
                    //     strokeLinecap="round"
                    //     strokeLinejoin="round"
                    //     d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.563 0 3.06-.362 4.396-1.01m2.624-2.09A10.45 10.45 0 0 0 21.75 12c-.417-.723-.948-1.414-1.574-2.057m-2.624-2.09A9.956 9.956 0 0 0 12 6c-1.563 0-3.06.362-4.396 1.01m0 0A10.45 10.45 0 0 0 3.98 8.223m0 0L2.25 6.75m1.73 1.473 16.77 16.77"
                    //   />
                    // </svg>
                    <Eye />
                  ) : (
                    // Eye SVG
                    // <svg
                    //   xmlns="http://www.w3.org/2000/svg"
                    //   fill="none"
                    //   viewBox="0 0 24 24"
                    //   strokeWidth={1.5}
                    //   stroke="currentColor"
                    //   className="w-5 h-5"
                    // >
                    //   <path
                    //     strokeLinecap="round"
                    //     strokeLinejoin="round"
                    //     d="M2.25 12C3.285 7.943 7.522 5 12 5c4.478 0 8.715 2.943 9.75 7-.417.723-.948 1.414-1.574 2.057A9.956 9.956 0 0 1 12 18c-1.563 0-3.06-.362-4.396-1.01A10.45 10.45 0 0 1 2.25 12zm9.75 2.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z"
                    //   />
                    // </svg>
                    <EyeOff />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div className="relative">
                <label className="text-sm text-black block mb-2">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Input your confirm password"
                  className={`w-full px-4 py-2 rounded-[8px] border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#20B894]"
                  } bg-transparent text-black focus:outline-none pr-10`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    // Eye-off SVG
                    // <svg
                    //   xmlns="http://www.w3.org/2000/svg"
                    //   fill="none"
                    //   viewBox="0 0 24 24"
                    //   strokeWidth={1.5}
                    //   stroke="currentColor"
                    //   className="w-5 h-5"
                    // >
                    //   <path
                    //     strokeLinecap="round"
                    //     strokeLinejoin="round"
                    //     d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.017 6 9.75 6 1.563 0 3.06-.362 4.396-1.01m2.624-2.09A10.45 10.45 0 0 0 21.75 12c-.417-.723-.948-1.414-1.574-2.057m-2.624-2.09A9.956 9.956 0 0 0 12 6c-1.563 0-3.06.362-4.396 1.01m0 0A10.45 10.45 0 0 0 3.98 8.223m0 0L2.25 6.75m1.73 1.473 16.77 16.77"
                    //   />
                    // </svg>
                    <Eye />
                  ) : (
                    // Eye SVG
                    // <svg
                    //   xmlns="http://www.w3.org/2000/svg"
                    //   fill="none"
                    //   viewBox="0 0 24 24"
                    //   strokeWidth={1.5}
                    //   stroke="currentColor"
                    //   className="w-5 h-5"
                    // >
                    //   <path
                    //     strokeLinecap="round"
                    //     strokeLinejoin="round"
                    //     d="M2.25 12C3.285 7.943 7.522 5 12 5c4.478 0 8.715 2.943 9.75 7-.417.723-.948 1.414-1.574 2.057A9.956 9.956 0 0 1 12 18c-1.563 0-3.06-.362-4.396-1.01A10.45 10.45 0 0 1 2.25 12zm9.75 2.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z"
                    //   />
                    // </svg>
                    <EyeOff />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="accent-[#20B894] cursor-pointer"
                  checked={form.rememberMe}
                  onChange={handleChange}
                />
                Remember Me
              </label>
              {/* <Link href="/auth/forgot-password">
                <button
                  type="button"
                  className="hover:underline cursor-pointer hover:text-[#20B894] ease-in duration-300"
                >
                  Forgot Password
                </button>
              </Link> */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full primary_color text-white py-2 rounded-full font-medium transition-all cursor-pointer ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account ↗"}
            </button>
          </form>

          {/* Policy Checkboxes */}
          <div className="flex flex-col gap-2 mt-4 text-sm text-black">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                className="accent-[#20B894] mt-[2px] cursor-pointer"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <span>
                I have read and agree to the Terms and Conditions and Privacy
                Policy.
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="confirmInfo"
                className="accent-[#20B894] mt-[2px] cursor-pointer"
                checked={form.confirmInfo}
                onChange={handleChange}
              />
              <span>
                I confirm that all information entered is accurate, complete,
                and not misleading.
              </span>
            </label>
          </div>

          {/* Already have account */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/auth/login" className="text-[#20B894] hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
