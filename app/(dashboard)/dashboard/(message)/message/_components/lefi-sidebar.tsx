import { Connection } from "../_types";
import ConnectionItem from "./connection-item";


interface LeftSidebarProps {
  connections: Connection[];
  selectedUser: string | null;
  setSelectedUser: (name: string) => void;
}

export default function LeftSidebar({ connections, selectedUser, setSelectedUser }: LeftSidebarProps) {
  return (
    <div className="w-64 border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search connections"
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 rounded-md focus:outline-none"
          />
          <svg
            className="absolute left-2 top-2 h-4 w-4 text-gray-500"
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
      <div className="flex border-b border-gray-200">
        <button className="flex-1 text-center py-2 text-sm font-medium text-gray-800 border-b-2 border-gray-800">
          All Connections
        </button>
        <button className="flex-1 text-center py-2 text-sm font-medium text-gray-500">
          Request
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {connections.map((connection) => (
          <ConnectionItem 
            key={connection.id} 
            connection={connection} 
            isSelected={selectedUser === connection.name}
            onSelect={setSelectedUser}
          />
        ))}
      </div>
    </div>
  );
}