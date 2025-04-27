import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConfirmServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  myServices: string[];
  senderService: string;
  acceptedService: string;
}

export default function ConfirmServiceModal({
  isOpen,
  onClose,
  myServices = [],
  senderService = "",
  acceptedService = "",
}: ConfirmServiceModalProps) {
  if (!isOpen) return null;
  
  console.log("senderService", senderService);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {

    if (e.target === e.currentTarget) {
      onClose();
    }

  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick} // Add click handler to backdrop
    >
      <div className="bg-white rounded-2xl w-[400px] p-6 relative">
        {" "}
        {/* Add relative positioning */}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
        {/* Title */}
        <h2 className="text-center text-xl font-medium mb-6">
          Let's confirm your Exchange Service Request!
        </h2>
        {/* User Info with null checks */}
        {/* <div className="flex items-center gap-3 mb-8">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName || "User"}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl font-medium text-gray-600">
                {userName?.trim() ? userName.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium">{userName || "User"}</h3>
            <p className="text-sm text-gray-500">{userEmail || "No email"}</p>
          </div>
        </div> */}
        {/* Services Exchange Section */}
        <div className="space-y-6">
          {/* My Service */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              My service:
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your service" />
              </SelectTrigger>
              <SelectContent>
                {myServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exchange Icon */}
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-[#20B89410] rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#20B894"
                strokeWidth="2"
              >
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
              </svg>
            </div>
          </div>

          {/* Accepted Service */}
          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Accepted service:
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">{senderService}</span>
            </div>
          </div>
        </div>
        {/* Confirm Button */}
        <Button
          className="w-full mt-8 bg-[#20B894] hover:bg-[#1ca883] text-white"
          onClick={() => {
            // Handle confirmation logic here
            onClose();
          }}
        >
          Confirm Service
        </Button>
      </div>
    </div>
  );
}
