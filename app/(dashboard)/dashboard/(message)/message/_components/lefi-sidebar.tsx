import { useState } from "react";
import { Connection } from "../_types";
import ConnectionItem from "./connection-item";
import Image from "next/image";
import { connectionRequests } from "../_data/mock-data";

interface LeftSidebarProps {
  connections: Connection[];
  selectedUser: string | null;
  setSelectedUser: (name: string) => void;
}

export default function LeftSidebar({ connections, selectedUser, setSelectedUser }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');

  return (
    <div className=" border-r border-gray-200 flex flex-col -z-10">
      {/* Search bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search connections"
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 rounded-md focus:outline-none"
          />
          <svg className="absolute left-2 top-2 h-4 w-4 text-gray-500"
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

      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('connections')}
          className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer ${
            activeTab === 'connections' 
              ? 'text-gray-800 border-b-2 border-gray-800' 
              : 'text-gray-500'
          }`}
        >
          All Connections
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer ${
            activeTab === 'requests' 
              ? 'text-gray-800 border-b-2 border-gray-800' 
              : 'text-gray-500'
          }`}
        >
          Request
        </button>
      </div>

      {/* Content area */}
      <div className="overflow-y-auto flex-1">
        {activeTab === 'connections' ? (
          connections.map((connection) => (
            <ConnectionItem 
              key={connection.id} 
              connection={connection} 
              isSelected={selectedUser === connection.name}
              onSelect={setSelectedUser}
            />
          ))
        ) : (
          <div className="flex flex-col">
            {connectionRequests.map((request) => (
              <div key={request.id} className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full relative overflow-hidden">
                    <Image 
                      src={request.image} 
                      alt={request.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{request.name}</h3>
                    <p className="text-xs text-emerald-500">{request.message}</p>
                    <span className="text-xs text-gray-500">{request.time}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-1 px-3 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600">
                    Accept
                  </button>
                  <button className="flex-1 py-1 px-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}