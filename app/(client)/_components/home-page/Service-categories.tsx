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

  // Add this state near your other state declarations
  const [isLoading, setIsLoading] = useState(false);

  // Modify the handleSendRequest function
  const handleSendRequest = async () => {
    if (!currentUser) {
      localStorage.setItem("selectedUsers", JSON.stringify(selectedUsers));
      localStorage.setItem(
        "selectedService",
        JSON.stringify({
          skill: selectedSkill,
          subCategory: selectedService.subCategory,
          serviceData: selectedService,
        })
      );
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      // Get the selected user's details - fixing the comparison
      const selectedUserDetails = allUsers.find(
        (user) => user._id === selectedUsers[0]
      );

      const exchangeRequests = selectedUsers.map((userId) => {
        // Find user details for each selected user
        const userDetails = allUsers.find((user) => user._id === userId);
        console.log("userDetails", userDetails);


        return {
          // senderUserId: currentUserInfo?._id,
          // reciverUserId: userId, // Use the actual selected user ID
          // email: userDetails?.email, // Use the found user's email
          // senderService: selectedSkill,
          // my_service: currentUserInfo?.my_service,
          senderUserId: currentUser?.userId,
          reciverUserId: userId,
          email: currentUser?.email,
          selectedEmail: userDetails?.email,
          senderService: selectedSkill,
          my_service: currentUserInfo?.my_service
        };
      });

      const response = await createExchange(exchangeRequests).unwrap();

      if (response?.success) {
        setModalStep("success");
        toast.success("Exchange request sent successfully");
      }
    } catch (error) {
      console.error("Error sending exchange request:", error);
      toast.error("Failed to send exchange request");
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to properly restore the state
  useEffect(() => {
    if (currentUser) {
      const storedUsers = localStorage.getItem("selectedUsers");
      const storedService = localStorage.getItem("selectedService");

      if (storedUsers && storedService) {
        const parsedUsers = JSON.parse(storedUsers);
        const parsedService = JSON.parse(storedService);

        // Restore all necessary states
        setSelectedUsers(parsedUsers);
        setSelectedSkill(parsedService.skill);
        setSelectedService(parsedService.serviceData);
        setModalStep("users");

        // Clean up storage
        localStorage.removeItem("selectedUsers");
        localStorage.removeItem("selectedService");
      }
    }
  }, [currentUser]);

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
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">

                    <button
                      onClick={handleSendRequest}
                      disabled={selectedUsers.length === 0 || isLoading}
                      className={`text-sm sm:text-base bg-[#20B894] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full cursor-pointer order-2 sm:order-1 ${selectedUsers.length === 0 || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#1a9677] ease-in-out duration-300"
                        }`}
                    >
                      {isLoading ? "Sending..." : "Send Request"}
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