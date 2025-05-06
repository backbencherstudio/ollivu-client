"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, MessageCircle } from "lucide-react";
import profile from "@/public/avatars/emily.png";
import {
  AiFillMessage,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineHome,
} from "react-icons/ai";
import { MdNotifications } from "react-icons/md";
import Link from "next/link";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";

export default function Header({ user }) {
  const router = useRouter();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  // console.log("singleUserData", singleUserData);

  const notifications = [
    {
      id: 1,
      name: "Jerry ",
      type: "message",
      text: "I'd love to swap my Graphic Design for your Marketing help! Let's chat specifics. When are you free to have a...",
      image: profile,
    },
    {
      id: 2,
      name: "Jhon ",
      type: "alert",
      text: "Account Suspension Notice: 2 weeks suspension.",
      image: null,
    },
    {
      id: 3,
      name: "Jane ",
      type: "message",
      text: "John Doe liked your post.",
      image: profile,
    },
    {
      id: 4,
      name: "Alex",
      type: "alert",
      text: "Server maintenance scheduled for tomorrow.",
      image: null,
    },
    {
      id: 5,
      name: "Alice",
      type: "message",
      text: "Alice commented on your post.",
      image: profile,
    },
    {
      id: 6,
      name: "Bob",
      type: "message",
      text: "Your password was changed successfully.",
      image: null,
    },
  ];

  // Toggle dropdowns
  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  // Close dropdowns when clicking outside
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (profileRef.current && !profileRef.current.contains(event.target)) {
  //       setShowProfile(false);
  //     }
  //     if (
  //       notificationRef.current &&
  //       !notificationRef.current.contains(event.target)
  //     ) {
  //       setShowNotifications(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  return (
    <div className="bg-white shadow-sm py-[21px] px-6 sticky top-0 z-50">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-6">
          {/* Message Icon */}
          {
            singleUserData?.role === "user" && (
          <Link href="/dashboard/messages">
            <button className="relative cursor-pointer">
              <MessageCircle className="w-6 h-6 text-gray-600" />
            {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#20B894] text-white text-xs rounded-full flex items-center justify-center">
              {2}
            </span> */}
            </button>
          </Link>
          )}

          {/* Notification Bell */}
          {/* <div ref={notificationRef} className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative cursor-pointer"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#20B894] text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 bg-gray-50 shadow-lg rounded-md p-4 w-[500px]">
                <h3 className="text-lg font-medium mb-2">Your Notifications</h3>
                <div className="flex flex-col gap-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center gap-3 border-b pb-2"
                    >
                      {notification.image ? (
                        <Image
                          src={notification.image}
                          alt="User"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-medium">
                          {notification.text
                            .split(" ")[0]
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col ">
                        <p className="text-base font-medium text-[#23262F]">
                          {notification.name}
                        </p>
                        <p className="text-sm font-normal text-[#4A4C56]">
                          {notification.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full  text-[#20B894] hover:text-[#1a9678] text-sm font-medium cursor-pointer"
                    onClick={() => {
                      router.push("/dashboard/notifications");
                      setShowNotifications(false);
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <div
              onClick={handleProfileClick}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full relative overflow-hidden">
                {singleUserData?.profileImage ? (
                  <div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${singleUserData?.profileImage}`}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                    {singleUserData?.first_name
                      ? singleUserData.first_name.slice(0, 2).toUpperCase()
                      : "UN"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#070707]">
                  {singleUserData?.first_name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>

            {showProfile && (
              <div className="absolute top-12 right-0 bg-white shadow-md rounded-md p-4">
                <div className="flex flex-col gap-4">
                  {/* User Info Section */}
                  <div className="border-b pb-3">
                    <p className="text-base font-medium text-[#070707]">
                      {singleUserData?.first_name} {singleUserData?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {singleUserData?.email}
                    </p>
                  </div>

                  {/* Back to Home Button */}
                  <div className="flex items-center gap-3 cursor-pointer">
                    <AiOutlineHome className="w-6 h-6 p-1 bg-[#EDFCF6] text-[#20B894] rounded-full" />
                    <Link
                      href="/"
                      className="text-base font-normal text-[#070707]"
                    >
                      Back to Home
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <AiOutlineUser className="w-6 h-6 p-1 bg-[#EDFCF6] text-[#20B894] rounded-full" />
                    <p className="text-base font-normal text-[#070707]">
                      {validUser?.email}
                    </p>
                  </div>
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <AiOutlineLogout className="w-6 h-6 p-1 bg-[#EDFCF6] text-[#20B894] rounded-full" />
                    <p className="text-base font-normal text-[#070707]">
                      Log out
                    </p>
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
