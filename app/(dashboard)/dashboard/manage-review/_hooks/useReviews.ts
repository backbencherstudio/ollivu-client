'use client';

import { useState } from 'react';
import { Review, ReviewStatus } from '../_types';
import avaterOne from "@/public/avatars/emily.png"
import avaterTwo from "@/public/avatars/john.png"
import avaterThree from "@/public/avatars/michael.png"
import avaterFour from "@/public/avatars/sophia.png"

const initialReviews: Review[] = [
  {
    id: 1,
    reviewer: {
        name: 'Chris Glasser',
        avatar: avaterOne.src,
        email: ''
    },
    serviceType: 'Graphic Design',
    flaggedBy: {
      name: 'Jenny Wilson',
      avatar: avaterTwo.src,
    },
    reviewText: 'The design was not what I asked for. It looked rushed and...',
    rating: 2.0,
    status: 'Cancelled',
  },
  {
    id: 2,
    reviewer: {
        name: 'Eleanor Pena',
        avatar: avaterThree.src,
        email: ''
    },
    serviceType: 'Handyman Service',
    flaggedBy: {
      name: 'Kathryn Murphy',
      avatar: avaterOne.src,
    },
    reviewText: "Didn't finish the job properly. I had to call someone else to fix",
    rating: 2.0,
    status: 'Cancelled',
  },
  {
    id: 3,
    reviewer: {
        name: 'Courtney Henry',
        avatar: avaterTwo.src,
        email: ''
    },
    serviceType: 'Photography service',
    flaggedBy: {
      name: 'Esther Howard',
      avatar: avaterFour.src,
    },
    reviewText: 'Photos came out blurry and poorly lit. Not what I expect...',
    rating: 3.0,
    status: 'Pending',
  },
  {
    id: 4,
    reviewer: {
        name: 'Dianne Russell',
        avatar: avaterThree.src,
        email: ''
    },
    serviceType: 'SEO Service',
    flaggedBy: {
      name: 'Cody Fisher',
      avatar: avaterOne.src,
    },
    reviewText: 'The provider sent inappropriate flirtatious texts...',
    rating: 2.6,
    status: 'Pending',
  },
  {
    id: 5,
    reviewer: {
        name: 'Albert Flores',
        avatar: avaterTwo.src,
        email: ''
    },
    serviceType: 'Web Development',
    flaggedBy: {
      name: 'Guy Hawkins',
      avatar: avaterThree.src,
    },
    reviewText: 'Albert is a walking red flag— showed up late, delivered tra...',
    rating: 1.0,
    status: 'Accepted',
  },
];

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [sortBy, setSortBy] = useState<string>('Most Recent');

  const updateReviewStatus = (id: number, status: ReviewStatus) => {
    setReviews(
      reviews.map((review) => 
        review.id === id ? { ...review, status } : review
      )
    );
  };

  const deleteReview = (id: number) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const approveReview = (id: number) => {
    updateReviewStatus(id, 'Accepted');
  };

  const rejectReview = (id: number) => {
    updateReviewStatus(id, 'Cancelled');
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'Oldest':
        return a.id - b.id;
      case 'Highest Rating':
        return b.rating - a.rating;
      case 'Lowest Rating':
        return a.rating - b.rating;
      case 'Most Recent':
      default:
        return b.id - a.id;
    }
  });

  return {
    reviews: sortedReviews,
    updateReviewStatus,
    deleteReview,
    approveReview,
    rejectReview,
    sortBy,
    setSortBy,
  };
}