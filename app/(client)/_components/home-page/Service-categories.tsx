"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  useGetAllCategoryQuery,
  useGetAllUserBaseOnSubCategoryQuery,
} from "@/src/redux/features/shared/categoryAPi";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import CategoryCard from "./service-categories/CategoryCard";
import UserList from "./service-categories/UserList";
import SkillExchange from "./service-categories/SkillExchange";
import SuccessMessage from "./service-categories/SuccessMessage";
import { useCreateExchangeMutation } from "@/src/redux/features/shared/exchangeApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetCurrentUserQuery } from "@/src/redux/features/users/userApi";
import { toast } from "sonner";

export default function ServiceExchangeFlow() {
  const [modalStep, setModalStep] = useState<
    "none" | "exchange" | "users" | "success"
  >("none");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("Web Development");
  const [showAll, setShowAll] = useState(false);
  const [selectedService, setSelectedService] = useState<any>({
    subCategory: "",
    categoryImage: "",
    _id: "",
    my_service: [],
  });

  const { data: getAllCategory } = useGetAllCategoryQuery([]);
  const allCategories = getAllCategory?.data || [];
  console.log("allCategories", allCategories);

  const { data: getAllUserBaseOnSubCategory, isLoading: isLoadingUsers } =
    useGetAllUserBaseOnSubCategoryQuery(selectedService.subCategory, {
      skip: !selectedService.subCategory,
    });

  const allUsers = getAllUserBaseOnSubCategory?.data || [];

  const [createExchange] = useCreateExchangeMutation();

  const currentUser = verifiedUser();
  const { data: currentUserData } = useGetCurrentUserQuery(currentUser?.userId);
  const currentUserInfo = currentUserData?.data;

  // Update the handleExchangeClick function
  const handleExchangeClick = (service: any) => {
    setSelectedService(service);
    setModalStep("users");
    setSelectedUsers([]); // Reset selected users when changing category
  };
  console.log("currentUserInfo", currentUserInfo);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const displayedCategories = showAll
    ? allCategories
    : allCategories.slice(0, 8);

  const handleSendRequest = async () => {
    try {
      const exchangeRequests = selectedUsers.map(userId => ({
        senderUserId: currentUser?.userId,
        reciverUserId: userId,
        email: currentUser?.email,
        senderService: selectedSkill,
        my_service: currentUserInfo?.my_service
      }));

      const response = await createExchange(exchangeRequests).unwrap();
      console.log("response", response?.data);
      

      if (response?.success) {
        setModalStep("success");
        toast.success("Exchange request sent successfully");
      }
    } catch (error) {
      console.error("Error sending exchange request:", error);
      toast.error("Failed to send exchange request");
    }
  };

  return (
    <>
      <section className="bg-white text-[#4A4C56] px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Service Categories
        </h2>
        <div className="grid grid-cols-1 text-center sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onExchangeClick={handleExchangeClick}
            />
          ))}
        </div>
      </section>

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
                    Select Specific Users
                  </h3>
                  <UserList
                    users={allUsers}
                    selectedUsers={selectedUsers}
                    onUserToggle={handleUserToggle}
                    isLoading={isLoadingUsers}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleSendRequest}
                      disabled={selectedUsers.length === 0}
                      className={`bg-[#20B894] text-white px-6 py-2 rounded-full cursor-pointer ${
                        selectedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a9677] ease-in-out duration-300'
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
                  selectedSkill={selectedSkill}
                  onSkillChange={setSelectedSkill}
                  users={allUsers}
                />
              </>
            )}

            {modalStep === "success" && <SuccessMessage />}
          </div>
        </div>
      )}

      {/* Only show the View All button if there are more than 8 categories */}
      {allCategories.length > 8 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#20B894] text-white text-sm font-medium px-6 py-3 rounded-full flex items-center gap-2 mx-auto hover:opacity-90 transition"
          >
            {showAll ? "View Less" : "View All"}
          </button>
        </div>
      )}
    </>
  );
}
