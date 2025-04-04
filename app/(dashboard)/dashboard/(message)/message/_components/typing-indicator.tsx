import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import profile from "@/public/avatars/emily.png";

export default function TypingIndicator() {
  return (
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
  );
}