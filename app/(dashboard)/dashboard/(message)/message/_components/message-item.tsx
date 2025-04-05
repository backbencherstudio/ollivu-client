import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import profile from "@/public/avatars/emily.png";
import profileOne from "@/public/avatars/john.png";
import { Message } from "../_types";

interface MessageItemProps {
  message: Message;
  selectedUserImage: string;
}

export default function MessageItem({ message, selectedUserImage }: MessageItemProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-start mb-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="h-8 w-8 mr-2 overflow-hidden rounded-full">
          <Image 
            src={selectedUserImage} 
            alt={message.sender} 
            width={100}
            height={100}
            className="rounded-full object-cover" 
          />
        </div>
      )}
      <div
        className={`max-w-xs mx-2 ${
          isUser
            ? "bg-emerald-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
            : "bg-gray-100 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
        } px-4 py-2 text-sm`}
      >
        {message.text}
      </div>
      {isUser && (
        <div className="h-8 w-8 ml-2 overflow-hidden rounded-full">
          <Image 
            src={profile} 
            alt="You" 
            width={100}
            height={100}
            className="rounded-full object-cover" 
          />
        </div>
      )}
    </div>
  );
}