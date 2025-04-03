'use client';

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

export default function Portfolio() {
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [serviceName, setServiceName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Portfolio</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload necessary documents or photos to showcase your portfolio/services.
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPortfolioModal(true)}
            className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]"
          >
            Add file
          </button>
          <button className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
            Remove
          </button>
        </div>
      </Card>

      {/* Portfolio Modal */}
      <Dialog open={showPortfolioModal} onOpenChange={setShowPortfolioModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Portfolio</DialogTitle>
            <button 
              onClick={() => setShowPortfolioModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-base font-medium mb-1 block">Service name</label>
              <Input 
                placeholder="Web development" 
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">Media</label>
              <div className="mt-1 border rounded-lg p-4">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*,application/pdf"
                />
                <label 
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center"
                >
                  <span className="bg-white px-3 py-2 rounded border hover:bg-gray-50">
                    Choose files
                  </span>
                  <span className="ml-3 text-gray-500">
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">Maximum file size: 50 MB</p>
              </div>
            </div>
            <div className="pt-4">
              <button 
                className="px-4 py-2 bg-[#20B894] text-white rounded-md hover:bg-[#1a9678] w-24"
              >
                Add file
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}