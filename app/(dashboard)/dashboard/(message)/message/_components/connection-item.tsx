import { Avatar } from "@/components/ui/avatar";
import { Connection } from "../_types";
import Image from "next/image";

interface ConnectionItemProps {
  connection: Connection;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

export default function ConnectionItem({ connection, isSelected, onSelect }: ConnectionItemProps) {
  return (
    <div
      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-50" : ""
        }`}
      onClick={() => onSelect(connection.name)}
    >
      <div className="flex items-start">
        <div className="relative">
          <Avatar className="h-10 w-10">
            {/* <img src={connection?.reciverUserId?.profileImage} alt={connection.name} className="rounded-full" /> */}
            {/* <img src={connection?.reciverUserId?.profileImage} alt={connection.name} className="rounded-full" /> */}

            {
              connection?.reciverUserId?.profileImage ?
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${connection?.reciverUserId?.profileImage}`}
                  alt="User Profile Image"
                  height={400}
                  width={400}
                  className="object-cover"
                />
                :
                <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                  {connection?.reciverUserId?.first_name
                    ? connection?.reciverUserId.first_name.slice(0, 2).toUpperCase()
                    : "UN"}
                </div>
            }


            {/* <Image src={
                    `${process.env.NEXT_PUBLIC_IMAGE_URL}${connection?.reciverUserId?.profileImage}`
                      : 
                      <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                      {connection?.reciverUserId?.first_name
                        ? connection?.reciverUserId.first_name.slice(0, 2).toUpperCase()
                        : "UN"}
                    </div>

                  } /> */}

          </Avatar>
          {connection.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">{connection?.reciverUserId.first_name}</span>
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
  );
}