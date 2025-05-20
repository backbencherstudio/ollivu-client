import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface MessageRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: string) => void;
  instructor: any;
  singleUser: any;
}

const MessageRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  instructor,
  singleUser,
}: MessageRequestModalProps) => {
  const [selectedService, setSelectedService] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedService) {
      setError("Please select a service to continue");
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit(selectedService);
      setSelectedService("");
      setError("");
    } finally {
      setIsLoading(false);
    }
  };

  const skilles = singleUser?.my_service || [];

  // const handleSubmit = () => {
  //   if (!selectedService) {
  //     setError("Please select a service to continue");
  //     return;
  //   }
  //   onSubmit(selectedService);
  //   console.log("selectedService", selectedService);
    
  //   setSelectedService("");
  //   setError("");
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-10 md:px-0">
      <div className="bg-white rounded-xl p-6 w-[480px] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full relative overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${instructor?.profileImage}`}
              alt={instructor?.first_name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{instructor?.first_name}</h3>
            <p className="text-gray-500 text-sm">{instructor?.email}</p>
          </div>
        </div>

        <h2 className="text-lg font-medium mb-2">Request Service</h2>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
            <span>⚠</span>
            <p>{error}</p>
            <button onClick={() => setError("")} className="ml-auto">×</button>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {skilles.map((skill: string) => (
            <button
              key={skill}
              onClick={() => setSelectedService(skill)}
              className={`w-full p-3 text-left rounded-lg border ${
                selectedService === skill
                  ? "border-[#20B894] text-[#20B894]"
                  : "border-gray-200 text-gray-700"
              } hover:border-[#20B894] transition-colors`}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 bg-[#20B894] text-white py-2.5 rounded-lg ${
              !isLoading && "hover:bg-emerald-700"
            } transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Sending..." : "Send Request"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageRequestModal;