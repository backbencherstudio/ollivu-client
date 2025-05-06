"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Image from "next/image";
import { verifiedUser } from "@/src/utils/token-varify";
import {
  useGetAllOverviewDataByUserQuery,
  useGetExchangeHistoryQuery,
  useGetSingleUserQuery,
} from "@/src/redux/features/users/userApi";
import VerifiedIcons from "@/public/icons/verified-icons";
import { useGetAllExchangeQuery } from "@/src/redux/features/admin/exchangeApi";
import { useGetAllExchangeDataQuery } from "@/src/redux/features/auth/authApi";
import { differenceInDays } from "date-fns";
import { useGetExchangeDashboardQuery } from "@/src/redux/features/shared/exchangeDashboardApi";
import { Dialog } from "@/components/ui/dialog";

export default function UserDashboardHome() {
  const [filter, setFilter] = useState("Month");
  const [timeFilter, setTimeFilter] = useState("7"); // Default 7 days
  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;
  console.log("singleUserData user", singleUserData);
  const { data: getExchangeHistory } = useGetExchangeHistoryQuery(
    validUser?.userId
  );
  const getExchangeHistoryData = getExchangeHistory?.data;
  const { data: getAllOverviewDataByUser } = useGetAllOverviewDataByUserQuery(
    validUser?.userId
  );
  const getAllOverviewDataByUserData = getAllOverviewDataByUser?.data;

  const { data: allExchangeData } = useGetAllExchangeQuery({});
  const allExchangeDataData = allExchangeData?.data;

  const userId = validUser?.userId;
  const { data: requestList } = useGetAllExchangeDataQuery({
    userId: userId,
    isAccepted: false,
  });
  const requestListData = requestList?.data;

  const { data: exchangeDashboard } = useGetExchangeDashboardQuery(userId);
  const exchangeDashboardData = exchangeDashboard?.data;
  console.log("exchangeDashboardData", exchangeDashboardData);
  // console.log("requestList", requestListData);

  // console.log("getExchangeHistoryData", allExchangeDataData);

  // Calculate days since user creation
  const daysSinceCreation = singleUserData?.createdAt
    ? differenceInDays(new Date(), new Date(singleUserData.createdAt))
    : 0;

  // Check if user has completed one year
  const hasCompletedOneYear = daysSinceCreation >= 365;

  // Calculate quality service status from singleUserData
  const totalReviews = singleUserData?.reviews?.length || 0;
  const averageRating =
    singleUserData?.reviews?.reduce(
      (acc: number, review: any) => acc + review.rating,
      0
    ) / totalReviews || 0;
  const hasQualityService = totalReviews > 10 && averageRating >= 4.5;

  // Calculate quality service progress
  const qualityServiceProgress = () => {
    if (totalReviews === 0) return 0;
    if (totalReviews < 10) {
      return Math.min(Math.round((totalReviews / 10) * 50), 50); // First 50% based on review count
    }
    if (averageRating < 4.5) {
      return 50 + Math.min(Math.round((averageRating / 4.5) * 50), 49); // Last 50% based on rating
    }
    return 100; // Full progress when both conditions are met
  };

  const badges = [
    {
      label: "Years Expertise",
      status: hasCompletedOneYear ? "claim-green" : "claim",
      icon: "/badges/icon.png",
      progress: hasCompletedOneYear
        ? 100
        : Math.min(Math.round((daysSinceCreation / 365) * 100), 99),
    },
    {
      label: "Quality Service Ensured",
      status: hasQualityService ? "claim-green" : "claim",
      icon: "/badges/icon (2).png",
      progress: qualityServiceProgress(),
    },
    {
      label: "Verified Trainer",
      status: singleUserData?.cartificate ? "claim-green" : "locked",
      icon: (
        <VerifiedIcons
          className={
            singleUserData?.cartificate ? "text-[#20B894]" : "text-gray-400"
          }
        />
      ),
      progress: singleUserData?.cartificate ? 100 : 0,
      verified: singleUserData?.cartificate,
    },
  ];

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter data based on selected time period
  const filteredExchangeDashboardData = exchangeDashboardData?.filter((req) => {
    const requestDate = new Date(req.createdAt);
    const today = new Date();
    const daysDifference = differenceInDays(today, requestDate);

    switch (timeFilter) {
      case "7":
        return daysDifference <= 7;
      case "15":
        return daysDifference <= 15;
      case "30":
        return daysDifference <= 30;
      default:
        return true;
    }
  });

  // Calculate counts from exchangeDashboardData
  const confirmedExchanges =
    exchangeDashboardData?.filter((exchange) => exchange.isAccepted === "true")
      .length || 0;

  const totalExchangeRequests =
    exchangeDashboardData?.filter((exchange) => exchange.isAccepted === "false")
      .length || 0;

  return (
    // <ProtectedRoute allowedRoles={["user"]}>
    <div className="bg-white min-h-screen p-6 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Total Exchange Request",
            value: totalExchangeRequests,
          },
          {
            title: "Confirmed Exchange",
            value: confirmedExchanges,
          },
          // { title: "New Connect Requests", value: exchangeDashboardData?.length },
          {
            title: "Total Reviews",
            value: getAllOverviewDataByUserData?.totalReview,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 text-center shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500 mb-2">{stat.title}</p>
            <h3 className="text-2xl font-semibold text-[#20B894]">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Connection Requests & Active Chats */}
      <div className="grid grid-cols-1 ">
        <div className="border rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Connection Request</h3>
            <select
              className="text-sm text-gray-600 border rounded px-2 py-1"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="15">Last 15 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Request To</th>
                  <th className="p-3">Service Requested</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExchangeDashboardData?.map((req, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3">{req?.senderUserId?.first_name}</td>
                    <td className="p-3">{req?.senderService}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          req?.isAccepted === "true"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {req?.isAccepted === "true" ? "Accepted" : "Pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsModalOpen(true);
                        }}
                        className="text-[#20B894] hover:text-[#1a9677] cursor-pointer"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Chats */}
        {/* <div className="border rounded-xl bg-white shadow-sm p-4">
          <h3 className="font-semibold mb-4">Active Chats</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#D0A07A]">
            {[
              {
                name: 'Corina McCoy',
                message:
                  'Hey! 👋 I saw your post about Marketing & Social Media...',
                time: '8:24 PM',
                avatar: '/badges/Ellipse 6451.png'
              },
              {
                name: 'Patricia Sanders',
                message:
                  'Hello! The experience looks amazing. May I know what is the...',
                time: '8:24 PM',
                avatar: '/badges/Ellipse 6452.png',
              },
              {
                name: 'Lorri Warf',
                message:
                  'May I know what is the process of your service exchanging? Is it d...',
                time: '8:24 PM',
                avatar: '/badges/Ellipse 6452 (1).png',
              },
            ].map((chat, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-[#F9FAFB] rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={chat.avatar}
                    alt={chat.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm text-[#1D1F2C]">
                      {chat.name}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate w-[180px]">
                      {chat.message}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {chat.time}
                    </span>
                  </div>
                </div>
                <button className="text-[#20B894] border border-[#20B894] px-4 py-1 text-xs rounded-full font-medium hover:bg-[#20B894]/10">
                  Open Chat
                </button>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Badges & Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges & Achievements */}
        <div className="border rounded-xl bg-white shadow-sm p-4">
          <h3 className="font-semibold mb-4">Badges & Achievements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="relative border rounded-xl px-3 py-4 flex flex-col items-center text-center shadow-sm bg-white"
              >
                <div className="absolute top-2 right-2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>

                <div className="relative w-20 h-20 mb-3">
                  <svg
                    className="w-20 h-20 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#FACC15]"
                      strokeWidth="4"
                      strokeDasharray={`${badge.progress}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {typeof badge.icon === "string" ? (
                      <Image
                        src={badge.icon}
                        alt={badge.label}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      badge.icon
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#4A4C56] mb-2">{badge.label}</p>

                {badge.status === "locked" ? (
                  <button className="bg-gray-300 text-white text-sm px-4 py-2 rounded-full w-full">
                    Locked
                  </button>
                ) : badge.status === "claim-green" ? (
                  <button className="bg-[#20B894] text-white text-sm px-4 py-2 rounded-full w-full">
                    Claim
                  </button>
                ) : (
                  <button className="bg-[#C5C7CD] text-white text-sm px-4 py-2 rounded-full w-full">
                    Claim
                  </button>
                )}

                {/* {badge.verified && (
                  <div className="absolute bottom-14 right-10 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center">
                    <Image
                      src="/badges/check.png"
                      alt="check"
                      width={14}
                      height={14}
                    />
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="border rounded-2xl bg-white shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[#1D1F2C] text-base md:text-lg">
              Exchange Request History
            </h3>
            <select
              className="text-sm border border-gray-300 rounded px-3 py-1 text-gray-600"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Month</option>
              <option>Week</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={getExchangeHistoryData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20B894" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#20B894" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F3F4F6"
              />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                domain={[0, 30]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  borderColor: "#E5E7EB",
                }}
                labelStyle={{ color: "#20B894", fontWeight: "bold" }}
                formatter={(value: number) => ["Exchange request", value]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#20B894"
                fillOpacity={1}
                fill="url(#colorCount)"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[500px] max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">
                Exchange Request Details
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            {selectedRequest && (
              <div className="p-6 space-y-4">
                {/* Sender Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">
                    Sender Information
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                      {selectedRequest?.senderUserId?.profileImage ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedRequest?.senderUserId?.profileImage}`}
                          alt={selectedRequest?.senderUserId?.first_name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                          {selectedRequest?.senderUserId?.first_name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {selectedRequest?.senderUserId?.first_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedRequest?.senderUserId?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Service Details</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">
                      <span className="font-medium">Sender Service:</span>{" "}
                      {selectedRequest?.senderService}
                    </p>
                    {/* <p className="text-sm">
                      <span className="font-medium">Receiver Service:</span>{" "}
                      {selectedRequest.receiverService}
                    </p> */}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedRequest?.isAccepted === "true"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {selectedRequest.isAccepted === "true"
                      ? "Accepted"
                      : "Pending"}
                  </span>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Request Date</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedRequest.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    // </ProtectedRoute>
  );
}
