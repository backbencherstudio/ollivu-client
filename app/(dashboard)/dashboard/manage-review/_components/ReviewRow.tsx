"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Review, ReviewStatus } from "../_types";
import { ReviewDetailsModal } from "./ReviewDetailsModal";
import { ReviewActionModal } from "./ReviewActionModal";
import Image from "next/image";
import { useActionReviewReportMutation } from "@/src/redux/features/shared/reportApi";

interface ReviewRowProps {
  review: Review;
  onStatusChange: (id: string, status: ReviewStatus) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ReviewRow({ review, onApprove, onReject }: ReviewRowProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionReviewReport] = useActionReviewReportMutation();

  return (
    <>
      <tr className="border-b">
        <td className="py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {review?.reviewer?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.reviewer?.avatar}`}
                  alt={review?.reviewer?.name || "User"}
                  className="w-full h-full object-cover"
                  height={100}
                  width={100}
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {review?.reviewer?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="font-medium text-sm">
              {review?.reviewer?.name}
            </span>
          </div>
        </td>
        {/* <td className="py-4 text-sm">{review?.serviceType}</td> */}
        <td className="py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {review?.flaggedBy?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${review?.flaggedBy?.avatar}`}
                  alt={review?.flaggedBy?.name || "User"}
                  className="w-full h-full object-cover"
                  height={100}
                  width={100}
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {review?.flaggedBy?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="font-medium text-sm">
              {review?.flaggedBy?.name}
            </span>
          </div>
        </td>
        <td
          className="py-4 text-sm max-w-xs cursor-pointer hover:text-gray-600"
          onClick={() => setIsReviewModalOpen(true)}
        >
          {review?.reportDetails &&
            (review.reportDetails.length > 50
              ? `${review.reportDetails.substring(0, 50)}...`
              : review.reportDetails)}
        </td>
        {/* <td className="py-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{review?.rating?.toFixed(1)}</span>
          </div>
        </td> */}
        <td className={`py-4 uppercase `}>
          <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
            review?.status === 'accept' 
              ? 'bg-green-100 text-green-700' 
              : review?.status === 'reject' 
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}>
            {review?.status === 'accept' 
              ? 'Accepted' 
              : review?.status === 'reject' 
                ? 'Rejected' 
                : 'Pending'}
          </span>
        </td>
        <td className="py-4">
          {/* Show only Reject button if status is accept */}
          {review?.status === 'accept' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500"
              onClick={() => onReject(review.id)}
            >
              <span className="sr-only">Reject</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}

          {/* Show only Accept button if status is reject */}
          {review?.status === 'reject' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-500"
              onClick={() => onApprove(review.id)}
            >
              <span className="sr-only">Approve</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12L10 17L20 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}

          {/* Show both buttons if status is neither accept nor reject */}
          {review?.status !== 'accept' && review?.status !== 'reject' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-500"
                onClick={() => onApprove(review.id)}
              >
                <span className="sr-only">Approve</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12L10 17L20 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={() => onReject(review.id)}
              >
                <span className="sr-only">Reject</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </>
          )}
        </td>

        <td>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 p-0 ml-5"
            onClick={() => setIsActionModalOpen(true)}
          >
            View details
          </Button>
        </td>
      </tr>

      {/* Modal for Review column click */}
      <ReviewDetailsModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        review={review}
      />

      {/* Modal for Action column View Details click */}
      <ReviewActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        review={review}
      />
    </>
  );
}
