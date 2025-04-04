// app/(message)/message/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Link from "next/link";

import profile from "@/public/avatars/emily.png"
import profileOne from "@/public/avatars/john.png"
import profileTwo from "@/public/avatars/michael.png"
import profileThree from "@/public/avatars/sophia.png"
import Image from "next/image";


interface Connection {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  online: boolean;
  pending?: boolean;
  image: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  read?: boolean;
}

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState<string | null>("Chris Glasser");
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Sample connections data
  const connections: Connection[] = [
    {
      id: "1",
      name: "Corina McCoy",
      lastMessage: "Awesome. This experience looks amazing! May I know what it...",
      time: "5:15 PM",
      online: true,
      pending: true,
      image: profileOne.src
    },
    {
      id: "2",
      name: "Patricia Sanders",
      lastMessage: "Hey! Thanks for accepting the request. May I know what is...",
      time: "5:15 PM",
      online: true,
      image: profileTwo.src
    },
    {
      id: "3",
      name: "Chris Glasser",
      lastMessage: "BTW, What kind of service would you be interested in ex...",
      time: "5:14 PM",
      online: true,
      image: profileThree.src
    },
    {
      id: "4",
      name: "Lori Ward",
      lastMessage: "These times are tough to manage when you have lot to...",
      time: "13h ago",
      online: false,
      image: profileOne.src
    },
    {
      id: "5",
      name: "Joshua Jones",
      lastMessage: "Yes, you're on point! That's what I meant when I wanted t...",
      time: "2 days ago",
      online: false,
      image: profileThree.src
    }
  ];

  // Sample messages data for Chris Glasser
  const messages: Message[] = [
    {
      id: "1",
      sender: "user",
      image: profile.src,
      text: "Hey! 👋 I saw your post about Marketing & Social Media Management services. I've expertise in it! Are you open to an exchange?",
      time: "Thu, Apr, 2024",
      read: true
    },
    {
      id: "2",
      sender: "Chris Glasser",
      image: profile.src,
      text: "Would you be available for a quick call to discuss the details? 📞",
      time: "8:24 PM",
      read: true
    },
    {
      id: "3",
      sender: "user",
      image: profile.src,
      text: "Hey, thanks for reaching out!",
      time: "Read 8:45",
      read: true
    }, 
    {
      id: "4",
      sender: "user",
      image: profile.src,
      text: "A call sounds great! When would be a good time for you?",
      time: "8:44 PM",
      read: true
    },
    {
      id: "5",
      sender: "Chris Glasser",
      image: profileOne.src,
      text: "BTW, What kind of service would you be interested in swapping for the Marketing & Social Media Management? I see that you can swap with web development.",
      time: "8:50 PM",
      read: false
    }
  ];

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    setMessageInput("");
    setTyping(true);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search connections"
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 rounded-md focus:outline-none"
            />
            <svg
              className="absolute left-2 top-2 h-4 w-4 text-gray-500"
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
        <div className="flex border-b border-gray-200">
          <button className="flex-1 text-center py-2 text-sm font-medium text-gray-800 border-b-2 border-gray-800">
            All Connections
          </button>
          <button className="flex-1 text-center py-2 text-sm font-medium text-gray-500">
            Request
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedUser === connection.name ? "bg-gray-50" : ""
              }`}
              onClick={() => setSelectedUser(connection.name)}
            >
              <div className="flex items-start">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <img src={connection.image} alt={connection.name} className="rounded-full" />
                  </Avatar>
                  {connection.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{connection.name}</span>
                    <span className="text-xs text-gray-500">{connection.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{connection.lastMessage}</p>
                </div>
              </div>
              {connection.pending && (
                <div className="mt-2 text-right">
                  <span className="text-xs text-gray-500">Request pending</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
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
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {message.sender !== "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <Image src={profileOne} alt="Chris Glasser" className="rounded-full" />
                </Avatar>
              )}
              <div
                className={`max-w-xs mx-2 ${
                  message.sender === "user"
                    ? "bg-emerald-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                    : "bg-gray-100 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                } px-4 py-2 text-sm`}
              >
                {message.text}
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <Image src={profile} alt="You" className="rounded-full" />
                </Avatar>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mt-1">
                <Image src={profile} alt="Chris Glasser" className="rounded-full" />
              </Avatar>
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-xs mx-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
                <span className="text-xs text-gray-500">Typing...</span>
              </div>
            </div>
          )}
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

      {/* Right sidebar - Details panel */}
      <div className="w-64 border-l border-gray-200 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <span className="text-sm font-medium">Details</span>
          <button className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 text-center">
          <Avatar className="mx-auto">
            <Image src={profileOne} width={150} height={150} alt="Chris Glasser" className="rounded-full" />
          </Avatar>
          <h3 className="font-medium mt-2">Chris Glasser</h3>
          <p className="text-sm text-gray-500">chris_glasser@gmail.com</p>
          
          <div className="mt-4">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              Confirm Exchange Service
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          <div className="mt-2">
            <Button className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
              Give Review
            </Button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center p-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
            <span>Report profile</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex items-center p-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
            <span>Star profile</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}