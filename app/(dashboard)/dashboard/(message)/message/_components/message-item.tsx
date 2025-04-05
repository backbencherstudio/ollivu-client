import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import profile from "@/public/avatars/emily.png";
import profileOne from "@/public/avatars/john.png";
import { Message } from "../_types";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div
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
  );
}