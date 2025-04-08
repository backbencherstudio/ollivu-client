import React from 'react';
import { ReviewStatus } from '../_types';

interface ReviewStatusBadgeProps {
  status: ReviewStatus;
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  switch (status) {
    case 'Pending':
      return (
        <div className="bg-amber-50 text-amber-800 rounded-full px-4 py-1 text-xs flex items-center justify-center border border-amber-200">
          <span className="mr-1">○</span> Pending
        </div>
      );
    case 'Cancelled':
      return (
        <div className="bg-red-50 text-red-800 rounded-full px-4 py-1 text-xs flex items-center justify-center border border-red-200">
          <span className="mr-1">✕</span> Cancel
        </div>
      );
    case 'Accepted':
      return (
        <div className="bg-green-50 text-green-800 rounded-full px-4 py-1 text-xs flex items-center justify-center border border-green-200">
          <span className="mr-1">✓</span> Accepted
        </div>
      );
    default:
      return null;
  }
}