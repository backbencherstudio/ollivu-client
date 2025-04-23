'use client';

import React, { useState } from 'react';
import LeftSidebar from './_components/lefi-sidebar';
import MessageArea from './_components/message-area';
import { authApi } from "@/src/redux/features/auth/authApi";
import { verifiedUser } from "@/src/utils/token-varify";

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = verifiedUser();
  
  const { data } = authApi.useGetAllExchangeDataQuery({
    userId: currentUser?.userId,
    isAccepted: true
  }, {
    skip: !currentUser?.userId,
  });

  const handleUserSelect = (userId: string) => {
    const user = data?.data?.find(
      (conn) => conn.reciverUserId._id === userId
    )?.reciverUserId;
    setSelectedUser(user);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <div className="w-[350px] bg-white shadow-sm">
        <LeftSidebar
          connections={data?.data || []}
          selectedUser={selectedUser?._id}
          setSelectedUser={handleUserSelect}
        />
      </div>
      <div className="flex-1 bg-white ml-5 shadow-sm">
        <MessageArea selectedUser={selectedUser} />
      </div>
    </div>
  );
}