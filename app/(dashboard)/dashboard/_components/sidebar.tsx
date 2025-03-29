'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, MessageSquare, Star, Settings, LogOut } from 'lucide-react';
import logo from "@/public/client/home/logo.png"

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: UserCircle, label: 'User Profile', href: '/dashboard/user-profile' },
    { icon: MessageSquare, label: 'Message', href: '/dashboard/message' },
    { icon: Star, label: 'Review', href: '/dashboard/review' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="bg-white w-[280px] h-screen shadow-sm flex flex-col">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="block">
          <Image src={logo} alt="Logo" width={100} height={40} />
        </Link>
      </div>

      <div className="flex-1 py-6">
        <nav className="px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                pathname === item.href
                  ? 'bg-[#20B894] text-white'
                  : 'text-[#777980] hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t">
        <button className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors w-full px-4 py-2">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
