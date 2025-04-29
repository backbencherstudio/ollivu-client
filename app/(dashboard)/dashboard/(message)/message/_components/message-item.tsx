import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import profile from "@/public/avatars/emily.png";
import profileOne from "@/public/avatars/john.png";
import { Message } from "../_types";

interface MessageItemProps {
  message: Message;
  selectedUserImage: string;
  currentUserId: string;
}

export default function MessageItem({ message, selectedUserImage, currentUserId }: MessageItemProps) {
  const isOwnMessage = message.sender === currentUserId;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mr-2">
          <Image 
            src={selectedUserImage} 
            alt="User" 
            className="rounded-full"
            width={32}
            height={32}
          />
        </Avatar>
      )}
      <div className={`max-w-[70%] ${isOwnMessage ? 'bg-emerald-500 text-white' : 'bg-gray-100'} rounded-lg px-4 py-2`}>
        <p>{message.content}</p>
        <span className="text-xs text-gray-500 mt-1 block">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}