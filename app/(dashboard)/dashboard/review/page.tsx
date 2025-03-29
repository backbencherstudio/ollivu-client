'use client';

import React, { useState } from 'react';
import { Star, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function AdminReviewsPage() {
  const [sort, setSort] = useState('recent');

  const reviews = [
    {
      id: 1,
      name: 'Emily R.',
      avatar: '/avatars/emily.png',
      rating: 2.0,
      text: "This service is trash and the owner should be in jail. I think they intentionally ruined my project out of pure malice...",
      reported: true,
      date: '2 days ago',
    },
    {
      id: 2,
      name: 'John D.',
      avatar: '/avatars/john.png',
      rating: 4.7,
      text: "I exchanged my content writing services for a fully functional website, and the results were great!",
      reported: false,
      date: '2 days ago',
    },
    {
      id: 3,
      name: 'Sophia M.',
      avatar: '/avatars/sophia.png',
      rating: 4.7,
      text: "I needed a few home repairs but didn’t want to spend cash, so I offered pet sitting in exchange...",
      reported: false,
      date: '2 days ago',
    },
    {
      id: 4,
      name: 'Michael S.',
      avatar: '/avatars/michael.png',
      rating: 4.7,
      text: "As a photographer, I struggle with marketing my work. I connected with a social media expert...",
      reported: false,
      date: '5 days ago',
    },
  ];

  return (
    <div className="bg-white text-[#1D1F2C] min-h-screen p-6 md:p-10 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Reviews" value="1k+" subtitle="Growth in reviews on this year" />
        <StatCard title="Average Rating" value="4.5" subtitle="Average Rating on this year" stars />
        <StatCard title="Customer Satisfaction" value="90%" subtitle="Average Rating on this year" />
        <RatingBreakdown />
      </div>

      {/* Sort + Header */}
      <div className="flex items-center justify-between mt-8 border-b pb-3">
        <h2 className="text-base font-semibold">All reviews</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border text-sm px-3 py-1.5 rounded-md text-gray-600"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
          <option value="low">Lowest Rated</option>
          <option value="high">Highest Rated</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex items-start gap-4">
            <Image
              src={review.avatar}
              alt={review.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{review.name}</h4>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <p className="text-sm mt-1 text-[#4A4C56]">{review.text}</p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <StarRating rating={review.rating} />
                <span className="text-gray-500">({review.rating})</span>
                {review.reported ? (
                  <span className="text-red-500 font-medium flex items-center gap-1">
                    <Flag size={14} /> Reported
                  </span>
                ) : (
                  <button className="text-gray-400 hover:text-black flex items-center gap-1">
                    <Flag size={14} /> Report
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-black">
          <ChevronLeft size={16} /> Previous
        </button>
        {[1, 2, '...', 5].map((item, i) => (
          <button
            key={i}
            className={`px-3 py-1.5 rounded ${
              item === 1 ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
            } text-sm`}
          >
            {item}
          </button>
        ))}
        <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-black">
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, stars = false }: any) {
  return (
    <div className="border rounded-xl p-4">
      <h4 className="text-sm text-[#4A4C56] mb-1">{title}</h4>
      <div className="text-2xl font-bold flex items-center gap-1">
        {value}
        {stars && (
          <div className="flex ml-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={16} fill={i < Math.round(parseFloat(value)) ? '#FBBF24' : 'none'} stroke="#FBBF24" />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function RatingBreakdown() {
  const data = [100, 50, 20, 15, 5];
  return (
    <div className="border rounded-xl p-4 space-y-1">
      {data.map((count, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-[#4A4C56]">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < 5 - index ? '#FBBF24' : 'none'}
                stroke="#FBBF24"
              />
            ))}
          </div>
          <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-[#20B894]"
              style={{ width: `${(count / 100) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#4A4C56]">{count}</span>
        </div>
      ))}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rounded ? '#FBBF24' : 'none'}
          stroke="#FBBF24"
        />
      ))}
    </div>
  );
}
