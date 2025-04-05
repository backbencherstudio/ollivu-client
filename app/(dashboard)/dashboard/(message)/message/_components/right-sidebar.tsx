import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import profileOne from "@/public/avatars/john.png";

interface RightSidebarProps {
  selectedUser: {
    name: string;
    email: string;
    image: string;
  } | null;
}

export default function RightSidebar({ selectedUser }: RightSidebarProps) {
  if (!selectedUser) return null;

  return (
    <div className="w-64 border-l border-gray-200 flex flex-col">
      <div className="p-4 text-center ">
        <Avatar className="mx-auto">
          <Image src={selectedUser.image} width={150} height={150} alt={selectedUser.name} className="rounded-full" />
        </Avatar>
        <h3 className="font-medium mt-2">{selectedUser.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{selectedUser.email}</p>
        
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
  );
}