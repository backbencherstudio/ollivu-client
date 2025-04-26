"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi } from "@/src/redux/features/auth/authApi";
import { useExchangeChatRequestMutation } from "@/src/redux/features/shared/exchangeApi";
import Image from "next/image";
import { useState } from "react";

export const MessageList = ({
  onChatSelect,
  userData,
  currentUser,
  userId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const [exchangeChatRequest, {isLoading : exchangeChatIsLoading}] = useExchangeChatRequestMutation()

  console.log("currentUser", currentUser);
  const [finalQuery, setFinalQuery] = useState({
    userId: userId,
    isAccepted: true,
  });
  const { data } = authApi.useGetAllExchangeDataQuery(finalQuery);
  const { data: requestList } = authApi.useGetAllExchangeDataQuery({
    userId: userId,
    isAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("userData", userData);
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


  const requestHandler = async (isAccepted, exchangeId)=>{

    const data = {
      exchangeId,
      isAccepted,
      reciverUserId : userId
    }

    console.log(data);
    

    const result  = await exchangeChatRequest(data)

    console.log("result", result);
    
    
  }



  return (
    <div className="h-[600px]">
      <div className="p-4">
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
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="w-full bg-white border-b rounded-none">
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
        <TabsContent value="messages">
          <div className="overflow-y-auto">
            {filteredUsers?.map((user) => (
              <button
                key={user.id}
                onClick={() => onChatSelect(user)}
                className={`w-full text-left hover:bg-gray-50 p-4 border-b border-gray-100 ${
                  user.hasUnread ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user?.profileImage ? (
                      <img
                        src={`${user?.profileImage}`}
                        alt={user?.name?.slice(0, 2).toUpperCase()}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">
                          {user?.email === currentUser
                            ? user?.reciverUserId?.first_name
                                .slice(0, 2)
                                .toUpperCase()
                            : user?.senderUserId?.first_name
                                .slice(0, 2)
                                .toUpperCase() || "UN"}{" "}
                        </span>
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm ${
                          user.hasUnread
                            ? "font-bold text-blue-900"
                            : "font-semibold"
                        }`}
                      >
                        {user?.email === currentUser
                          ? user?.reciverUserId?.first_name
                          : user?.senderUserId?.first_name || "UN"}{" "}
                        <span className="text-[#1677ff] text-xs font-thin">{`(${
                          user?.email === currentUser
                            ? user?.reciverUserId.role
                            : user?.senderUserId?.role
                        })`}</span>
                      </h3>
                      {user.lastMessage?.timestamp && (
                        <span className="text-xs text-gray-400">
                          {new Date(
                            user.lastMessage.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm truncate ${
                        user.hasUnread
                          ? "font-semibold text-blue-800"
                          : "text-gray-500"
                      }`}
                    >
                      {/* {user.lastMessage?.content || "No messages yet"} */}
                      {user?.email === currentUser
                        ? user?.reciverUserId?.email
                        : user?.email || "No messages yet"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs ${
                        user.hasUnread
                          ? "text-blue-600 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {user.lastMessageTime
                        ? new Date(user.lastMessageTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : ""}
                    </span>
                    {user.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white font-bold text-xs rounded-full px-2 py-1 mt-1">
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
                  <div className="w-8 h-8 rounded-full relative overflow-hidden">
                    <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white font-semibold">
                      {request?.senderUserId?.first_name
                        ? request?.senderUserId.first_name
                            .slice(0, 2)
                            .toUpperCase()
                        : "UN"}
                    </div>
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
                  <button onClick={()=>{requestHandler("true", request._id)}} className="flex-1 py-1 px-3 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600">
                    Accept
                  </button>
                  <button onClick={()=>{requestHandler("false", request._id)}} className="flex-1 py-1 px-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
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
