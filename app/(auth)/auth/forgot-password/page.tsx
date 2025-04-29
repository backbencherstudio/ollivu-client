"use client";

import { useState } from "react";
import Link from "next/link";
import CustomImage from "@/components/reusable/CustomImage";
import forgotPassImage from "@/public/login.png";
import { MoveUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/src/redux/features/auth/authApi";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("email reset", email);

    resetPassword({ email })
      .unwrap()
      .then((response) => {
        if (response.success) {
          toast.success("Reset password link has been sent to your email");
          router.push(`/auth/email-check?email=${encodeURIComponent(email)}`);
        }
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Something went wrong");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <CustomImage
            src={forgotPassImage.src}
            alt="Forgot Password Illustration"
            className="w-full h-auto"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back
            </Link>
          </div>

          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Forgot password?
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-sm text-black block mb-2">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Input your email"
                className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Send email
              <MoveUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
