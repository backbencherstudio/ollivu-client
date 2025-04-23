"use client";

import { useState } from "react";
import LeftSidebar from "./_components/lefi-sidebar";
import { connections, messages, getMessagesByUser } from "./_data/mock-data";
import ChatArea from "./_components/chat-area";
import RightSidebar from "./_components/right-sidebar";
import { Message } from "./_types";
import ConfirmServiceModal from "./_components/confirm-service-modal";
import ReportProfileModal from "./_components/report-profile-modal";
import { useGetAllExchangeDataQuery } from "@/src/redux/features/auth/authApi";


export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const handleUserSelect = (userData: any) => {
    console.log("Selected User Data:", userData); // For debugging
    setSelectedUser({
      _id: userData._id,
      first_name: userData.first_name,
      email: userData.email,
      profileImage: userData.profileImage
    });
  };

  return (
    <div className="relative flex h-full bg-white">
      <div className={`w-full md:w-80 h-full bg-white overflow-y-auto ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <LeftSidebar
          selectedUser={selectedUser?._id}
          setSelectedUser={handleUserSelect}
        />
      </div>

      {selectedUser ? (
        <div className="flex-1">
          <ChatArea
            messages={messages}
            typing={typing}
            setTyping={setTyping}
            selectedUser={selectedUser}
            onOpenDetails={() => setIsDetailsPanelOpen(true)}
            setMessages={setMessages}
            onBack={() => setSelectedUser(null)}
          />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
}