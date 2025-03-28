import Image from 'next/image';
import React from 'react';

export default function Footer() {
  return (
    <>
    <footer className="bg-[#F9FAFB] md:block hidden py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
       <div className="">
        <div className="">
            
        </div>
       </div>
        <p className="text-[#070707] text-sm md:text-base font-normal">
          ©2025 Ollivu. All rights reserved.
        </p>

                <div className=" ">
                  <Image
                    src="/logo/Gray.png"
                    alt="Service Exchange Illustration"
                    width={100}
                    height={100}
                    className="w-full h-auto"
                    priority
                  />
                </div>

        {/* Right Section */}
        <div className="flex space-x-4 mt-4 md:mt-0">
        <span className="text-[#1D1F2C]">•</span>
          <a
            href="/privacy-policy"
            className="text-[#070707] text-sm md:text-base font-normal hover:underline"
          >
            Privacy Policy
          </a>
          <span className="text-[#1D1F2C]">•</span>
          <a
            href="/terms-of-service"
            className="text-[#1D1F2C] text-sm md:text-base font-normal hover:underline"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
    <footer  className="bg-[#F9FAFB] md:hidden sm:block py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4 sm:space-y-6">
        {/* Logo */}
        <div className="w-[100px] h-auto">
          <Image
            src="/logo/Gray.png"
            alt="Ollivu Logo"
            width={100}
            height={40}
            className="mx-auto"
            priority
          />
        </div>

        {/* Links */}
        <div className="flex items-center justify-center space-x-4 text-sm sm:text-base font-normal text-[#070707]">
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
          <span className="text-[#1D1F2C]">•</span>
          <a href="/terms-of-service" className="hover:underline">
            Terms of Service
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[#070707] text-sm sm:text-base font-normal">
          ©2025 Ollivu. All rights reserved.
        </p>
      </div>
    </footer>

    </>
  );
}
