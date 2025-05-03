import React, { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import { useGetAllUsersQuery } from "@/src/redux/features/users/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";

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
  const searchParams = useSearchParams();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if a rating is in URL on component mount
  useEffect(() => {
    const ratingParam = searchParams.get("rating");
    if (ratingParam) {
      setSelectedRating(Number(ratingParam));
    }
  }, []);

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

  const isOpen = (categoryTitle: string) =>
    openCategories.includes(categoryTitle);

  // Update the debounced filter function
  const debouncedFilter = useCallback(
    debounce(
      (params: {
        location?: string;
        rating?: number | null;
        searchTerm?: string;
        my_service?: string;
      }) => {
        const urlParams = new URLSearchParams();
        if (params.searchTerm)
          urlParams.append("searchTerm", params.searchTerm);
        if (params.my_service)
          urlParams.append("my_service", params.my_service);
        if (params.location) urlParams.append("country", params.location);
        if (params.rating) urlParams.append("rating", params.rating.toString());

        router.push(`/service-result?${urlParams.toString()}`);
      },
      500
    ),
    [router]
  );

  // Replace multiple queries with single query
  const { data: filteredUsers, isLoading: isFilteredDataLoading } =
    useGetAllUsersQuery(
      {
        searchTerm: searchTerm || undefined,
        my_service: selectedItem || selectedCategory || undefined,
        country: location || undefined,
        rating: selectedRating || undefined,
      },
      {
        skip: false,
      }
    );

  // Update search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFilter({
      searchTerm: value,
      my_service: selectedItem || selectedCategory || undefined,
      country: location,
      rating: selectedRating,
    });
  };

  // Update location handler
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    debouncedFilter({
      searchTerm,
      my_service: selectedItem || selectedCategory || undefined,
      country: value,
      rating: selectedRating,
    });
  };

  // Update rating handler
  const handleRatingSelect = (rating: number) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);

    const params = {
      rating: newRating || undefined,
    };

    router.push(
      `/service-result${
        new URLSearchParams(params as any).toString()
          ? `?${new URLSearchParams(params as any).toString()}`
          : ""
      }`
    );
  };

  // Add effect to handle filtered data updates
  useEffect(() => {
    if (filteredUsers?.data) {
      // Filter by rating if selected
      const filteredResults = selectedRating
        ? filteredUsers.data.filter(
            (user: any) => user.rating === selectedRating
          )
        : filteredUsers.data;

      // Update UI through parent component
      onServiceFilter(filteredResults);
    }
  }, [filteredUsers, selectedRating, onServiceFilter]);

  // Update reset handlers
  const handleLocationReset = () => {
    setLocation("");
    debouncedFilter({
      searchTerm,
      my_service: selectedItem || selectedCategory || undefined,
      country: "",
      rating: selectedRating,
    });
  };

  const handleRatingReset = () => {
    setSelectedRating(null);

    // Immediate UI update
    if (filteredUsers?.data) {
      onServiceFilter(filteredUsers.data);
    }

    debouncedFilter({
      searchTerm,
      my_service: selectedItem || selectedCategory || undefined,
      country: location,
      rating: null,
    });
  };

  // Enhanced useEffect to handle route changes
  useEffect(() => {
    // Check if URL has no query parameters
    if (!searchParams.toString()) {
      // Reset all filters and states
      onCategorySelect(null);
      onItemSelect(null);
      setOpenCategories([]);
      setSearchTerm("");
      setLocation("");
      setSelectedRating(null);
      onServiceFilter([]); // Reset service filter
    } else {
      // Check if there's a rating in the URL
      const ratingParam = searchParams.get("rating");
      if (ratingParam) {
        setSelectedRating(Number(ratingParam));
      }
    }
  }, [searchParams, onCategorySelect, onItemSelect, onServiceFilter]);

  // Add this keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const uniqueServices = Array.from(
      new Set(
        filteredUsers?.data
          ?.flatMap((result: any) => result.my_service)
          ?.filter((service: string) =>
            service?.toLowerCase().includes(searchTerm?.toLowerCase())
          )
      )
    );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < uniqueServices.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && uniqueServices[selectedIndex]) {
          const selectedService = uniqueServices[selectedIndex] as string;
          handleServiceSelect(selectedService);
        }
        break;
    }
  };

  // Add this function to handle service selection
  const handleServiceSelect = (uniqueService: string) => {
    setSearchTerm("");

    const parentCategory = categories.find((cat) =>
      cat.subCategories?.some((sub: any) => sub.subCategory === uniqueService)
    );

    if (parentCategory) {
      onCategorySelect(parentCategory.category_name);
      onItemSelect(uniqueService);
      setOpenCategories([parentCategory.category_name]);
    } else {
      onCategorySelect(uniqueService);
      onItemSelect(null);
      setOpenCategories([uniqueService]);
    }

    router.push(
      `/service-result?my_service=${encodeURIComponent(uniqueService)}`
    );
  };

  return (
    <div className="p-4 bg-gray-50 border border-[#D2B9A1] rounded-lg w-full sm:w-[300px]">
      <div className="relative">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Search services..."
          className="w-full p-2 border border-[#D2B9A1] rounded-full mb-4 text-sm"
        />

        {/* Search Results Dropdown */}
        {filteredUsers?.data?.length > 0 && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {Array.from(
              new Set(
                filteredUsers?.data
                  ?.flatMap((result: any) => result.my_service)
                  ?.filter((service: string) =>
                    service?.toLowerCase().includes(searchTerm?.toLowerCase())
                  )
              )
            )?.map((uniqueService: string, index) => (
              <div
                key={uniqueService}
                className={`p-2 cursor-pointer text-sm ${
                  index === selectedIndex
                    ? "bg-teal-500 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleServiceSelect(uniqueService)}
              >
                <div>{uniqueService}</div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isFilteredDataLoading && searchTerm && (
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
              !selectedCategory && !selectedItem && !selectedRating
                ? "bg-teal-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              // Clear all filters including rating
              onCategorySelect(null);
              onItemSelect(null);
              setOpenCategories([]);
              setSearchTerm("");
              setLocation("");
              setSelectedRating(null);

              // Reset URL completely
              router.push("/service-result");
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
            onChange={handleLocationChange}
            className="w-full pl-10 p-2 border border-[#D2B9A1] rounded-full text-sm"
          />
        </div>
      </div>

      {/* Ratings Filter with Loading Indicator */}
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

        {isFilteredDataLoading && (
          <div className="text-sm text-gray-500 text-center mb-2">
            Loading filtered results...
          </div>
        )}

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
