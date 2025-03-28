'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeTerms: false,
    confirmInfo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-[1224px] w-full flex flex-col md:flex-row overflow-hidden shadow-lg">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <img src="/signup.png" alt="Signup Illustration" className="w-full h-auto" />
        </div>

        {/* Right Signup Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Create account
          </h1>

          <form className="flex flex-col gap-4">
            {/* Name Fields */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-black block mb-2">First Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Input your first name"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black block mb-2">Last Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Input your last name"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-black block mb-2">Password<span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black block mb-2">Confirm Password<span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full px-4 py-2 rounded-[8px] border border-[#20B894] bg-transparent text-black focus:outline-none"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="accent-[#20B894]"
                  checked={form.rememberMe}
                  onChange={handleChange}
                />
                Remember Me
              </label>
              <button type="button" className="hover:underline">
                Forgot Password
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all"
            >
              Create Account ↗
            </button>
          </form>

          {/* Policy Checkboxes */}
          <div className="flex flex-col gap-2 mt-4 text-sm text-black">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                className="accent-[#20B894] mt-[2px]"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <span>
                I have read and agree to the Terms and Conditions and Privacy Policy.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="confirmInfo"
                className="accent-[#20B894] mt-[2px]"
                checked={form.confirmInfo}
                onChange={handleChange}
              />
              <span>
                I confirm that all information entered is accurate, complete, and not misleading.
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
          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 border border-[#20B894] rounded-full py-2 text-sm flex items-center justify-center gap-2 hover:bg-[#20B894]/10 transition">
              <img src="/google.svg" alt="Google" className="h-5 w-5" />
              Register with Google
            </button>
            <button className="flex-1 border border-[#20B894] rounded-full py-2 text-sm flex items-center justify-center gap-2 hover:bg-[#20B894]/10 transition">
              <img src="/facebook.svg" alt="Facebook" className="h-5 w-5" />
              Register with Facebook
            </button>
          </div>

          {/* Already have account */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-[#20B894] hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
