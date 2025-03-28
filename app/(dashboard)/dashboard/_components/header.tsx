import React from 'react';
import Image from 'next/image';
import { Bell, MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[#070707]">Overview</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="relative">
            <MessageCircle className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          <button className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full relative overflow-hidden">
              <Image
                src="/avatar-placeholder.jpg"
                alt="User"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[#070707]">Katie Sims</p>
              <p className="text-xs text-gray-500">User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
