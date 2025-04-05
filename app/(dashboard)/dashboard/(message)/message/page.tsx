"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "./_components/lefi-sidebar";
import { connections, messages, getMessagesByUser } from "./_data/mock-data";
import ChatArea from "./_components/chat-area";
import RightSidebar from "./_components/right-sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectedUserData } from "./_types";
import ConfirmServiceModal from "./_components/confirm-service-modal";
import ReportProfileModal from "./_components/report-profile-modal";


export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<SelectedUserData | null>(null);
  const [typing, setTyping] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [currentMessages, setCurrentMessages] = useState(messages);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
    <div className="relative flex h-full bg-white">
      {/* Left sidebar with conversations */}
      <div className={`
        w-full md:w-80 h-full bg-white overflow-y-auto
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
        flex-1 flex flex-col h-full
        ${selectedUser ? 'block' : 'hidden md:block'}
      `}>
        {selectedUser ? (
          // Remove the standalone back button from page.tsx
          <div className="relative w-full h-full flex flex-col">
            <ChatArea 
              messages={currentMessages} 
              typing={typing} 
              setTyping={setTyping}
              selectedUser={selectedUser.name}
              selectedUserImage={selectedUser.image}
              onOpenDetails={() => setIsDetailsPanelOpen(true)}
              setMessages={setCurrentMessages}
              onBack={() => setSelectedUser(null)}  // Add this prop
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
        fixed right-0 lg:relative w-80 h-full bg-white
        transform transition-transform duration-300 ease-in-out
        ${isDetailsPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <RightSidebar 
          selectedUser={selectedUser} 
          onOpenServiceModal={() => setIsServiceModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      </div>

      {/* Overlay for details panel */}
      {isDetailsPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsDetailsPanelOpen(false)}
        />
      )}

      {/* Service confirmation modal */}
      {selectedUser && (
        <ConfirmServiceModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          userName={selectedUser.name}
          userEmail={selectedUser.email}
          userImage={selectedUser.image}
        />
      )}

      {/* Report Profile Modal */}
      {selectedUser && (
        <ReportProfileModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
}