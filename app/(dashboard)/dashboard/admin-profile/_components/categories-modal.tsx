'use client';

import { X, Plus, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "@/src/redux/features/categories/categoriesApi";
import { useCreateSubCategoryMutation, useRemoveSubCategoryMutation } from "@/src/redux/features/categories/subCategoryApi";

interface SubCategory {
  name: string;
  image: string | null;
}

interface Category {
  name: string;
  subCategories: SubCategory[];
  currentInput: string;
}

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (categories: Omit<Category, 'currentInput'>[]) => void;
}

export function CategoriesModal({ isOpen, onClose, onSave }: CategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>([
    { name: '', subCategories: [], currentInput: '' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImageUploadIndex, setCurrentImageUploadIndex] = useState<{category: number, sub: number} | null>(null);

  const [createCategory] = useCreateCategoryMutation()
  const [subCategoryApi] = useCreateSubCategoryMutation()
  const [removeSubCategory] = useRemoveSubCategoryMutation()

  const handleAddCategory = () => {
    if (categories.some(cat => !cat.name.trim())) {
      toast.error("Please fill in the existing category name first");
      return;
    }
    setCategories([...categories, { name: '', subCategories: [], currentInput: '' }]);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index].name = value;
    setCategories(newCategories);
  };

  const handleSubCategoryInputChange = (categoryIndex: number, value: string) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].currentInput = value;
    setCategories(newCategories);
  };

  const handleAddSubCategory = (categoryIndex: number) => {
    const category = categories[categoryIndex];
    if (!category.currentInput.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }
    
    if (category.subCategories.some(sub => sub.name.toLowerCase() === category.currentInput.toLowerCase())) {
      toast.error("This subcategory already exists");
      return;
    }
    
    const newCategories = [...categories];
    newCategories[categoryIndex].subCategories.push({
      name: category.currentInput,
      image: null
    });
    newCategories[categoryIndex].currentInput = '';
    setCategories(newCategories);
  };

  const handleRemoveSubCategory = (categoryIndex: number, subCategoryIndex: number) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].subCategories.splice(subCategoryIndex, 1);
    setCategories(newCategories);
  };

  const handleRemoveCategory = (index: number) => {
    if (categories.length === 1) {
      toast.error("You must have at least one category");
      return;
    }
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleImageUpload = (categoryIndex: number, subIndex: number) => {
    setCurrentImageUploadIndex({ category: categoryIndex, sub: subIndex });
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentImageUploadIndex) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newCategories = [...categories];
        newCategories[currentImageUploadIndex.category].subCategories[currentImageUploadIndex.sub].image = base64;
        setCategories(newCategories);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    // Validate categories
    if (categories.some(cat => !cat.name.trim())) {
      toast.error("Please fill in all category names");
      return;
    }

    if (categories.some(cat => cat.subCategories.length === 0)) {
      toast.error("Each category must have at least one subcategory");
      return;
    }

    if (categories.some(cat => cat.subCategories.some(sub => !sub.image))) {
      toast.error("Please add images for all subcategories");
      return;
    }

    const formattedCategories = categories.map(cat => ({
      name: cat.name,
      subCategories: cat.subCategories
    }));
    
    onSave?.(formattedCategories);
    console.log('Categories Data:', formattedCategories);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[600px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Categories</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Category name"
                value={category.name}
                onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
                className="bg-white"
              />
              <button 
                onClick={() => handleRemoveCategory(categoryIndex)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {category.subCategories.map((subCategory, subIndex) => (
                <div key={subIndex} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                  <div 
                    className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden hover:bg-gray-200 transition-colors"
                    onClick={() => handleImageUpload(categoryIndex, subIndex)}
                    style={{ cursor: 'pointer' }}
                  >
                    {subCategory.image ? (
                      <img 
                        src={subCategory.image} 
                        alt={subCategory.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <span className="flex-1 font-medium">{subCategory.name}</span>
                  <button 
                    onClick={() => handleRemoveSubCategory(categoryIndex, subIndex)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add sub-category"
                  value={category.currentInput}
                  onChange={(e) => handleSubCategoryInputChange(categoryIndex, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSubCategory(categoryIndex);
                    }
                  }}
                  className="bg-white"
                />
                <Button 
                  onClick={() => handleAddSubCategory(categoryIndex)}
                  className="bg-[#20B894] text-white hover:bg-[#1ca883]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <Button
            onClick={handleAddCategory}
            variant="outline"
            className="text-[#20B894] border-[#20B894]"
          >
            Add Category
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#20B894] text-white hover:bg-[#1ca883]"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}