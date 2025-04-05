import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Image from "next/image";
import profileOne from "@/public/avatars/john.png";
import { Message } from "../_types";
import MessageItem from "./message-item";
import TypingIndicator from "./typing-indicator";

interface ChatAreaProps {
  messages: Message[];
  typing: boolean;
  setTyping: (typing: boolean) => void;
  selectedUser: string;
  selectedUserImage: string;  // Add this
  onOpenDetails: () => void;
}

export default function ChatArea({ 
  messages, 
  typing, 
  setTyping, 
  selectedUser,
  selectedUserImage,  // Add this
  onOpenDetails 
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    setMessageInput("");
    setTyping(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="flex items-center">
          <button className="mr-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <Avatar className="h-8 w-8">
            <Image src={profileOne} alt="Chris Glasser" className="rounded-full" />
          </Avatar>
          <div className="ml-3">
            <div className="font-medium text-sm">Chris Glasser</div>
          </div>
        </div>
        <div>
          <button className="text-gray-500 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
          <button className="text-gray-500 p-1 ml-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            selectedUserImage={selectedUserImage} 
          />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type message here..."
            className="flex-1 py-2"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 text-emerald-500"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}