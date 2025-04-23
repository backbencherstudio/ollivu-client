/** @jsxImportSource react */
'use client';

import React, { useEffect, useState } from "react";
import { Connection } from "../_types";
import Image from "next/image";
import { verifiedUser } from "@/src/utils/token-varify";
import { authApi } from "@/src/redux/features/auth/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAvatar } from "../../../_components/user-avater";

interface LeftSidebarProps {
  selectedUser: string | null;
  setSelectedUser: (userData: any) => void;
}

export default function LeftSidebar({
  selectedUser,
  setSelectedUser,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<"connections" | "requests">(
    "connections"
  );
  const currentUser = verifiedUser();
  const [query, setQuery] = useState<{ userId?: string; isAccepted?: string }>(
    {}
  );
  // console.log("selectedUser", selectedUser);

  // only trigger API when query updates
  const [finalQuery, setFinalQuery] = useState({
    userId: currentUser?.userId,
    isAccepted: true,
  });

  const { data } = authApi.useGetAllExchangeDataQuery(finalQuery);
  console.log("data", data?.data);

  const requestDataHandler = (tabType: "connections" | "requests") => {
    setActiveTab(tabType);

    const updatedQuery = {
      userId: currentUser?.userId,
      isAccepted: tabType === "connections" ? "true" : "false",
    };

    setQuery(updatedQuery);
  };

  useEffect(() => {
    if (query.userId) {
      setFinalQuery(query);
    }
  }, [query]);

  // console.log("process.env.NEXT_PUBLIC_IMAGE_URL", process.env.NEXT_PUBLIC_IMAGE_URL);

  return (
    <div className="border-r border-gray-200 flex flex-col -z-10">
      {/* Search bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search connections"
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 rounded-md focus:outline-none"
          />
          <svg
            className="absolute left-2 top-2 h-4 w-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => requestDataHandler("connections")}
          className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer ${
            activeTab === "connections"
              ? "text-gray-800 border-b-2 border-gray-800"
              : "text-gray-500"
          }`}
        >
          All Connections
        </button>
        <button
          onClick={() => requestDataHandler("requests")}
          className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer ${
            activeTab === "requests"
              ? "text-gray-800 border-b-2 border-gray-800"
              : "text-gray-500"
          }`}
        >
          Request
        </button>
      </div>

      {/* Content area */}
      <div className="overflow-y-auto flex-1">
        {activeTab === "connections" ? (
          data?.data?.map((connection: any) => (
            <div
              key={connection._id}
              onClick={() => setSelectedUser(connection?.reciverUserId)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedUser === connection.reciverUserId._id
                  ? "bg-gray-50"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {connection?.reciverUserId?.profileImage ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    {/* <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${connection.reciverUserId?.profileImage}`}
                      alt={
                        connection.reciverUserId.first_name || "User Profile"
                      }
                      width={40}
                      height={40}
                      className="object-cover"
                    /> */}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#20B894] flex items-center justify-center text-white">
                    <span className="text-lg font-semibold">
                      {connection.reciverUserId.first_name
                        ?.slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">
                    {connection?.reciverUserId?.first_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {connection?.reciverUserId?.email}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col">
            {data?.data?.map((request) => (
              <div key={request.id} className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full relative overflow-hidden">
                    {request?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${request?.senderUserId?.profileImage}`}
                        alt="User Profile Image"
                        height={400}
                        width={400}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                        {request?.senderUserId?.first_name
                          ? request?.senderUserId.first_name
                              .slice(0, 2)
                              .toUpperCase()
                          : "UN"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {request?.senderUserId?.first_name}
                    </h3>
                    <p className="text-xs text-emerald-500">
                      {request.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {request.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-1 px-3 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600">
                    Accept
                  </button>
                  <button className="flex-1 py-1 px-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
