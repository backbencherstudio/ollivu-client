'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Bell, MessageCircle } from 'lucide-react';
import profile from "@/public/avatars/emily.png";
import { AiFillMessage, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { MdNotifications } from "react-icons/md";

export default function Header() {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShow(!show);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white shadow-sm py-4 px-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[#070707]">Overview</h2>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative">
            <MessageCircle className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          <button className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          <div ref={dropdownRef} className="relative">
            <div onClick={handleProfileClick} className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full relative overflow-hidden">
                <Image src={profile} alt="User" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#070707]">Katie Sims</p>
                <p className="text-xs text-gray-500">User</p>
              </div>
            </div>

            {/* Profile dropdown */}
            {show && (
              <div className="absolute top-12 right-0 bg-white shadow-md rounded-md p-4 w-48">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <AiFillMessage className="w-6 h-6 p-1 bg-[#EDFCF6] text-[#20B894] rounded-full" />
                    <p className="text-base font-normal text-[#070707]">Message</p>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <MdNotifications className="w-6 h-6 p-1 bg-[#EDFCF6] text-[#20B894] rounded-full" />
                    <p className="text-base font-normal text-[#070707]">Notification</p>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <AiOutlineUser className="w-6 h-6 p-1 bg-[#EDFCF6] text-[#20B894] rounded-full" />
                    <p className="text-base font-normal text-[#070707]">My Account</p>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <AiOutlineLogout className="w-6 h-6 p-1 bg-[#EDFCF6] text-[#20B894] rounded-full" />
                    <p className="text-base font-normal text-[#070707]">Log out</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
