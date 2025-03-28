"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Flag, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { serviceCategories } from "@/data/services";

// First, add this state near the top of your component
const ServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  // Add these new states
  const [likes, setLikes] = useState(128);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);

  const service = serviceCategories
    .flatMap((category) => category.items)
    .find((service) => service.id === Number(params.id));

  if (!service) {
    return <div>Service not found</div>;
  }

  const instructor = service.instructor;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="w-full flex justify-center gap-6">
        <div className="w-3/4 bg-white rounded-xl shadow-sm p-6">
          {/* Profile Header */}
          <div className="flex flex-col gap-4 border p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-[140px] h-[140px] rounded-full relative overflow-hidden">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-[#070707]">
                    {instructor.name}
                  </h1>
                  <span className="bg-emerald-50 text-emerald-500 text-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                    Verified <span className="text-emerald-500">✓</span>
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{instructor.rating}</span>
                    <span className="text-gray-500">
                      ({instructor.totalReview})
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm py-1">{instructor.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {instructor.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    {instructor.languages.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the content */}
          {/* <div className="flex items-start gap-6 mb-8">
          <div className="w-32 h-32 rounded-full relative overflow-hidden">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[#070707] mb-2">
              {instructor.name}
            </h1>
            <div className="flex items-center gap-4 text-[#777980] mb-4">
              <span>{instructor.experience} Experience</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{instructor.rating}</span>
                <span>({instructor.totalReview} Reviews)</span>
              </div>
            </div>
            <p className="text-[#4A4C56]">{instructor.about}</p>
          </div>
        </div> */}

          <div>
            <div>
              <h2 className="font-medium text-2xl text-[#070707] mt-8 mb-4">
                About Me
              </h2>
              <div className="relative">
                <p
                  className={`text-[#4A4C56] text-sm font-normal ${
                    !isExpanded && "line-clamp-3"
                  }`}
                >
                  {instructor.about}
                </p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#20B894] text-sm font-medium hover:text-emerald-700 mt-2"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
            {[
              { label: "Total Review", value: instructor.totalReview },
              { label: "Experience", value: instructor.experience },
              {
                label: "Customer Satisfaction",
                value: `${instructor.customerSatisfaction}%`,
              },
              {
                label: "Verified",
                value: instructor.isVerified ? "Yes" : "No",
              },
            ].map((stat, index) => (
              <div key={index} className="bg-[#F9F9F9] p-4 rounded-lg border">
                <div className="text-[#777980] text-sm mb-1">{stat.label}</div>
                <div className="text-[#070707] font-medium">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#070707] mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {instructor.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#F9F9F9] border border-[#777980] text-[#777980] px-4 py-2 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#070707] mb-4">
              Portfolio
            </h2>
            <div className="relative h-[410px] rounded-xl overflow-hidden">
              <Image
                src={instructor.portfolioImage}
                alt="Portfolio"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* added review section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#070707]">Reviews</h2>
              <button className="px-4 py-2 bg-[#20B894] text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                Write Review
              </button>
            </div>

            {/* Rating Overview */}
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

            {/* Review Tabs */}
            <div className="border-b mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === "all"
                      ? "text-[#20B894] border-b-2 border-[#20B894]"
                      : "text-[#777980]"
                  }`}
                >
                  All reviews
                </button>
                <button
                  onClick={() => setActiveTab("latest")}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === "latest"
                      ? "text-[#20B894] border-b-2 border-[#20B894]"
                      : "text-[#777980]"
                  }`}
                >
                  Latest reviews
                </button>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {/* Single Review */}
              <div className="border-b pb-6">
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
          </div>
        </div>

        {/* Contact Button */}
        {/* <button className="w-full py-3 bg-[#20B894] text-white rounded-lg font-medium text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
          Connect with {instructor.name}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </button> */}
      </div>
      <div className="w-1/2">user profile</div>
    </div>
  );
};

export default ServiceDetails;
