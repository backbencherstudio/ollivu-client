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
import exchange from "@/public/service-list.png";
import { useRouter } from "next/navigation";

export default function ServiceList() {
  const { data: categories } = useGetAllCategoriesQuery({});
  const categoriesData = categories?.data;

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalStep, setModalStep] = useState<"none" | "users" | "success">(
    "none"
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Fetch users based on selected service
  const { data: getUsersByService, isLoading: isLoadingUsers } =
    useGetAllUserBaseOnSubCategoryQuery(selectedService?.subCategory || "", {
      skip: !selectedService?.subCategory,
    });

  const filteredUsers = getUsersByService?.data || [];

  const allSubCategories =
    categoriesData?.flatMap((category) =>
      category.subCategories.map((sub) => ({
        ...sub,
        parentCategory: category.category_name,
      }))
    ) || [];

  const filteredSubCategories =
    activeCategory === "All"
      ? allSubCategories
      : categoriesData?.find((cat) => cat.category_name === activeCategory)
          ?.subCategories || [];

  const currentUser = verifiedUser();
  const { data: currentUserData } = useGetCurrentUserQuery(currentUser?.userId);
  const currentUserInfo = currentUserData?.data;

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
  // Add useRouter at the top with other imports
  const router = useRouter();
  
  // Modify handleSendRequest function
  const handleSendRequest = async () => {
    if (!currentUser) {
      // Store selected users and service info before redirecting
      localStorage.setItem('selectedUsers', JSON.stringify(selectedUsers));
      localStorage.setItem('selectedService', JSON.stringify({
        skill: selectedService?.subCategory,
        subCategory: selectedService?.subCategory,
        serviceData: selectedService,
        activeCategory: activeCategory // Store active category to restore tab state
      }));
      localStorage.setItem('redirectPath', '/service-list'); // Add this line
      router.push('/auth/login');
      return;
    }

    try {
      const exchangeRequests = selectedUsers.map((userId) => ({
        senderUserId: currentUser?.userId,
        senderImage: currentUserInfo?.profileImage,
        reciverUserId: userId,
        reciverImage: userDetails?.profileImage,
        email: currentUser?.email,
        senderService: selectedService?.subCategory,
        my_service: currentUserInfo?.my_service,
      }));

      const response = await createExchange(exchangeRequests).unwrap();

      if (response?.success) {
        setModalStep("success");
        toast.success("Exchange request sent successfully");

        setTimeout(() => {
          setModalStep("none");
          setSelectedUsers([]);
          setSelectedService("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending exchange request:", error);
      toast.error("Failed to send exchange request");
    }
  };
  
  // Add useEffect to restore state after login
  useEffect(() => {
    if (currentUser) {
      const storedUsers = localStorage.getItem('selectedUsers');
      const storedService = localStorage.getItem('selectedService');
      
      if (storedUsers && storedService) {
        const parsedUsers = JSON.parse(storedUsers);
        const parsedService = JSON.parse(storedService);
        
        // Restore all states
        setSelectedUsers(parsedUsers);
        setSelectedService(parsedService.serviceData);
        setActiveCategory(parsedService.activeCategory || "All");
        setModalStep("users");
        
        // Clean up storage
        localStorage.removeItem('selectedUsers');
        localStorage.removeItem('selectedService');
      }
    }
  }, [currentUser]);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mb-8 md:mb-12">
        <div className="text-center md:text-left mt-5 md:mt-0">
          <h2 className="text-3xl md:text-[40px] font-medium font-inter leading-tight">
            Explore & Exchange: Your Marketplace{" "}
            <br className="hidden md:block" /> for Services
          </h2>
        </div>
        <div className="w-full md:w-auto">
          <Image
            src={exchange}
            alt="Exchange"
            width={400}
            height={400}
            className="w-full max-w-[300px] md:max-w-[400px] mx-auto"
          />
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <div className="flex justify-center items-center mb-6 md:mb-8">
          <h3 className="text-3xl sm:text-4xl md:text-[48px] font-medium font-inter text-[#070707]">
            Service Categories
          </h3>
        </div>

        {/* Category Tabs */}
        <div className="container mx-auto mb-6 md:mb-8">
          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-3 p-2 bg-[#F9F9F9] rounded-xl">
            <button
              onClick={() => setActiveCategory("All")}
              className={cn(
                "px-6 py-3 rounded-md transition-all cursor-pointer text-[16px] font-medium",
                activeCategory === "All"
                  ? "bg-[#20B894] text-white"
                  : "text-[#777980] hover:bg-gray-100"
              )}
            >
              All
            </button>
            {categoriesData?.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.category_name)}
                className={cn(
                  "px-6 py-3 rounded-md transition-all cursor-pointer text-[16px] font-medium",
                  activeCategory === category.category_name
                    ? "bg-[#20B894] text-white"
                    : "text-[#777980] hover:bg-gray-100"
                )}
              >
                {category.category_name}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-10 mb-10">
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
            <div className="bg-white rounded-2xl w-full p-4 md:p-10 max-w-[95%] md:max-w-[70%] relative">
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
