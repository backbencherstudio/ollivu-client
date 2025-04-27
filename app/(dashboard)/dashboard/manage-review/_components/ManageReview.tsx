"use client";

import React, { useEffect } from "react";
import { ReviewTable } from "./ReviewTable";
import { useReviews } from "../_hooks/useReviews";
import { useGetAllProfileReportQuery } from "@/src/redux/features/shared/reportApi";

export function ManageReview() {
  const {
    reviews,
    updateReviewStatus,
    deleteReview,
    approveReview,
    rejectReview,
    setReviews,
  } = useReviews();

  const { data: getAllProfileReport } = useGetAllProfileReportQuery({});
  console.log("getAllProfileReport: ", getAllProfileReport?.data);
  

  useEffect(() => {
    if (getAllProfileReport?.data) {
      const formattedReviews = getAllProfileReport.data.map((report: any) => ({
        id: report?._id,
        reviewer: {
          name: report?.reporterId?.first_name,
          email: report?.reporterId?.email,
          avatar: report?.reporterId?.profileImage || "", // Changed from reportedId to reporterId
        },
        flaggedBy: {
          name: report?.reportedId?.first_name,
          avatar: report?.reportedId?.profileImage || "", // Changed from reporterId to reportedId
        },
        reviewText: report?.reportType,
        rating: 0,
        status: report?.action === "pending" ? "Pending" : "Accepted",
        createdAt: report?.createdAt,
        reportDetails: report?.reportType,
        reportDocument: report?.supportingFile,
        personalInfo: report?.reporterId?.personalInfo,
      }));

      setReviews(formattedReviews);
    }
  }, [getAllProfileReport?.data, setReviews]);

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
