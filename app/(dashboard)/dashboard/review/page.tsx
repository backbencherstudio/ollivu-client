"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useGetSingleReviewQuery } from "@/src/redux/features/shared/reviewApi";
import { verifiedUser } from "@/src/utils/token-varify";
import ReportModal from "./_components/report-modal";
import { toast } from "sonner";
import { useCreateReviewReportMutation } from "@/src/redux/features/shared/reportApi";
import { StatCard } from "./_components/stat-card";
import { RatingBreakdown } from "./_components/rating-breakdown";
import { StarRating } from "./_components/star-rating";
import { Pagination } from "@/components/reusable/pagination";
import FlagIcon from "@/public/icons/flag-icon";

export default function AdminReviewsPage() {
  const [sort, setSort] = useState("recent");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [createReviewReport] = useCreateReviewReportMutation();

  const currentUser = verifiedUser();
  console.log("cr", currentUser);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: getSingleReview, refetch } = useGetSingleReviewQuery(
    currentUser?.userId
  );

  const singleUserAllReview = getSingleReview?.data;

  // Calculate pagination
  const filteredReviews = useMemo(() => {
    return singleUserAllReview || [];
  }, [singleUserAllReview]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReportSubmit = async (description: string, file: File | null) => {
    try {
      const formData = new FormData();
      formData.append("reporterId", currentUser.userId);
      formData.append("reportDetails", description);
      formData.append("reviewId", selectedReview._id);
      if (file) {
        formData.append("document", file);
      }

      const response = await createReviewReport(formData).unwrap();

      if (response?.success) {
        toast.success("Report submitted successfully");
        setIsReportModalOpen(false);
        setSelectedReview(null);
        refetch();
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="bg-white text-[#1D1F2C] min-h-screen p-6 md:p-10 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Reviews"
            value="1k+"
            valueClass="text-[#20B894]"
            subtitle="Growth in reviews on this year"
          />
          <StatCard
            title="Average Rating"
            value="4.5"
            subtitle="Average Rating on this year"
            stars
          />
          <StatCard
            title="Customer Satisfaction"
            value="90%"
            valueClass="text-[#20B894]"
            subtitle="Average Rating on this year"
          />
        </div>
        <div className="md:col-span-2">
          <RatingBreakdown />
        </div>
      </div>
      {/* Sort + Header */}
      <div className="flex items-center justify-between mt-8 border-b pb-3">
        <h2 className="text-base font-semibold">All reviews</h2>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {paginatedReviews.map((review) => (
          <div key={review._id} className="flex items-start gap-4">
            {review?.reviewerId?.profileImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.reviewerId?.profileImage}`}
                alt={review?.reviewerId?.first_name || "User"}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#20B894] text-white flex items-center justify-center text-lg font-semibold">
                {review?.reviewerId?.first_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {review?.reviewerId?.first_name}
                </h4>
                <span className="text-xs text-gray-400">
                  {new Date(review?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm mt-1 text-[#4A4C56]">{review?.review}</p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <StarRating rating={review?.rating} />
                <span className="text-gray-500">({review?.rating})</span>
                <button 
          onClick={() => setIsReportModalOpen(true)}
          className={`text-[#1D1F2C] hover:text-gray-600 ml-10 cursor-pointer flex items-center gap-2 ${
            review?.report ? 'text-red-500' : ''
          }`}
        >
          <FlagIcon />
          {review?.report ? 'Reported' : 'Report'}
        </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>

      {/* ReportModal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedReview(null);
        }}
        onSubmit={handleReportSubmit}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
