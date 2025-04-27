export type ReviewStatus = 'Pending' | 'Accepted' | 'Cancelled';

export interface PersonalInfo {
  display_name: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: number;
  dath_of_birth: string;
}

export interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
    email: string;
  };
  serviceType: string;
  flaggedBy: {
    name: string;
    avatar: string;
  };
  reviewText: string;
  rating: number;
  status: ReviewStatus;
  createdAt: string;
  reportDetails: string;
  reportDocument?: string;
  personalInfo?: PersonalInfo;
}