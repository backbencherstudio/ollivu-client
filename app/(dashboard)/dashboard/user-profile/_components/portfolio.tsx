'use client';

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUploadPortfolioMutation } from "@/src/redux/features/users/userApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Portfolio() {
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const currentUser = verifiedUser();
  const [uploadPortfolio] = useUploadPortfolioMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser?.userId) return;

    try {
      const formData = new FormData();
      formData.append('portfolio', selectedFile);
      formData.append('userId', currentUser.userId);

      const response = await uploadPortfolio({ userId: currentUser.userId, data: formData }).unwrap();
      console.log("res", response);
      
      
      if (response.success) {
        toast.success('Portfolio uploaded successfully');
        setShowPortfolioModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload portfolio');
    }
  };

  // Cleanup preview URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
            className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678] cursor-pointer"
          >
            Add file
          </button>
          {/* <button className="px-3 py-1.5 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50">
            Remove
          </button> */}
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

                {/* Preview Section */}
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-4">
              <button 
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 text-white rounded-md w-24 cursor-pointer ${
                  selectedFile 
                    ? 'bg-[#20B894] hover:bg-[#1a9678]' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedFile ? 'Upload' : 'Add file'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}