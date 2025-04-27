"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "../_components/user-avater";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import { CategoriesModal } from "./_components/categories-modal";

export default function AdminProfile() {
  const { user } = useSelector((state: any) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Add this new state for categories modal
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: "Jackob",
    lastName: "Gerrald",
    email: "katie_sims@gmail.com",
    phoneNumber: "+45983280932",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Updated Profile Data:", formData);
    setIsEditing(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Add this state to handle client-side rendering
  const [isClient, setIsClient] = useState(false);

  // Add useEffect to handle client-side initialization
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add imageUrl state
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        // Remove the data:image prefix to get just the base64 string
        const base64String = base64.split(",")[1];
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 ">
      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            {isClient && (
              <UserAvatar
                user={{
                  ...user,
                  profileImage: selectedImage
                    ? `/api/images/${selectedImage}`
                    : user?.profileImage,
                }}
                size={80}
              />
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium">Jackob Gerrald</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Personal Information Section */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium ">Personal Information</h2>
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

        {/* Service Categories Section */}
        <div className="bg-white rounded-xl p-6">
          <div className="">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Add Service Categories</h2>
              <p className="text-sm text-gray-500 mt-1">
                Specify the services that users will be able to exchange on the
                platform.
              </p>
            </div>
            <Button
              className="bg-[#20B894] text-white hover:bg-[#1ca883]"
              onClick={() => setIsCategoriesModalOpen(true)}
            >
              Add categories
            </Button>
          </div>
        </div>

        <CategoriesModal
          isOpen={isCategoriesModalOpen}
          onClose={() => setIsCategoriesModalOpen(false)}
        />
      </div>
    </div>
  );
}
