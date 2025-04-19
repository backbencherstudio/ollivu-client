"use client";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Change this import
import MyService from "./_components/my-services";
import Portfolio from "./_components/portfolio";

// Update imports
import Certificate from "./_components/certificate";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";

export default function UserProfile() {
  const [profileImage, setProfileImage] = useState(profile);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState([
    "Web Development",
    "Coding",
    "Cooking",
  ]);

  const user = verifiedUser()
  console.log("userProfile", user);
  
  

  // Add this near your existing code
  const handleAddService = () => {
    setShowServiceModal(true);
  };

  // Update the My Service card section
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Profile Photo Section */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto sm:mx-0">
            <Image src={profileImage} alt="Profile" fill className="object-cover" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-medium">Katie Sims</h2>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
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
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-medium">Personal Information</h2>
          <button className="text-[#20B894] text-sm border p-3 rounded-full flex items-center gap-x-2 cursor-pointer">
            <LuPencilLine />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      <Card className="p-4 md:p-6">
        <h2 className="text-lg font-medium mb-6">Address Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
            <label className="text-sm text-gray-600">
              Street address (optional)
            </label>
            <Input placeholder="e.g. 123 Main St." className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">
              Apt, suite, (optional)
            </label>
            <Input placeholder="e.g. Apt #123" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">City</label>
            <Input placeholder="e.g. San Antonio #123" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">
              State / Province / County / Region
            </label>
            <Input placeholder="e.g. State #123" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Zip code</label>
            <Input placeholder="729 664 674" className="mt-1" />
          </div>
        </div>
      </Card>

      {/* About Me */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-medium">About Me</h2>
          <button className="text-[#20B894] text-sm border p-3 rounded-full flex items-center gap-x-2 cursor-pointer">
            <LuPencilLine />
            Edit
          </button>
        </div>
        <Textarea
          className="min-h-[100px]"
          placeholder="Passionate about learning and sharing skills!..."
        />
      </Card>

      {/* My Service and Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <MyService />
        <Portfolio />
      </div>

      {/* Extra Skills and Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* <ExtraSkills /> */}
        <Certificate />
      </div>

      {/* Add Service Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="sm:max-w-[425px] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Service name
              </label>
              <Input placeholder="Enter service name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Service description (optional)
              </label>
              <Textarea
                placeholder="Describe your service..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 text-sm text-gray-500 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]">
                Add Service
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
