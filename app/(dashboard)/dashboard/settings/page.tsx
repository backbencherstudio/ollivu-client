'use client';

import { Card } from "@/components/ui/card";
import React from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { MdChevronRight } from "react-icons/md";
import { IoLanguageOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { useRouter } from "next/navigation";



export default function Settings() {
  const router = useRouter();

  return (
    <div>
      <div>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <div>
            <div 
              className="flex items-center justify-between mb-4 border-b cursor-pointer hover:bg-gray-50"
              onClick={() => router.push('/dashboard/settings/login-security')}
            >
              <div className="flex items-center gap-2">
                <BiLogOutCircle className="w-6 h-6" />
                <p className="py-4">Login & Security</p>
              </div>
              <div>
                <MdChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4 border-b">
              <div className="flex items-center gap-2  ">
                <IoLanguageOutline
                className="w-6 h-6" />
                <p className="py-4">Language</p>
              </div>
              <div>
                <MdChevronRight className="w-6 h-6" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 border-b">
              <div className="flex items-center gap-2  ">
                <GoBell 
                className="w-6 h-6" />
                <p className="py-4">Notification Setting</p>
              </div>
              <div>
                <MdChevronRight className="w-6 h-6" />
              </div>
            </div>
        </Card>
      </div>
    </div>
  );
}
