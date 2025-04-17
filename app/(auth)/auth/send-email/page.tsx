'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomImage from '@/components/reusable/CustomImage';
import verifyEmailImage from "@/public/login.png";
import { MoveUpRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function SendEmail() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const searchParams = useSearchParams();
  console.log("Search Params:", searchParams);
  
  const email = searchParams.get('email') || '';
  console.log("Email:", email);
  

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[name="code-${index + 1}"]`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Verification code:', verificationCode.join(''));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="container w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 p-6">
          <CustomImage src={verifyEmailImage.src} alt="Email Verification Illustration" className="w-full h-auto" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back
            </Link>
          </div>

          <h1 className="text-[32px] font-medium leading-[126%] tracking-[-0.96px] heading_color mb-6">
            Check your email
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            We sent a verification link to {email}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex justify-center gap-4">
              {verificationCode.map((code, index) => (
                <input
                  key={index}
                  type="text"
                  name={`code-${index}`}
                  maxLength={1}
                  className="w-12 h-12 text-center border border-[#20B894] rounded-lg text-xl focus:outline-none focus:border-[#20B894] focus:ring-1 focus:ring-[#20B894]"
                  value={code}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full primary_color hover:opacity-90 text-white py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2"
            >
              Verify email
              <MoveUpRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-500">
            Didn't receive the email? <button className="text-[#20B894] hover:underline">Click to resend</button>
          </p>
        </div>
      </div>
    </div>
  );
}
