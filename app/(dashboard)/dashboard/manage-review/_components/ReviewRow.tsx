'use client';

import React, { useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusDropdown } from './StatusDropdown';
import { Review, ReviewStatus } from '../_types';
import { ReviewDetailsModal } from './ReviewDetailsModal';

interface ReviewRowProps {
  review: Review;
  onStatusChange: (id: number, status: ReviewStatus) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export function ReviewRow({ 
  review, 
  onStatusChange, 
  onDelete, 
  onApprove, 
  onReject 
}: ReviewRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="border-b cursor-pointer hover:bg-gray-50" onClick={() => setIsModalOpen(true)}>
        <td className="py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img src={review.reviewer.avatar} alt={review.reviewer.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-medium text-sm">{review.reviewer.name}</span>
          </div>
        </td>
        <td className="py-4 text-sm">{review.serviceType}</td>
        <td className="py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img src={review.flaggedBy.avatar} alt={review.flaggedBy.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-medium text-sm">{review.flaggedBy.name}</span>
          </div>
        </td>
        <td className="py-4 text-sm max-w-xs">{review.reviewText}</td>
        <td className="py-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{review.rating.toFixed(1)}</span>
          </div>
        </td>
        <td className="py-4">
          <StatusDropdown 
            currentStatus={review.status} 
            onStatusChange={(status) => onStatusChange(review.id, status)} 
          />
        </td>
        <td className="py-4">
          {review.status === 'Pending' ? (
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500" onClick={() => onApprove(review.id)}>
                <span className="sr-only">Approve</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onReject(review.id)}>
                <span className="sr-only">Reject</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-blue-500 p-0">
                View details
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" onClick={() => onDelete(review.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          )}
        </td>
      </tr>

      <ReviewDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={review}
      />
    </>
  );
}