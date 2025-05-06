"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi, useGetAllExchangeDataQuery } from "@/src/redux/features/auth/authApi";
import { useExchangeChatRequestMutation } from "@/src/redux/features/shared/exchangeApi";
import Image from "next/image";
import { useState } from "react";

export const MessageList = ({
  onChatSelect,
  userData,
  currentUser,
  userId,
  userImage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const [exchangeChatRequest, { isLoading: exchangeChatIsLoading }] =
    useExchangeChatRequestMutation();

  // console.log("user Data", userData);
  // console.log("user id", userId);
  const [finalQuery, setFinalQuery] = useState({
    userId: userId,
    isAccepted: true,
  });
  const { data } = useGetAllExchangeDataQuery(finalQuery);
  const { data: requestList } = useGetAllExchangeDataQuery({
    userId: userId,
    isAccepted: false,
  });
  // console.log("requestList", requestList);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("userData", userData);
  const filteredUsers = userData
    ?.filter((user) =>
      (user?.email || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase())
    )
    .sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || a.lastMessageTime || 0;
      const timeB = b.lastMessage?.timestamp || b.lastMessageTime || 0;

      return new Date(timeB).getTime() - new Date(timeA).getTime(); // Most recent first
    });
  // console.log("filteredUsers", filteredUsers);

  if (!isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  const requestHandler = async (isAccepted, exchangeId) => {
    const data = {
      exchangeId,
      isAccepted,
      reciverUserId: userId,
    };
    const result = await exchangeChatRequest(data);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 sticky top-0 bg-white border-b border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <Tabs defaultValue="messages" className="flex-1 flex flex-col">
        <TabsList className="w-full bg-white border-b rounded-none sticky top-[72px] z-10">
          <TabsTrigger
            value="messages"
            className="flex-1 data-[state=active]:border-b-2 border-l-0 border-r-0 border-t-0 rounded-none data-[state=active]:border-[#20b894] data-[state=active]:bg-white"
          >
            Messages
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="flex-1 data-[state=active]:border-b-2 border-l-0 border-r-0 border-t-0 rounded-none data-[state=active]:border-[#20b894] data-[state=active]:bg-white"
          >
            Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="messages" className="flex-1 overflow-y-auto">
          <div className="overflow-y-auto">
            {filteredUsers?.map((user) => (
              <button
                key={user._id}
                onClick={() => onChatSelect(user)}
                className={`w-full text-left hover:bg-gray-50 p-4 border-b border-gray-100 ${
                  user.hasUnread ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center space-x-4 p-3">
                  {/* User Avatar Section */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      {userId === user?.senderUserId?._id ? (
                        // If userId matches senderUserId, show reciverUserId's image
                        user?.reciverUserId?.profileImage ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.reciverUserId?.profileImage}`}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                            <span className="text-white text-lg font-medium">
                              {user?.reciverUserId?.first_name
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </span>
                          </div>
                        )
                      ) : // If userId doesn't match senderUserId, show senderUserId's image
                      user?.senderUserId?.profileImage ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user?.senderUserId?.profileImage}`}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#20b894] flex items-center justify-center">
                          <span className="text-white text-lg font-medium">
                            {user?.senderUserId?.first_name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Online Status Indicator */}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>

                  {/* User Info Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {(user?.email === currentUser
                          ? user?.reciverUserId?.first_name
                          : user?.senderUserId?.first_name) || "Unknown"}{" "}
                        <span className="text-xs text-[#1677ff] ml-1">
                          (
                          {user?.email === currentUser
                            ? user?.reciverUserId?.role
                            : user?.senderUserId?.role}
                          )
                        </span>
                      </h3>
                      <span className="text-xs text-gray-500">
                        {user.lastMessage?.timestamp &&
                          new Date(
                            user.lastMessage.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {user?.email === currentUser
                        ? user?.reciverUserId?.email
                        : user?.email || "No messages yet"}
                    </p>
                  </div>

                  {/* Message Status Section */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {user.lastMessageTime &&
                        new Date(user.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                    {user.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full mt-1">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {userData?.data?.length === 0 && (
              <div className="text-center text-gray-500 p-4">
                {searchTerm ? "No chats found" : "No chats available"}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="requests">
          <div className="flex flex-col">
            {requestList?.data?.map((request) => (
              <div key={request._id} className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full relative overflow-hidden">
                    {request?.senderUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${request?.senderUserId?.profileImage}`}
                        alt={request?.senderUserId?.first_name
                          ?.slice(0, 2)
                          .toUpperCase()}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white font-semibold">
                        {request?.senderUserId?.first_name
                          ? request?.senderUserId.first_name
                              .slice(0, 2)
                              .toUpperCase()
                          : "UN"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium">
                      {request?.senderUserId?.first_name}
                    </h3>
                    <p className="text-xs text-emerald-500">
                      {request?.senderUserId?.first_name} Sent You a Request
                    </p>
                    <span className="text-xs text-gray-500">
                      {request.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      requestHandler("true", request._id);
                    }}
                    className="flex-1 py-1 px-3 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      requestHandler("false", request._id);
                    }}
                    className="flex-1 py-1 px-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
