import { serviceCategories } from '@/constants/serviceCategories';
import Image from 'next/image';
import React, { useState } from 'react';
import { Flag, Star } from 'lucide-react';

interface ReviewListProps {
  instructor: {
    image: string;
    name: string;
  };
  activeTab: string;
}

const ReviewList = ({ instructor, activeTab }: ReviewListProps) => {
  const [likes, setLikes] = useState(128);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);

  return (
    <div className="space-y-6">
      <div className="border-b pb-6 my-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
              <Image
                src={instructor.image}
                alt="Reviewer"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-[#070707]">
                Darrell Steward
              </h4>
              <div className="flex items-center gap-2 text-sm text-[#777980]">
                <span>July 2, 2023 03:29 PM</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">(4.7)</span>
            </div>
            <button className="text-[#777980] hover:text-gray-600">
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[#4A4C56] text-sm">
          I had an amazing experience trading my marketing services for
          professional fitness training. The trainer was knowledgeable,
          motivating, and tailored workouts to my goals, making each
          session highly effective. The exchange was seamless, and
          communication was excellent. Highly recommend!
        </p>
        <div className="flex justify-between items-center mt-4 w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden">
              <Image
                src={instructor.image}
                alt="Darrell Steward"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-[#070707] font-medium">
              Darrell Steward
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (userAction === 'like') {
                  setLikes(prev => prev - 1);
                  setUserAction(null);
                } else {
                  if (userAction === 'dislike') {
                    setDislikes(prev => prev - 1);
                  }
                  setLikes(prev => prev + 1);
                  setUserAction('like');
                }
              }}
              className={`flex items-center gap-1.5 ${
                userAction === 'like' ? 'text-[#20B894]' : 'text-[#777980]'
              } hover:text-[#20B894] transition-colors`}
            >
              <span className="text-sm">{likes}</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill={userAction === 'like' ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (userAction === 'dislike') {
                  setDislikes(prev => prev - 1);
                  setUserAction(null);
                } else {
                  if (userAction === 'like') {
                    setLikes(prev => prev - 1);
                  }
                  setDislikes(prev => prev + 1);
                  setUserAction('dislike');
                }
              }}
              className={`flex items-center gap-1.5 ${
                userAction === 'dislike' ? 'text-red-500' : 'text-[#777980]'
              } hover:text-red-500 transition-colors`}
            >
              {dislikes > 0 && <span className="text-sm">{dislikes}</span>}
              <svg
                className="w-4 h-4 rotate-180"
                viewBox="0 0 24 24"
                fill={userAction === 'dislike' ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
