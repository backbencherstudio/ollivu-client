"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Service } from "@/types/service.types";
import { serviceCategories } from "@/data/services";
import { CategorySidebar } from "./category-sidebar";
import { ServiceCard } from "./service-card";
import { Pagination } from "@/components/reusable/pagination";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import serviceImg from "@/public/client/services/service-01.png";
import avaterImg from "@/public/avatars/emily.png";
import { ChevronDown, X } from "lucide-react";

const ITEMS_PER_PAGE = 6;
const DEFAULT_SERVICE_IMAGE = serviceImg;
const DEFAULT_AVATAR_IMAGE = avaterImg;

interface CategoryItem {
  id: number;
  title: string;
  instructor: {
    image: any;
    name: any;
    location: string;
    email: string;
    languages: string[];
    totalReview: number;
    experience: any;
    about: string;
    description: string;
    status: string;
    isVerified: boolean;
  };
  rating: number;
  reviewCount: number;
  image: any;
}

interface Category {
  title: string;
  items: CategoryItem[];
}

export default function ServiceResultContent() {
  const searchParams = useSearchParams();
  const { data: users, isLoading } = useGetAllUsersQuery({});
  const allUsers = users?.data || [];
  console.log("all user", allUsers);
  

  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(
    searchParams.get("item")
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const allServices = React.useMemo(() => {
    if (typeof window === "undefined" || !allUsers.length) return [];

    return allUsers.flatMap((user: any) =>
      (user.my_service || []).map((service: string) => {
        const matchingCategory = serviceCategories.find((cat: Category) =>
          cat.items.some(
            (item: CategoryItem) =>
              item.title.toLowerCase() === String(service).toLowerCase()
          )
        );

        // Ensure proper URL construction for images
        const portfolioUrl = user.portfolio
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.portfolio.replace(/^\//, '')}`
          : DEFAULT_SERVICE_IMAGE.src;

        const profileImageUrl = user.profileImage
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.profileImage.replace(/^\//, '')}`
          : DEFAULT_AVATAR_IMAGE.src;

        return {
          id: `${user._id}-${service}`,
          title: service,
          instructor: {
            id: user._id,
            name: user.first_name,
            email: user.email,
            experience: "2+ years",
            image: profileImageUrl,
          },
          rating: user.rating || 0,
          reviewCount: user.review || 0,
          image: portfolioUrl,
          category: matchingCategory?.title || "Other",
        };
      })
    );
  }, [allUsers]);

  useEffect(() => {
    if (allServices.length > 0) {
      setServices(allServices);
    }
  }, [allServices]);

  const filteredServices = React.useMemo(() => {
    return services.filter((service) => {
      if (selectedItem) {
        return service.title.toLowerCase() === selectedItem.toLowerCase();
      }
      if (selectedCategory) {
        return service.category === selectedCategory;
      }
      return true;
    });
  }, [services, selectedItem, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedItem, selectedCategory]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 mt-5">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg flex items-center justify-between"
        >
          <span>Filter Categories</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-4 lg:mt-20">
        {/* Sidebar (mobile and desktop) */}
        <div
          className={`
            lg:w-1/4 fixed lg:relative inset-0 mt-16 lg:mt-0 z-30 lg:z-auto 
            transform transition-transform duration-300 ease-in-out 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
            bg-white lg:bg-transparent p-4 lg:p-0 overflow-y-auto lg:block
          `}
        >
          {/* Close Button for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <CategorySidebar
            selectedCategory={selectedCategory}
            selectedItem={selectedItem}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              setIsSidebarOpen(false);
            }}
            onItemSelect={(item) => {
              setSelectedItem(item);
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="lg:w-3/4 w-full">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {selectedItem || selectedCategory || "All Services"} (
              {filteredServices.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {paginatedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No services found</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
