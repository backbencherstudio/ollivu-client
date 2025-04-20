import { Star } from 'lucide-react'
import React from 'react'

interface RatingOverviewProps {
  formattedInstructor: {
    rating: number;
    totalReview: number;
  };
}

export default function RatingOverview({ formattedInstructor }: RatingOverviewProps) {
  return (
    <div>
      <div className="bg-[#F9F9F9] p-6 rounded-xl border mb-6">
        <div className="flex items-start gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#070707]">{formattedInstructor.rating}</div>
            <div className="flex items-center gap-1 justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= formattedInstructor.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-[#777980]">From {formattedInstructor.totalReview} reviews</p>
          </div>

          {/* Rating Bars */}
          <div className="flex-1">
            {[
              { stars: 5, count: 1, width: "w-[33%]" },
              { stars: 4, count: 2, width: "w-[67%]" },
              { stars: 3, count: 0, width: "w-[20%]" },
              { stars: 2, count: 0, width: "w-[50%]" },
              { stars: 1, count: 0, width: "w-[0%]" },
            ].map((rating) => (
              <div
                key={rating.stars}
                className="flex items-center gap-2 mb-2"
              >
                <span className="text-sm text-[#777980] w-6">
                  {rating.stars}.0
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-full bg-[#20B894] rounded-full ${rating.width}`}
                  />
                </div>
                <span className="text-sm text-[#777980] w-8">
                  {rating.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
