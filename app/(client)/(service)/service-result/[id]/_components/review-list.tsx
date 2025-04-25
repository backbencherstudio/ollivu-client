import { serviceCategories } from "@/constants/serviceCategories";
import Image from "next/image";
import React, { useState } from "react";
import { Flag, Star } from "lucide-react";
import FlagIcon from "@/public/icons/flag-icon";
import { useGetSingleReviewQuery } from "@/src/redux/features/shared/reviewApi";
import { useCreateReviewReportMutation } from "@/src/redux/features/shared/reportApi";
import { verifiedUser } from "@/src/utils/token-varify";
import ReportModal from "@/app/(dashboard)/dashboard/review/_components/report-modal";
import { toast } from "sonner";

interface ReviewListProps {
  instructor: {
    profileImage: string;
    name: string;
  };
  review: {
    _id: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
    reviewerId: {
      _id: string;
      first_name: string;
      email: string;
      profileImage?: string; 
      personalInfo: {
        display_name: string;
        first_name: string;
        last_name: string;
        gender: string;
        phone_number: number;
        dath_of_birth: string;
      };
    };
    reciverId: string;
    like: number;
    disLike: number;
    report: boolean;
  };
}

const ReviewList = ({ review }: ReviewListProps) => {
  // console.log("review list insidee", review);
  
  const [likes, setLikes] = useState(review.like || 0);
  const [dislikes, setDislikes] = useState(review.disLike || 0);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [createReviewReport] = useCreateReviewReportMutation();
  const currentUser = verifiedUser();

  const handleLike = () => {
    if (userAction === "like") {
      setLikes(prev => prev - 1);
      setUserAction(null);
    } else {
      if (userAction === "dislike") {
        setDislikes(prev => prev - 1);
      }
      setLikes(prev => prev + 1);
      setUserAction("like");
    }
  };

  const handleDislike = () => {
    if (userAction === "dislike") {
      setDislikes(prev => prev - 1);
      setUserAction(null);
    } else {
      if (userAction === "like") {
        setLikes(prev => prev - 1);
      }
      setDislikes(prev => prev + 1);
      setUserAction("dislike");
    }
  };

  const handleReportSubmit = async (description: string, file: File | null) => {
    try {
      const formData = new FormData();
      formData.append("reporterId", currentUser.userId);
      formData.append("reportDetails", description);
      formData.append("reviewId", review._id);
      if (file) {
        formData.append("document", file);
      }

      const response = await createReviewReport(formData).unwrap();
      if (response?.success) {
        toast.success("Report submitted successfully");
        setIsReportModalOpen(false);
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-6 my-8">
        {/* Rating and Report Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-base text-[#1D1F2C]">({review.rating})</span>
          {/* <button 
            className={`text-[#1D1F2C] hover:text-gray-600 ml-10 cursor-pointer flex items-center gap-2 ${
              review.report ? 'text-red-500' : ''
            }`}
          >
            <FlagIcon />
            {review.report ? 'Reported' : 'Report'}
          </button> */}
          {/* Update the Report button */}
        <button 
          onClick={() => setIsReportModalOpen(true)}
          className={`text-[#1D1F2C] hover:text-gray-600 ml-10 cursor-pointer flex items-center gap-2 ${
            review?.report ? 'text-red-500' : ''
          }`}
        >
          <FlagIcon />
          {review?.report ? 'Reported' : 'Report'}
        </button>

        {/* Add ReportModal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
        />

        </div>

        
        {/* Review Text */}
        <div className="mb-5">
          <p className="text-[#4A4C56] text-lg font-normal mb-1">
            {review.review}
          </p>
          <span className="text-base text-[#A5A5AB]">
            {new Date(review.createdAt).toLocaleString()}
          </span>
        </div>

        {/* Reviewer Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden">
            <Image
              src={review?.reviewerId?.profileImage 
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${review.reviewerId.profileImage}`
                : "/default-avatar.jpg"}
              alt={review.reviewerId?.personalInfo?.display_name || "User"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[#1D1F2C]">
              {review.reviewerId?.first_name || "Anonymous"}
            </span>
          </div>
        </div>

        {/* Like/Dislike Section remains the same */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 ${
              userAction === "like" ? "text-[#20B894]" : "text-[#777980]"
            } hover:text-[#20B894] transition-colors`}
          >
            <span className="text-sm">{likes}</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={userAction === "like" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
              />
            </svg>
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-1.5 ${
              userAction === "dislike" ? "text-red-500" : "text-[#777980]"
            } hover:text-red-500 transition-colors`}
          >
            {dislikes > 0 && <span className="text-sm">{dislikes}</span>}
            <svg
              className="w-4 h-4 rotate-180"
              viewBox="0 0 24 24"
              fill={userAction === "dislike" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
