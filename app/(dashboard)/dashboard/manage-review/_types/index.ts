export type ReviewStatus = 'Pending' | 'Cancelled' | 'Accepted';

export interface Review {
  id: number;
  reviewer: {
    name: string;
    avatar: string;
  };
  serviceType: string;
  flaggedBy: {
    name: string;
    avatar: string;
  };
  reviewText: string;
  rating: number;
  status: ReviewStatus;
}