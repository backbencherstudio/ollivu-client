"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Service } from "@/types/service.types";
import { serviceCategories } from "@/data/services";
import { CategorySidebar } from "./_components/category-sidebar";
import { ServiceCard } from "./_components/service-card";
import Image from "next/image";

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
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Updated filtering logic
  const filteredServices = services.filter((service) => {
    if (selectedItem) {
      return service.title === selectedItem;
    }
    if (selectedCategory) {
      return service.category === selectedCategory;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-6 mt-20">
        {/* Sidebar */}
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
            <p>2 Filters applied Clear All</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
