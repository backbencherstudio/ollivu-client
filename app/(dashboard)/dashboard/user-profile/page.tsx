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
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";

export default function UserProfile() {
  const [profileImage, setProfileImage] = useState(profile);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const validUser = verifiedUser()
  console.log("user", validUser);
  

  // Update the mutation hook
  const [updateUser] = useUpdateUserMutation();
  const {data: singleUser, isLoading} = useGetSingleUserQuery(validUser?.userId)
  const singleUserData = singleUser?.data
  console.log("singleUser", singleUserData);
  

  // Add these after other state declarations
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      displayName: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      gender: "",
    },
    addressInfo: {
      country: "",
      streetAddress: "",
      aptSuite: "",
      city: "",
      stateProvinceCountryRegion: "",
      zipCode: "",
    },
    aboutMe: "",
  });
  console.log("formData", formData);
  

  // Add this handler function
  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => {
      if (section === "aboutMe") {
        return { ...prev, [section]: value };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  // Update the handleEditSave function
  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const updatedFormData = {
          userId: "", 
          first_name: formData.personalInfo.firstName,
          email: formData.personalInfo.email,
          password: "", // Keep empty for update
          profileImage: "", // Optional
          role: "user",
          isDeleted: false,
          personalInfo: {
            first_name: formData.personalInfo.firstName,
            last_name: formData.personalInfo.lastName,
            display_name: formData.personalInfo.displayName,
            phone_number: formData.personalInfo.phoneNumber || null,
            gender: formData.personalInfo.gender,
            dath_of_birth: formData.personalInfo.dateOfBirth || null,
          },
          addressInfo: {
            country: formData.addressInfo.country,
            streetAddress: formData.addressInfo.streetAddress,
            apt_suite: formData.addressInfo.aptSuite,
            city: formData.addressInfo.city,
            state_province_country_region: formData.addressInfo.stateProvinceCountryRegion,
            zipCode: formData.addressInfo.zipCode,
          },
          about_me: formData.aboutMe,
          my_service: [],
          extra_skills: [],
          portfolio: "",
          cartificate: "",
          rating: 0,
          review: 0,
        };

        const response = await updateUser(updatedFormData).unwrap();
        if (response.success) {
          console.log("Profile updated successfully:", response);
        } else {
          throw new Error(response.message || "Update failed");
        }
      } catch (error: any) {
        console.error("Failed to update profile:", error.message);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleAddService = () => {
    setShowServiceModal(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Profile Photo Section */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto sm:mx-0">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-medium">{singleUserData?.first_name}</h2>
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

      {/* Edit Button Card */}
      <Card className="p-4 md:p-6">
        <div className="flex justify-end">
          <button
            onClick={handleEditSave}
            className={`text-sm border p-3 rounded-full flex items-center gap-x-2 cursor-pointer ${
              isEditing ? "bg-[#20B894] text-white" : "text-[#20B894]"
            }`}
          >
            <LuPencilLine />
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg font-medium mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-sm text-gray-600">First name</label>
            <Input
              value={formData.personalInfo.firstName}
              onChange={(e) =>
                handleInputChange("personalInfo", "firstName", e.target.value)
              }
              className="mt-1"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Last name</label>
            <Input
              value={formData.personalInfo.lastName}
              onChange={(e) =>
                handleInputChange("personalInfo", "lastName", e.target.value)
              }
              className="mt-1"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Display name</label>
            <Input
              value={formData.personalInfo.displayName}
              onChange={(e) =>
                handleInputChange("personalInfo", "displayName", e.target.value)
              }
              placeholder="Choose display name"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone number</label>
            <Input
              value={formData.personalInfo.phoneNumber}
              onChange={(e) =>
                handleInputChange("personalInfo", "phoneNumber", e.target.value)
              }
              placeholder="+1234567890"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email address</label>
            <Input
              value={formData.personalInfo.email}
              onChange={(e) =>
                handleInputChange("personalInfo", "email", e.target.value)
              }
              placeholder="your@email.com"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Date of birth</label>
            <Input
              type="date"
              value={formData.personalInfo.dateOfBirth}
              onChange={(e) =>
                handleInputChange("personalInfo", "dateOfBirth", e.target.value)
              }
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <Select
              value={formData.personalInfo.gender}
              onValueChange={(value) =>
                handleInputChange("personalInfo", "gender", value)
              }
              disabled={!isEditing}
            >
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
            <Select
              value={formData.addressInfo.country}
              onValueChange={(value) =>
                handleInputChange("addressInfo", "country", value)
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="United states" />
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
            <Input
              value={formData.addressInfo.streetAddress}
              onChange={(e) =>
                handleInputChange(
                  "addressInfo",
                  "streetAddress",
                  e.target.value
                )
              }
              placeholder="e.g. 123 Main St."
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Apt, suite. (optional)
            </label>
            <Input
              value={formData.addressInfo.aptSuite}
              onChange={(e) =>
                handleInputChange("addressInfo", "aptSuite", e.target.value)
              }
              placeholder="e.g. Apt #123"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">City</label>
            <Input
              value={formData.addressInfo.city}
              onChange={(e) =>
                handleInputChange("addressInfo", "city", e.target.value)
              }
              placeholder="e.g. America #123"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              State / Province / County / Region
            </label>
            <Input
              value={formData.addressInfo.stateProvinceCountryRegion}
              onChange={(e) =>
                handleInputChange(
                  "addressInfo",
                  "stateProvinceCountryRegion",
                  e.target.value
                )
              }
              placeholder="e.g. State #123"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Zip code</label>
            <Input
              value={formData.addressInfo.zipCode}
              onChange={(e) =>
                handleInputChange("addressInfo", "zipCode", e.target.value)
              }
              placeholder="726 664 074"
              className="mt-1"
              disabled={!isEditing}
            />
          </div>
        </div>
      </Card>

      {/* About Me */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg font-medium mb-6">About Me</h2>
        <Textarea
          value={formData.aboutMe}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, aboutMe: e.target.value }))
          }
          className="min-h-[100px]"
          placeholder="Passionate about learning and sharing skills!..."
          disabled={!isEditing}
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
