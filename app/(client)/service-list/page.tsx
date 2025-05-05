"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import { useGetAllUserBaseOnSubCategoryQuery } from "@/src/redux/features/shared/categoryAPi";
import { useCreateExchangeMutation } from "@/src/redux/features/shared/exchangeApi";
import { useGetCurrentUserQuery } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowUpRight, X } from "lucide-react";
import UserList from "../_components/home-page/service-categories/UserList";
import SkillExchange from "../_components/home-page/service-categories/SkillExchange";
import SuccessMessage from "../_components/home-page/service-categories/SuccessMessage";

export default function ServiceList() {
  const { data: categories } = useGetAllCategoriesQuery({});
  const categoriesData = categories?.data;

  // States
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalStep, setModalStep] = useState<"none" | "users" | "success">(
    "none"
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  // const [selectedSkill, setSelectedSkill] = useState<string>("web development");

  // Fetch users based on selected service
  const { data: getUsersByService, isLoading: isLoadingUsers } =
    useGetAllUserBaseOnSubCategoryQuery(selectedService?.subCategory || "", {
      skip: !selectedService?.subCategory,
    });

  // Filter users who have the selected service
  const filteredUsers = getUsersByService?.data || [];

  // Get all unique subcategories for "All" tab
  const allSubCategories =
    categoriesData?.flatMap((category) =>
      category.subCategories.map((sub) => ({
        ...sub,
        parentCategory: category.category_name,
      }))
    ) || [];

  // Filter subcategories based on active category
  const filteredSubCategories =
    activeCategory === "All"
      ? allSubCategories
      : categoriesData?.find((cat) => cat.category_name === activeCategory)
          ?.subCategories || [];

  // Get current user data
  const currentUser = verifiedUser();
  const { data: currentUserData } = useGetCurrentUserQuery(currentUser?.userId);
  const currentUserInfo = currentUserData?.data;

  // Create exchange mutation
  const [createExchange] = useCreateExchangeMutation();

  // Handle user selection
  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle exchange click
  const handleExchangeClick = (service: any) => {
    setSelectedService(service);
    setModalStep("users");
    setSelectedUsers([]); // Reset selected users when opening modal
  };

  // Reset selections when modal closes
  const handleCloseModal = () => {
    setModalStep("none");
    setSelectedUsers([]);
    setSelectedService("");
    // setSelectedSkill("");

  };

  // Handle send request
  const handleSendRequest = async () => {
    try {
      const exchangeRequests = selectedUsers.map((userId) => ({
        senderUserId: currentUser?.userId,
        reciverUserId: userId,
        email: currentUser?.email,
        senderService: selectedService,
        my_service: currentUserInfo?.my_service,
      }));

      const response = await createExchange(exchangeRequests).unwrap();
      console.log("response", response?.data);

      if (response?.success) {
        setModalStep("success");
        toast.success("Exchange request sent successfully");

        // Reset after success
        setTimeout(() => {
          setModalStep("none");
          setSelectedUsers([]);
          setSelectedService("");
          // setSelectedSkill("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending exchange request:", error);
      toast.error("Failed to send exchange request");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center gap-10 mb-12">
        <h2 className="text-[40px] font-medium font-inter">
          Explore & Exchange: Your Marketplace for <br /> Services
        </h2>
      </div>

      <div className="mt-12">
        <div className="flex justify-center items-center mb-8">
          <h3 className="text-[48px] font-medium font-inter text-[#070707]">
            Service Categories
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex space-x-2 p-2 bg-gray-50 rounded-lg">
            <button
              onClick={() => setActiveCategory("All")}
              className={cn(
                "px-4 py-2 rounded-md transition-all",
                activeCategory === "All"
                  ? "bg-teal-500 text-white"
                  : "hover:bg-gray-200"
              )}
            >
              All
            </button>
            {categoriesData?.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.category_name)}
                className={cn(
                  "px-4 py-2 rounded-md transition-all whitespace-nowrap",
                  activeCategory === category.category_name
                    ? "bg-teal-500 text-white"
                    : "hover:bg-gray-200"
                )}
              >
                {category.category_name}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSubCategories.map((subCategory) => (
            <div
              key={subCategory._id}
              className="border border-[#20B894] rounded-2xl p-6 text-center hover:bg-[#F1FCF9] hover:text-[#070707] transition"
            >
              <div className="relative w-28 h-28 mx-auto mb-4 border rounded-full overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${subCategory.categoryImage}`}
                  alt={subCategory.subCategory}
                  fill
                  className="object-cover p-2 rounded-full"
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML = `
                      <div class="w-full h-full rounded-full bg-[#20B894] flex items-center justify-center text-white text-sm font-medium">
                        Category
                      </div>
                    `;
                  }}
                />
              </div>
              <h3 className="font-medium text-lg mb-4">
                {subCategory.subCategory}
              </h3>
              {activeCategory === "All" && (
                <p className="text-sm text-gray-600 mb-4">
                  {subCategory.parentCategory}
                </p>
              )}
              <div className="flex justify-center items-center">
                <button
                  onClick={() => handleExchangeClick(subCategory)}
                  className="flex items-center justify-center gap-2 text-sm border border-[#20B894] text-[#20B894] px-4 py-2 rounded-full hover:bg-[#20B894]/10 transition cursor-pointer"
                >
                  Exchange Service <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Exchange Modal */}
        {modalStep !== "none" && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full p-10 max-w-[70%] relative">
              <button
                className="absolute top-4 right-4 text-[#20B894] text-xl cursor-pointer"
                onClick={() => {
                  setModalStep("none");
                  setSelectedUsers([]);
                }}
              >
                <X className="h-6 w-6" />
              </button>

              {modalStep === "users" && (
                <>
                  <div className="bg-[#EDE3D9] p-5 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4">
                      Select Users for {selectedService?.subCategory}
                    </h3>
                    <UserList
                      users={filteredUsers}
                      selectedUsers={selectedUsers}
                      onUserToggle={handleUserToggle}
                      isLoading={isLoadingUsers}
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={handleSendRequest}
                        disabled={selectedUsers.length === 0}
                        className={`bg-[#20B894] text-white px-6 py-2 rounded-full cursor-pointer ${
                          selectedUsers.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#1a9677] ease-in-out duration-300"
                        }`}
                      >
                        Send Request
                      </button>
                      <button
                        onClick={() => setModalStep("none")}
                        className="border border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-50 cursor-pointer ease-in-out duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <SkillExchange
                    selectedService={selectedService}
                    selectedSkill={selectedService}
                    onSkillChange={selectedService}
                    users={filteredUsers}
                  />
                </>
              )}

              {modalStep === "success" && <SuccessMessage />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
