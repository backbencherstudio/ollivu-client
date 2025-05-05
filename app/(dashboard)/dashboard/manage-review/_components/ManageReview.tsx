"use client";

import React, { useEffect } from "react";
import { ReviewTable } from "./ReviewTable";
import { useReviews } from "../_hooks/useReviews";
import { useGetAllReviewReportQuery } from "@/src/redux/features/shared/reportApi";

export function ManageReview() {
  const {
    reviews,
    updateReviewStatus,
    deleteReview,
    approveReview,
    rejectReview,
    setReviews,
  } = useReviews();

  const { data: getAllReviewReport } = useGetAllReviewReportQuery(undefined);

  console.log(getAllReviewReport?.data);



  useEffect(() => {

    if (getAllReviewReport?.data) {
      const formattedReviews = getAllReviewReport?.data?.map((report: any) => {
        console.log(28, report );
        
        return {
          id: report?._id,
          reviewer: {
            name: report?.reviewId?.reciverId?.first_name,
            email: report?.reviewId?.reciverId?.email,
            avatar: report?.reviewId?.reciverId?.profileImage || "",
          },
          flaggedBy: {
            name: report?.reviewId?.reviewerId?.first_name,
            avatar: report?.reviewId?.reviewerId?.profileImage || "",
          },
          reviewText: report?.reportType,
          rating: 0,
          status: report?.status,
          createdAt: report?.createdAt,
          reportDetails: report?.reportDetails,
          reportDocument: report?.supportingFile,
          personalInfo: report?.reporterId?.personalInfo,
        }
      });

      setReviews(formattedReviews);
    }
  }, [getAllReviewReport?.data, setReviews]);

  console.log(51,reviews);
  

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <ReviewTable
        reviews={reviews}
        onStatusChange={updateReviewStatus}
        onDelete={deleteReview}
        onApprove={approveReview}
        onReject={rejectReview}
      />
    </div>
  );
}
