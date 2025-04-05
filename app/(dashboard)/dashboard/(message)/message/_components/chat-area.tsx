import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Image from "next/image";
import { Message } from "../_types";
import MessageItem from "./message-item";
import TypingIndicator from "./typing-indicator";

interface ChatAreaProps {
  messages: Message[];
  typing: boolean;
  setTyping: (typing: boolean) => void;
  selectedUser: string;
  selectedUserImage: string;
  onOpenDetails: () => void;  // This prop will be used
  setMessages: (messages: Message[]) => void;
  onBack: () => void;
}

export default function ChatArea({ 
  messages, 
  typing, 
  setTyping, 
  selectedUser,
  selectedUserImage,
  onOpenDetails,
  setMessages,
  onBack  // Add this
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);  // Add this

  // Add scroll to bottom effect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Add typing indicator when user is typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    setTyping(true);

    // Clear typing indicator after 2 seconds of no typing
    const timeoutId = setTimeout(() => {
      setTyping(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      email: "user@example.com",
      image: "user-image.jpg",
      text: messageInput,
      time: new Date().toLocaleTimeString(),
      read: true
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    setTyping(false);
  };

  return (
    <div className="flex flex-col h-[90vh] relative">
      {/* Chat header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-2 text-gray-500 md:hidden">
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
          <div 
            className="flex items-center cursor-pointer lg:cursor-default" 
            onClick={() => onOpenDetails()}
          >
            <Avatar className="h-8 w-8">
              <Image 
                src={selectedUserImage} 
                alt={selectedUser} 
                className="rounded-full"
                width={32}
                height={32}
              />
            </Avatar>
            <div className="ml-3">
              <div className="font-medium text-sm">{selectedUser}</div>
            </div>
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
          {/* <button className="text-gray-500 p-1 ml-1">
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
          </button> */}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            selectedUserImage={selectedUserImage} 
          />
        ))}
        {typing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - Fixed at bottom */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type message here..."
            className="flex-1 py-2"
            value={messageInput}
            onChange={handleTyping}
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