"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Service } from "@/types/service.types";
import { serviceCategories } from "@/data/services";
import { CategorySidebar } from "./category-sidebar";
import { ServiceCard } from "./service-card";
import { Pagination } from "@/components/reusable/pagination";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import serviceImg from '@/public/client/services/service-01.png'
import avaterImg from '@/public/avatars/emily.png'

const ITEMS_PER_PAGE = 6;
const DEFAULT_SERVICE_IMAGE = serviceImg;
const DEFAULT_AVATAR_IMAGE = avaterImg

// Add interface for category structure
// Update the Category interface to match the actual structure
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
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(
    searchParams.get("item")
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize allServices and other calculations
  const allServices = React.useMemo(() => {
    if (typeof window === 'undefined' || !allUsers.length) return [];

    return allUsers.flatMap((user: any) => 
      (user.my_service || []).map((service: string) => {
        const matchingCategory = serviceCategories.find((cat: Category) => 
          cat.items.some((item: CategoryItem) => 
            item.title.toLowerCase() === String(service).toLowerCase()
          )
        );

        // Handle image URL
        const imageUrl = user.portfolio 
          ? user.portfolio.startsWith('http') || user.portfolio.startsWith('/') 
            ? user.portfolio 
            : DEFAULT_SERVICE_IMAGE
          : DEFAULT_SERVICE_IMAGE;

        return {
          id: `${user._id}-${service}`,
          title: service,
          instructor: {
            id: user._id,
            name: user.first_name,
            email: user.email,
            experience: "2+ years",
            image: DEFAULT_AVATAR_IMAGE
          },
          rating: user.rating || 4.5,
          reviewCount: user.review || 0,
          image: imageUrl,
          category: matchingCategory?.title || "Other",
        };
      })
    );
  }, [allUsers]);

  // Update services when allServices changes
  useEffect(() => {
    if (allServices.length > 0) {
      setServices(allServices);
    }
  }, [allServices]);

  // Single filteredServices declaration using useMemo
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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedItem, selectedCategory]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-6 mt-20">
        <div className="w-1/4 my-7">
          <CategorySidebar
            selectedCategory={selectedCategory}
            selectedItem={selectedItem}
            onCategorySelect={setSelectedCategory}
            onItemSelect={setSelectedItem}
          />
        </div>

        <div className="w-3/4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedItem || selectedCategory || "All Services"} (
              {filteredServices.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}