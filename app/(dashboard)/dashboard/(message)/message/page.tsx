"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "./_components/lefi-sidebar";
import { connections, messages } from "./_data/mock-data";
import ChatArea from "./_components/chat-area";
import RightSidebar from "./_components/right-sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<string | null>("Chris Glasser");
  const [typing, setTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  return (
    <div className="relative flex h-screen bg-white">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Left sidebar with connections */}
      <div className={`
        fixed md:relative w-80 h-full bg-white z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="md:hidden absolute right-4 top-4">
          <Button variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <LeftSidebar 
          connections={connections} 
          selectedUser={selectedUser} 
          setSelectedUser={(user) => {
            setSelectedUser(user);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <ChatArea 
          messages={messages} 
          typing={typing} 
          setTyping={setTyping}
          // onOpenDetails={() => setIsDetailsPanelOpen(true)} 
        />
      </div>

      {/* Right sidebar - Details panel */}
      <div className={`
        fixed right-0 lg:relative w-80 h-full bg-white z-40
        transform transition-transform duration-300 ease-in-out
        ${isDetailsPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="lg:hidden absolute left-4 top-4">
          <Button variant="ghost" onClick={() => setIsDetailsPanelOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <RightSidebar />
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