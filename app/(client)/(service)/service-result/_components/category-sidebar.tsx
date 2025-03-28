import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Star } from 'lucide-react';
import { serviceCategories } from '@/data/services';

interface CategorySidebarProps {
  selectedCategory: string | null;
  selectedItem: string | null;
  onCategorySelect: (category: string | null) => void;
  onItemSelect: (item: string | null) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  selectedCategory, 
  selectedItem,
  onCategorySelect,
  onItemSelect
}) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const toggleCategory = (categoryTitle: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryTitle)
        ? prev.filter(title => title !== categoryTitle)
        : [...prev, categoryTitle]
    );
    onCategorySelect(categoryTitle);
    onItemSelect(null); // Reset selected item when category changes
  };

  const handleItemClick = (categoryTitle: string, itemTitle: string) => {
    onCategorySelect(categoryTitle);
    onItemSelect(itemTitle);
  };

  const isOpen = (categoryTitle: string) => openCategories.includes(categoryTitle);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  const handleLocationReset = () => {
    setLocation('');
  };

  const handleRatingReset = () => {
    setSelectedRating(null);
  };

  return (
    <div className=" p-4 bg-gray-50 border border-[#D2B9A1] rounded-lg">
      <input 
        type="search" 
        placeholder="Search" 
        className="w-full p-2 border border-[#D2B9A1] rounded-full mb-4" 
      />

      {/* Categories Section - Scrollable */}
      <div className="mb-6 ">
        <h2 className="text-lg font-semibold mb-4 text-[#070707]">Categories</h2>
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2">
          {/* All Services Option */}
          <div 
            className={`p-2 cursor-pointer rounded ${
              !selectedCategory && !selectedItem
                ? 'bg-teal-500 text-white' 
                : 'hover:bg-gray-200'
            }`}
            onClick={() => {
              onCategorySelect(null);
              onItemSelect(null);
              setOpenCategories([]);
            }}
          >
            All Services
          </div>

          {/* Categories with Dropdowns */}
          {serviceCategories.map((category) => (
            <div key={category.title} className="mb-2">
              <div 
                className={`p-2 cursor-pointer rounded flex justify-between items-center ${
                  selectedCategory === category.title && !selectedItem
                    ? 'bg-teal-500 text-white' 
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => toggleCategory(category.title)}
              >
                <span>{category.title}</span>
                {isOpen(category.title) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {/* Dropdown Items */}
              {isOpen(category.title) && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.items.map((service) => (
                    <div
                      key={service.id}
                      className={`block p-2 text-sm rounded cursor-pointer ${
                        selectedItem === service.title
                          ? 'bg-teal-500 text-white'
                          : 'text-gray-600 hover:text-teal-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handleItemClick(category.title, service.title)}
                    >
                      {service.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location Section */}
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
            className="w-full pl-10 p-2 border border-[#D2B9A1] rounded-full" 
          />
        </div>
      </div>

      {/* Ratings Section */}
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
                selectedRating === rating ? 'bg-teal-500 text-white' : 'hover:bg-gray-200'
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
                        ? selectedRating === rating ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
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