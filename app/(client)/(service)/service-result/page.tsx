"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Service } from "@/types/service.types";
import { serviceCategories } from "@/data/services";
import { CategorySidebar } from "./_components/category-sidebar";
import { ServiceCard } from "./_components/service-card";
import { Pagination } from "@/components/reusable/pagination";

const ITEMS_PER_PAGE = 6; 

const ServicesPage = () => {
  const searchParams = useSearchParams();
  const allServices = serviceCategories.flatMap((category) =>
    category.items.map((service) => ({
      ...service,
      category: category.title,
    }))
  );

  const [services] = useState<Service[]>(allServices);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(
    searchParams.get("item")
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Update filtering logic to match exact item title
  const filteredServices = services.filter((service) => {
    if (selectedItem) {
      return service.title.toLowerCase() === selectedItem.toLowerCase();
    }
    if (selectedCategory) {
      return service.category === selectedCategory;
    }
    return true;
  });

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedItem, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

        {/* Main Content */}
        <div className="w-3/4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedItem || selectedCategory || "All Services"} (
              {filteredServices.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Pagination */}
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
};

export default ServicesPage;
