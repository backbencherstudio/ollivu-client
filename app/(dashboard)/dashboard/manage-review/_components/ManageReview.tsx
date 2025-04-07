'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ReviewTable } from './ReviewTable';
import { useReviews } from '../_hooks/useReviews';

export function ManageReview() {
  const { 
    reviews, 
    updateReviewStatus, 
    deleteReview, 
    approveReview, 
    rejectReview,
    sortBy,
    setSortBy
  } = useReviews();

  const sortOptions = ['Most Recent', 'Oldest', 'Highest Rating', 'Lowest Rating'];

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Review</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-gray-200">
              {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem 
                key={option} 
                onClick={() => setSortBy(option)}
                className="cursor-pointer"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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