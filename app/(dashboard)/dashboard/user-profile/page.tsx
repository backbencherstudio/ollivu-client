'use client';

import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";
import profile from "@/public/avatars/emily.png";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsArrowUpRight } from "react-icons/bs";
import { LuPencilLine } from "react-icons/lu";



export default function UserProfile() {
  const [profileImage, setProfileImage] = useState(profile);

  return (
    <div className="space-y-6">
      {/* Profile Photo Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image src={profileImage} alt="Profile" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Katie Sims</h2>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678] flex justify-center items-center gap-x-2">
                Replace Photo
                <BsArrowUpRight />

              </button>
              <button className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
                Remove
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Personal Information</h2>
          <button className="text-[#20B894] text-sm border p-3 rounded-full flex items-center gap-x-2 cursor-pointer">
          <LuPencilLine />

            Edit</button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">First name</label>
            <Input defaultValue="Katie" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Last name</label>
            <Input defaultValue="Sims" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Display name</label>
            <Input placeholder="Choose display name" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone number</label>
            <Input defaultValue="+45983280932" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email address</label>
            <Input defaultValue="katie_sims@gmail.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date of birth</label>
            <Input type="date" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <Select defaultValue="female">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-6">Address Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Country (optional)</label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="United States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Street address (optional)</label>
            <Input placeholder="e.g. 123 Main St." className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Apt, suite, (optional)</label>
            <Input placeholder="e.g. Apt #123" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">City</label>
            <Input placeholder="e.g. San Antonio #123" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">State / Province / County / Region</label>
            <Input placeholder="e.g. State #123" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Zip code</label>
            <Input placeholder="729 664 674" className="mt-1" />
          </div>
        </div>
      </Card>

      {/* About Me */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">About Me</h2>
          <button className="text-[#20B894] text-sm border p-3 rounded-full flex items-center gap-x-2 cursor-pointer">
          <LuPencilLine />

            Edit</button>
        </div>
        <Textarea 
          className="min-h-[100px]"
          placeholder="Passionate about learning and sharing skills! Whether it's web development or graphic design, I'm here to help and exchange knowledge with like-minded people. I believe in the power of collaboration!"
        />
      </Card>

      {/* My Service and Portfolio */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">My Service</h2>
          <p className="text-sm text-gray-500 mb-4">Add the service you have expertise in for exchanging services in this platform.</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]">
              Add service
            </button>
            <button className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
              Remove
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Portfolio</h2>
          <p className="text-sm text-gray-500 mb-4">Upload necessary documents or photos to showcase your portfolio/services.</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]">
              Add file
            </button>
            <button className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
              Remove
            </button>
          </div>
        </Card>
      </div>

      {/* Extra Skills and Certificate */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Extra Skills</h2>
          <p className="text-sm text-gray-500 mb-4">Showcase additional skills you can offer to enhance your exchanges.</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]">
              Add skills
            </button>
            <button className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
              Remove
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Certificate</h2>
          <p className="text-sm text-gray-500 mb-4">Upload necessary documents or certificates to verify your service and profile.</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]">
              Add file
            </button>
            <button className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
              Remove
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
