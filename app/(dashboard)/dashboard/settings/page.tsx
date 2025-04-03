"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { MdChevronRight } from "react-icons/md";
import { IoLanguageOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
  ];

  return (
    <div>
      <div>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <div>
            <div
              className="flex items-center justify-between mb-4 border-b cursor-pointer hover:bg-gray-50"
              onClick={() => router.push("/dashboard/settings/login-security")}
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
            <div className="flex items-center gap-2">
              <IoLanguageOutline className="w-6 h-6" />
              <p className="py-4">Language</p>
            </div>
            <div className="w-32">
              <Select
                value={selectedLanguage}
                onValueChange={(value) => setSelectedLanguage(value)}
              >
                <SelectTrigger className="w-full border-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem 
                      key={language.value} 
                      value={language.value}
                      className="cursor-pointer"
                    >
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* <div className="flex items-center  mb-4 border-b">
            <div className="flex items-center gap-2  "> */}
              <div
                className="flex items-center justify-between mb-4 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  router.push("/dashboard/settings/notification-settings")
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <GoBell className="w-6 h-6" />
                  <p className="py-4">Notification Setting</p>
                </div>
                <div>
                  <MdChevronRight className="w-6 h-6" />
                </div>
              </div>
            {/* </div>
          </div> */}
        </Card>
      </div>
    </div>
  );
}
