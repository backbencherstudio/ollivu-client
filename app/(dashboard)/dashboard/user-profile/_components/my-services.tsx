'use client';

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { X as CloseIcon, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";

interface MyServiceProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

// Add service categories data
const serviceCategories = [
  {
    name: "Professional & Business Services",
    subcategories: ["Consulting", "Marketing", "Legal Services", "Financial Services"]
  },
  {
    name: "Automotive & Transportation",
    subcategories: ["Car Repairs", "Moving Help", "Bike Repair & Maintenance", "Ridesharing", "Boat Repairs & Maintenance"]
  },
  {
    name: "Education & Learning",
    subcategories: ["Tutoring & Academic Support", "Online Learning & Skill Development", "Music Lessons", "Art Lessons", "Self-Defense Lessons", "Public Speaking Coaching"]
  },
  {
    name: "Events & Entertainment",
    subcategories: ["Event Planning", "Photography", "DJ Services", "Live Music"]
  },
  {
    name: "Home Services & Maintenance",
    subcategories: ["Cleaning", "Repairs", "Gardening", "Interior Design"]
  },
  {
    name: "Personal & Care Services",
    subcategories: ["Beauty Services", "Personal Training", "Massage Therapy"]
  },
  {
    name: "Wellness & Personal Growth",
    subcategories: ["Life Coaching", "Meditation", "Nutrition Consulting"]
  }
];

export default function MyService({ 
  title = "My Service", 
  description = "Add the service you have expertise in for exchanging services in this platform.",
  buttonText = "Add service"
}: MyServiceProps) {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState("");
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const {data: getAllCategories, isLoading} = useGetAllCategoriesQuery(undefined)
  const categories = getAllCategories?.data || [];
  console.log("my service", categories);
  

  const handleAddService = () => {
    setShowServiceModal(true);
  };

  const handleServiceSubmit = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService("");
      setShowServiceModal(false);
    }
  };

  const handleDeleteClick = (service: string) => {
    setServiceToDelete(service);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = () => {
    setServices(services.filter(service => service !== serviceToDelete));
    setShowDeleteAlert(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        
        {/* Display existing services */}
        <div className=" flex flex-wrap gap-2">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F5F5] rounded-full border border-gray-200"
            >
              <span>{service}</span>
              <button
                onClick={() => handleDeleteClick(service)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex gap-2">
          <button 
            onClick={handleAddService}
            className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678] flex items-center gap-2"
          >
            {buttonText}
          </button>

          <button 
            className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678] flex items-center gap-2"
          >
            Save
          </button>
        </div>
      </Card>

      {/* Updated Add Service Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add My Service</DialogTitle>
            <button 
              onClick={() => setShowServiceModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">Choose services</p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {categories.map((category) => (
                <div key={category.name} className="border rounded-lg">
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <span>{category.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedCategory === category.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedCategory === category.name && (
                    <div className="border-t">
                      {category.subcategories.map((subcat) => (
                        <button
                          key={subcat}
                          onClick={() => {
                            if (!services.includes(subcat)) {
                              setServices([...services, subcat]);
                              setShowServiceModal(false);
                            }
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          {subcat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-4">
              {/* <button className="text-[#20B894] flex items-center gap-2">
                <span>Add more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button> */}
            </div>
            <div className="mt-4">
              <button
                onClick={() => setShowServiceModal(false)}
                className="w-full px-4 py-2 bg-[#20B894] text-white rounded-md hover:bg-[#1a9678]"
              >
                Add Service
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service "{serviceToDelete}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}