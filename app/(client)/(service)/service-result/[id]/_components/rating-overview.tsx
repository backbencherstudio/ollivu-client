import { Star } from 'lucide-react'
import React from 'react'

export default function RatingOverview() {
  return (
    <div>
         <div className="bg-[#F9F9F9] p-6 rounded-xl border mb-6">
              <div className="flex items-start gap-8">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#070707]">4.8</div>
                  <div className="flex items-center gap-1 justify-center my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#777980]">From 200 reviews</p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1">
                  {[
                    { stars: 5, count: 180, width: "w-[90%]" },
                    { stars: 4, count: 12, width: "w-[60%]" },
                    { stars: 3, count: 8, width: "w-[40%]" },
                    { stars: 2, count: 0, width: "w-[0%]" },
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
  )
}
