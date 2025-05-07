"use client";

import Link from "next/link";
import { useState } from "react";
import { useCreateUserMutation } from "@/src/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      console.log("signup response", response?.data);
      
      if (response.success) {
        toast.success(
          "Your account has been created successfully! Please check your email to verify your account."
        );
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
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                value={form.firstName}
                onChange={handleChange}
              />
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
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <label className="text-sm text-black block mb-2">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Input your password"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <label className="text-sm text-black block mb-2">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Input your confirm password"
                  name="confirmPassword"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
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
              <Link href="/auth/forgot-password">
                <button
                  type="button"
                  className="hover:underline cursor-pointer hover:text-[#20B894] ease-in duration-300"
                >
                  Forgot Password
                </button>
              </Link>
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="text-gray-400 text-sm">Or</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          {/* Social Buttons */}
          {/* <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 border border-[#20B894] rounded-full py-2 text-sm flex items-center justify-center gap-2 hover:bg-[#20B894]/10 transition">
              <img src="/google.svg" alt="Google" className="h-5 w-5" />
              Register with Google
            </button>
            <button className="flex-1 border border-[#20B894] rounded-full py-2 text-sm flex items-center justify-center gap-2 hover:bg-[#20B894]/10 transition">
              <img src="/facebook.svg" alt="Facebook" className="h-5 w-5" />
              Register with Facebook
            </button>
          </div> */}

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
