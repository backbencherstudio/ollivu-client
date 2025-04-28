import React, { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import { useGetAllUsersByServiceQuery } from "@/src/redux/features/users/userApi";
import { useSearchUsersQuery } from "@/src/redux/features/users/userApi";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface CategorySidebarProps {
  selectedCategory: string | null;
  selectedItem: string | null;
  onCategorySelect: (category: string | null) => void;
  onItemSelect: (item: string | null) => void;
  onServiceFilter: (services: any[]) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  selectedItem,
  onCategorySelect,
  onItemSelect,
  onServiceFilter,
}) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { data: getAllCategories } = useGetAllCategoriesQuery(undefined);
  const categories = getAllCategories?.data || [];
  const router = useRouter();

  const toggleCategory = (categoryTitle: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryTitle)
        ? prev.filter((title) => title !== categoryTitle)
        : [...prev, categoryTitle]
    );

    const currentCategory = categories.find(
      (cat) => cat.category_name === categoryTitle
    );

    if (currentCategory?.subCategories?.length > 0) {
      const firstSubCategory = currentCategory.subCategories[0].subCategory;
      onCategorySelect(categoryTitle);
      onItemSelect(firstSubCategory);
      router.push(
        `/service-result?my_service=${encodeURIComponent(firstSubCategory)}`
      );
    } else {
      onCategorySelect(categoryTitle);
      onItemSelect(null);
      router.push(
        `/service-result?my_service=${encodeURIComponent(categoryTitle)}`
      );
    }
  };

  const handleItemClick = (categoryTitle: string, itemTitle: string) => {
    onCategorySelect(categoryTitle);
    onItemSelect(itemTitle);
    router.push(`/service-result?my_service=${encodeURIComponent(itemTitle)}`);
  };

  // Update All Services click handler
  // <div
  //   className={`p-2 cursor-pointer rounded text-sm ${
  //     !selectedCategory && !selectedItem
  //       ? "bg-teal-500 text-white"
  //       : "hover:bg-gray-200"
  //   }`}
  //   onClick={() => {
  //     onCategorySelect(null);
  //     onItemSelect(null);
  //     setOpenCategories([]);
  //     router.push('/service-result');
  //   }}
  // >
  //   All Services
  // </div>

  const { data: filteredUsers } = useGetAllUsersByServiceQuery(
    selectedItem || selectedCategory || "",
    { skip: !selectedCategory && !selectedItem }
  );

  useEffect(() => {
    if (filteredUsers?.data) {
      onServiceFilter(filteredUsers.data);
    }
  }, [filteredUsers, onServiceFilter]);

  const isOpen = (categoryTitle: string) =>
    openCategories.includes(categoryTitle);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  const handleLocationReset = () => {
    setLocation("");
  };

  const handleRatingReset = () => {
    setSelectedRating(null);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults, isLoading: isSearching } = useSearchUsersQuery(
    searchTerm,
    {
      skip: searchTerm.length < 1,
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const searchParams = useSearchParams();

  // Add effect to handle URL changes
  useEffect(() => {
    const myService = searchParams.get("my_service");
    if (!myService) {
      onCategorySelect(null);
      onItemSelect(null);
      onServiceFilter([]);
      setOpenCategories([]);
      setSearchTerm("");
    }
  }, [searchParams, onCategorySelect, onItemSelect, onServiceFilter]);

  return (
    <div className="p-4 bg-gray-50 border border-[#D2B9A1] rounded-lg w-full sm:w-[300px]">
      <div className="relative">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search services..."
          className="w-full p-2 border border-[#D2B9A1] rounded-full mb-4 text-sm"
        />

        {/* Search Results Dropdown */}
        {searchResults?.data?.length > 0 && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults?.data
              ?.filter((result: any) =>
                result?.my_service?.some((service: string) =>
                  service?.toLowerCase().includes(searchTerm?.toLowerCase())
                )
              )
              ?.map((result: any) => (
                <div
                  key={result?._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    const matchedService = result?.my_service?.find(
                      (service: string) =>
                        service
                          ?.toLowerCase()
                          .includes(searchTerm?.toLowerCase())
                    );

                    if (matchedService) {
                      // Update both category and item for proper filtering
                      const category = categories.find((cat) =>
                        cat.subCategories?.some(
                          (sub: any) =>
                            sub.subCategory.toLowerCase() ===
                            matchedService.toLowerCase()
                        )
                      );

                      if (category) {
                        const subCategory = category.subCategories.find(
                          (sub: any) =>
                            sub.subCategory.toLowerCase() ===
                            matchedService.toLowerCase()
                        );

                        if (subCategory) {
                          onCategorySelect(category.category_name);
                          onItemSelect(matchedService);
                        } else {
                          onCategorySelect(matchedService);
                          onItemSelect(null);
                        }
                      }

                      setSearchTerm(matchedService);
                      router.push(
                        `/service-result?my_service=${encodeURIComponent(
                          matchedService
                        )}`
                      );
                    }
                  }}
                >
                  <div className="text-gray-600">
                    {result.my_service
                      .filter((service: string) =>
                        service.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .join(", ")}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Loading State */}
        {isSearching && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
            Searching...
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-[#070707]">
          Categories
        </h2>
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2">
          {/* All Services Option */}
          <div
            className={`p-2 cursor-pointer rounded text-sm ${
              !selectedCategory && !selectedItem
                ? "bg-teal-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              onCategorySelect(null);
              onItemSelect(null);
              setOpenCategories([]);
            }}
          >
            All Services
          </div>

          {/* Dynamic Categories and SubCategories */}
          {categories.map((category) => (
            <div key={category._id} className="mb-2">
              <div
                className={`p-2 cursor-pointer rounded flex justify-between items-center text-sm ${
                  selectedCategory === category.category_name && !selectedItem
                    ? "bg-teal-500 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => toggleCategory(category.category_name)}
              >
                <span>{category.category_name}</span>
                {category.subCategories?.length > 0 ? (
                  isOpen(category.category_name) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )
                ) : null}
              </div>

              {isOpen(category.category_name) && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.subCategories?.length > 0 ? (
                    category.subCategories.map((sub: any) => (
                      <div
                        key={sub._id}
                        className={`block p-2 text-sm rounded cursor-pointer ${
                          selectedItem === sub.subCategory
                            ? "bg-teal-500 text-white"
                            : "text-gray-600 hover:text-teal-600 hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          handleItemClick(
                            category.category_name,
                            sub.subCategory
                          )
                        }
                      >
                        {sub.subCategory}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 p-2">
                      No subcategories available
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#070707]">Location</h2>
          <button
            onClick={handleLocationReset}
            className="text-xs text-teal-600 hover:text-teal-700"
          >
            Reset
          </button>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Enter post code/location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 p-2 border border-[#D2B9A1] rounded-full text-sm"
          />
        </div>
      </div>

      {/* Ratings Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#070707]">Ratings</h2>
          <button
            onClick={handleRatingReset}
            className="text-xs text-teal-600 hover:text-teal-700"
          >
            Reset
          </button>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              onClick={() => handleRatingSelect(rating)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                selectedRating === rating
                  ? "bg-teal-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedRating === rating}
                readOnly
                className="rounded border-gray-300"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < rating
                        ? selectedRating === rating
                          ? "fill-white text-white"
                          : "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2">({rating}.0)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
