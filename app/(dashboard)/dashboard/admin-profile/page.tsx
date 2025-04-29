"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "../_components/user-avater";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import { CategoriesModal } from "./_components/categories-modal";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  const validUser = verifiedUser();
  const [updateUser] = useUpdateUserMutation();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  console.log("formData", formData);
  

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (singleUserData) {
      setFormData({
        firstName: singleUserData.first_name || "",
        lastName: singleUserData.last_name || "",
        email: singleUserData.email || "",
        phoneNumber: singleUserData.phone_number || "",
      });
    }
  }, [singleUserData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append("profileImage", selectedImage);
      }

      // Add user data with correct field names
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phoneNumber);
      formDataToSend.append("userId", validUser?.userId);

      const response = await updateUser(formDataToSend).unwrap();
      console.log("response", response);

      if (response.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
            {selectedImage || singleUserData?.profileImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${singleUserData?.profileImage}`
                  }
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `
                      <div class="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold rounded-full">
                        ${
                          singleUserData?.first_name
                            ?.slice(0, 2)
                            ?.toUpperCase() || "UN"
                        }
                      </div>
                    `;
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold rounded-full">
                {singleUserData?.first_name?.slice(0, 2)?.toUpperCase() || "UN"}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium">
              {singleUserData?.first_name} {singleUserData?.last_name}
            </h2>
            {isEditing && (
              <div className="flex gap-2 mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Button
                  variant="outline"
                  className="bg-[#20B894] text-white hover:bg-[#1ca883] cursor-pointer"
                  onClick={handleImageClick}
                >
                  Replace Photo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Personal Information</h2>
          <Button
            variant="ghost"
            className="text-[#20B894] hover:text-[#1ca883] p-2 h-auto"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Pencil className="h-4 w-4" /> {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">First name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="bg-white"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Last name</label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="bg-white"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Email address</label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-white"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Phone number</label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="bg-white"
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />
    </div>
  );
}
