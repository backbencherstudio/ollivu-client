"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "./_components/lefi-sidebar";
import { connections, messages, getMessagesByUser } from "./_data/mock-data";
import ChatArea from "./_components/chat-area";
import RightSidebar from "./_components/right-sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectedUserData } from "./_types";


export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<SelectedUserData | null>(null);
  const [typing, setTyping] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [currentMessages, setCurrentMessages] = useState(messages);

  // Handle conversation selection
  const handleConversationSelect = (userName: string) => {
    const selectedConnection = connections.find(conn => conn.name === userName);
    if (selectedConnection) {
      setSelectedUser({
        name: selectedConnection.name,
        email: selectedConnection.email,
        image: selectedConnection.image
      });
      
      // Get messages for selected user from messagesByUser
      const userMessages = getMessagesByUser(userName);
      console.log('Selected user messages:', userMessages); // For debugging
      setCurrentMessages(userMessages);
      setIsDetailsPanelOpen(false);
    }
  };

  return (
    <div className="relative flex h-screen bg-white">
      {/* Left sidebar with conversations */}
      <div className={`
        w-full md:w-80 h-full bg-white
        ${selectedUser ? 'hidden md:block' : 'block'}
      `}>
        <LeftSidebar 
          connections={connections} 
          selectedUser={selectedUser?.name || null} 
          setSelectedUser={handleConversationSelect}
        />
      </div>

      {/* Main chat area */}
      <div className={`
        flex-1 flex flex-col
        ${selectedUser ? 'block' : 'hidden md:block'}
      `}>
        {selectedUser ? (
          <div className="relative w-full h-full">
            <button
              onClick={() => setSelectedUser(null)}
              className="md:hidden absolute left-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <ChatArea 
              messages={currentMessages} 
              typing={typing} 
              setTyping={setTyping}
              selectedUser={selectedUser.name}
              selectedUserImage={selectedUser.image}  // Add this prop
              onOpenDetails={() => setIsDetailsPanelOpen(true)}
            />
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* Right sidebar - Details panel */}
      <div className={`
        fixed right-0 lg:relative w-80 h-full bg-white z-40
        transform transition-transform duration-300 ease-in-out
        ${isDetailsPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="lg:hidden absolute left-4 top-4">
          <Button variant="ghost" onClick={() => setIsDetailsPanelOpen(false)}>
            <X className="h-6 w-4" />
          </Button>
        </div>
        <RightSidebar selectedUser={selectedUser} />
      </div>

      {/* Overlay for details panel */}
      {isDetailsPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsDetailsPanelOpen(false)}
        />
      )}
    </div>
  );
}