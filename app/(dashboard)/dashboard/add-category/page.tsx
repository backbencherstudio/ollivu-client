"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Plus, X, Search } from "lucide-react";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/src/redux/features/categories/categoriesApi";
import { useCreateSubCategoryMutation } from "@/src/redux/features/categories/subCategoryApi";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AddCategory() {
  // Add these states at the top with other states
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [searchSelectedCategory, setSearchSelectedCategory] = useState<
    string | null
  >(null);
  const [openSubCategoryPopover, setOpenSubCategoryPopover] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Fetch existing categories
  const { data: getAllCategories } = useGetAllCategoriesQuery({});
  const [createCategory] = useCreateCategoryMutation();
  const [createSubCategory] = useCreateSubCategoryMutation();

  const categories = getAllCategories?.data || [];
  console.log("categories", categories);

  // Add getFilteredCategories function here
  const getFilteredCategories = () => {
    return categories.filter((cat) =>
      cat.category_name.toLowerCase().includes(newCategory.toLowerCase())
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setSelectedCategoryId(categoryId);
  };

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Update handleAddCategory function
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    // Check if category already exists
    if (
      categories.some(
        (cat) => cat.category_name.toLowerCase() === newCategory.toLowerCase()
      )
    ) {
      toast.error("This category already exists");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCategory({
        category_name: newCategory,
      }).unwrap();

      if (result?.success) {
        setNewCategory("");
        toast.success("Category created successfully");
        setExpandedCategories((prev) => [...prev, result._id]);
        setSelectedCategoryId(result._id); // Auto-select the new category
      }
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  // Add new state for image
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Add image handling function
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubCategoryImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddSubCategory = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      return;
    }

    if (!newSubCategory.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    if (!subCategoryImage) {
      toast.error("Please select an image");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("subCategory", newSubCategory);
      formData.append("categoryId", selectedCategoryId);
      formData.append("categoryImage", subCategoryImage);

      // Debug log
      console.log(
        "Sending request to:",
        `/categories/sub-category/${selectedCategoryId}`
      );
      console.log("Form data:", {
        subCategory: newSubCategory,
        categoryId: selectedCategoryId,
        categoryImage: subCategoryImage.name,
      });

      const result = await createSubCategory(formData).unwrap();
      console.log("API Response:", result);

      if (result) {
        setNewSubCategory("");
        setSubCategoryImage(null);
        setImagePreview(null);
        toast.success("Subcategory added successfully");
        if (!expandedCategories.includes(selectedCategoryId)) {
          setExpandedCategories((prev) => [...prev, selectedCategoryId]);
        }
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error?.data?.message || "Failed to add subcategory");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the Subcategory Input Section JSX
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#20B894]">
            Categories Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Input Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#20B894]" />
              Add New Category
            </h3>
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="pr-8"
                />
                <Popover
                  open={openCategoryPopover}
                  onOpenChange={setOpenCategoryPopover}
                >
                  <PopoverTrigger asChild>
                    <button
                      className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search existing categories..." />
                      <CommandEmpty>No matching categories found</CommandEmpty>
                      <CommandGroup heading="Existing Categories">
                        {getFilteredCategories().map((category) => (
                          <CommandItem
                            key={category._id}
                            onSelect={() => {
                              setNewCategory(category.category_name);
                              setSearchSelectedCategory(category._id);
                              setOpenCategoryPopover(false);
                            }}
                          >
                            {category.category_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                onClick={handleAddCategory}
                className="bg-[#20B894] text-white hover:bg-[#1ca883] cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </div>

          {/* Subcategory Input Section */}
          {/* <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#20B894]" />
              Add New Subcategory
            </h3>
            <div className="flex gap-3">
              <div className="flex-1 max-w-md space-y-4">
                <Input
                  placeholder="Select a category first"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  disabled={!selectedCategoryId}
                />

                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={!selectedCategoryId}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#20B89410] file:text-[#20B894] hover:file:bg-[#20B89420]"
                  />
                  {imagePreview && (
                    <div className="relative w-20 h-20">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setSubCategoryImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {selectedCategoryId && (
                  <p className="text-sm text-gray-500">
                    Adding to:{" "}
                    {
                      categories.find((cat) => cat._id === selectedCategoryId)
                        ?.category_name
                    }
                  </p>
                )}
              </div>
              <Button
                onClick={handleAddSubCategory}
                className="bg-[#20B894] text-white hover:bg-[#1ca883] self-start"
                disabled={!selectedCategoryId || isLoading}
              >
                {isLoading ? "Adding..." : "Add Subcategory"}
              </Button>
            </div>
          </div> */}

          {/* Categories List */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ChevronDown className="h-5 w-5 text-[#20B894]" />
              Existing Categories
            </h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No categories added yet
              </p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <Card key={category._id} className="overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleCategory(category._id)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedCategories.includes(category._id) ? (
                          <ChevronDown className="h-5 w-5 text-[#20B894]" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-[#20B894]" />
                        )}
                        <span className="font-medium">
                          {category.category_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({category.subCategories?.length || 0} subcategories)
                        </span>
                      </div>
                      {selectedCategoryId === category._id && (
                        <span className="text-sm text-[#20B894] bg-[#20B89410] px-3 py-1 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    {expandedCategories.includes(category._id) && (
                      <div className="p-4 bg-gray-50 border-t">
                        {/* Add Subcategory Input Section within each category */}
                        <div className="mb-4 space-y-3">
                          <div className="flex gap-3">
                            <Input
                              placeholder="Enter subcategory name"
                              value={
                                selectedCategoryId === category._id
                                  ? newSubCategory
                                  : ""
                              }
                              onChange={(e) => {
                                setSelectedCategoryId(category._id);
                                setNewSubCategory(e.target.value);
                              }}
                              className="flex-1"
                            />
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#20B89410] file:text-[#20B894] hover:file:bg-[#20B89420]"
                            />
                            <Button
                              onClick={handleAddSubCategory}
                              className="bg-[#20B894] text-white hover:bg-[#1ca883]"
                              disabled={
                                !newSubCategory ||
                                !subCategoryImage ||
                                isLoading
                              }
                            >
                              {isLoading ? "Adding..." : "Add"}
                            </Button>
                          </div>
                          {imagePreview &&
                            selectedCategoryId === category._id && (
                              <div className="relative w-20 h-20">
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                  width={100}
                                  height={100}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSubCategoryImage(null);
                                    setImagePreview(null);
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                        </div>

                        {/* Existing Subcategories */}
                        {category.subCategories?.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {category.subCategories?.map((sub: any) => (
                              <div
                                key={sub._id}
                                className="p-3 bg-white rounded-lg shadow-sm flex items-center gap-3"
                              >
                                {sub?.categoryImage ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${sub?.categoryImage}`}
                                    alt={sub.subCategory}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-[#20B89410] flex items-center justify-center text-[#20B894] font-semibold text-lg">
                                    {sub?.subCategory?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-medium">
                                  {sub?.subCategory}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No subcategories added yet
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
