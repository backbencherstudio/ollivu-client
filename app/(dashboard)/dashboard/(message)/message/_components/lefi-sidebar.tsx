/** @jsxImportSource react */
'use client';

import React, { useEffect, useState } from "react";
import { Connection } from "../_types";
import Image from "next/image";
import { verifiedUser } from "@/src/utils/token-varify";
import { authApi } from "@/src/redux/features/auth/authApi";
import { socket, connectSocket } from "@/src/utils/socket";
import { formatDistanceToNow } from 'date-fns';

interface LeftSidebarProps {
  connections: Connection[];
  selectedUser: string | null;
  setSelectedUser: (name: string) => void;
}

function LeftSidebar({ connections, selectedUser, setSelectedUser }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [query, setQuery] = useState<{ userId?: string; isAccepted?: string }>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [finalQuery, setFinalQuery] = useState({ userId: undefined, isAccepted: true });

  useEffect(() => {
    const user = verifiedUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      setFinalQuery({ userId: currentUser.userId, isAccepted: true });
    }
  }, [currentUser]);

  const { data, refetch } = authApi.useGetAllExchangeDataQuery(finalQuery, {
    skip: !currentUser?.userId,
  });

  useEffect(() => {
    if (currentUser?.userId) {
      connectSocket(currentUser.userId);

      socket?.on('onlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      socket?.on('newMessage', async (message) => {
        if (message.senderId !== selectedUser) {
          setUnreadCounts(prev => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1
          }));
        }
        await refetch();
      });

      socket?.on('messageRead', (data) => {
        setUnreadCounts(prev => ({
          ...prev,
          [data.readBy]: 0
        }));
      });

      return () => {
        socket?.off('onlineUsers');
        socket?.off('newMessage');
        socket?.off('messageRead');
      };
    }
  }, [currentUser, selectedUser, refetch]);

  const requestDataHandler = (tabType: 'connections' | 'requests') => {
    setActiveTab(tabType);
    if (currentUser?.userId) {
      setQuery({
        userId: currentUser.userId,
        isAccepted: tabType === 'connections' ? 'true' : 'false',
      });
    }
  };

  useEffect(() => {
    if (query.userId) {
      setFinalQuery(query);
    }
  }, [query]);


console.log( data?.data);


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
          <svg className="absolute left-2 top-2 h-4 w-4 text-gray-500"
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
          onClick={() => requestDataHandler('connections')}
          className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer ${activeTab === 'connections'
            ? 'text-gray-800 border-b-2 border-gray-800'
            : 'text-gray-500'
            }`}
        >
          All Connections
        </button>
        <button
          onClick={() => requestDataHandler('requests')}
          className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer ${activeTab === 'requests'
            ? 'text-gray-800 border-b-2 border-gray-800'
            : 'text-gray-500'
            }`}
        >
          Request
        </button>
      </div>

      {/* Content area */}
      <div className="overflow-y-auto flex-1">

        {activeTab === 'connections' ? (
          data?.data?.map((connection) => (
            <div
              key={connection.id}
              onClick={() => setSelectedUser(connection.reciverUserId._id)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedUser === connection.reciverUserId._id ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full relative overflow-hidden">
                    {connection?.reciverUserId?.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${connection?.reciverUserId?.profileImage}`}
                        alt="User Profile Image"
                        height={400}
                        width={400}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                        {connection?.reciverUserId?.first_name
                          ? connection?.reciverUserId.first_name.slice(0, 2).toUpperCase()
                          : "UN"}
                      </div>
                    )}
                  </div>

                  {/* Online status indicator */}
                  {onlineUsers.includes(connection.reciverUserId._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium">
                      {connection.reciverUserId.first_name}
                    </h3>
                    {connection.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(connection.lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  {connection.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">
                      {connection.lastMessage.content}
                    </p>
                  )}
                </div>

                {/* Unread count badge */}
                {unreadCounts[connection.reciverUserId._id] > 0 && (
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">
                      {unreadCounts[connection.reciverUserId._id]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )
          : (
            <div className="flex flex-col">
              {data?.data?.map((request) => (
                <div key={request.id} className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full relative overflow-hidden">
                      {
                        request?.senderUserId?.profileImage ?
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${request?.senderUserId?.profileImage}`}
                            alt="User Profile Image"
                            height={400}
                            width={400}
                            className="object-cover"
                          />
                          :
                          <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                            {request?.senderUserId?.first_name
                              ? request?.senderUserId.first_name.slice(0, 2).toUpperCase()
                              : "UN"}
                          </div>
                      }
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{request?.senderUserId?.first_name}</h3>
                      <p className="text-xs text-emerald-500">{request.message}</p>
                      <span className="text-xs text-gray-500">{request.time}</span>
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

export default LeftSidebar;