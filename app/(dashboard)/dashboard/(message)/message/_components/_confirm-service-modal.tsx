import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface ConfirmServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userImage: string;
}

export default function ConfirmServiceModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  userImage
}: ConfirmServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg w-[400px] relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="p-8 text-center">
          <Avatar className="mx-auto h-24 w-24">
            <Image 
              src={userImage} 
              alt={userName} 
              width={96} 
              height={96} 
              className="rounded-full"
            />
          </Avatar>
          <h2 className="text-xl font-semibold mt-4">{userName}</h2>
          <p className="text-gray-500 text-sm">{userEmail}</p>
          <p className="mt-6 text-lg">Let's confirm your Exchange Service Request!</p>
          <Button 
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => {
              // Handle confirmation logic here
              onClose();
            }}
          >
            Confirm Service
          </Button>
        </div>
      </div>
    </div>
  );
}