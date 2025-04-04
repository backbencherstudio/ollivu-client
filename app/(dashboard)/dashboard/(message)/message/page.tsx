"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "./_components/lefi-sidebar";
import { connections, messages } from "./_data/mock-data";
import ChatArea from "./_components/chat-area";
import RightSidebar from "./_components/right-sidebar";

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<string | null>("Chris Glasser");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  return (
    <div className="flex h-screen bg-white">
      {/* Left sidebar with connections */}
      <LeftSidebar 
        connections={connections} 
        selectedUser={selectedUser} 
        setSelectedUser={setSelectedUser} 
      />

      {/* Main chat area */}
      <ChatArea 
        messages={messages} 
        typing={typing} 
        setTyping={setTyping} 
      />

      {/* Right sidebar - Details panel */}
      <RightSidebar />
    </div>
  );
}