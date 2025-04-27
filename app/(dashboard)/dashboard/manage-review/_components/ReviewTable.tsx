'use client';

import React from 'react';
import { ReviewRow } from './ReviewRow';
import { Review, ReviewStatus } from '../_types';

interface ReviewTableProps {
  reviews: Review[];
  onStatusChange: (id: string, status: ReviewStatus) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ReviewTable({ 
  reviews, 
  onStatusChange, 
  onDelete, 
  onApprove, 
  onReject 
}: ReviewTableProps) {
  // console.log("ReviewTable", reviews);
  
  return (
    <div className="w-full overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="pb-4 font-medium">Reviewer</th>
            <th className="pb-4 font-medium">Flagged By</th>
            <th className="pb-4 font-medium">Review</th>
            <th className="pb-4 font-medium">Rating</th>
            <th className="pb-4 font-medium">Status</th>
            <th className="pb-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <ReviewRow
              review={review}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}