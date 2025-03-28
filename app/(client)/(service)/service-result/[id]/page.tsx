"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Flag, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { serviceCategories } from "@/data/services";
import ReviewList from "./_components/review-list";
import ProfileHeader from "./_components/profile-header";
import About from "./_components/about";
import RatingOverview from "./_components/rating-overview";

// First, add this state near the top of your component
const ServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  // Add these new states

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

      <div className="w-full  flex  gap-6">
        <div className="w-[70%] flex justify-center gap-6">
          <div className=" bg-white rounded-xl shadow-sm p-6">
            {/* Profile Header */}
            <ProfileHeader
              instructor={{
                ...instructor,
                rating: Number(instructor.rating),
              }}
            />

            {/* About Me Section */}
            <About
              instructor={instructor}
              isExpanded={undefined}
              setIsExpanded={undefined}
            />

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
                  <div className="text-[#777980] text-sm mb-1">
                    {stat.label}
                  </div>
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
                <h2 className="text-xl font-semibold text-[#070707]">
                  Reviews
                </h2>
                <button className="px-4 py-2 bg-[#20B894] text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  Write Review
                </button>
              </div>

              {/* Rating Overview */}
              <RatingOverview />

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
              <ReviewList instructor={instructor} activeTab={activeTab} />
              <ReviewList instructor={instructor} activeTab={activeTab} />
              <ReviewList instructor={instructor} activeTab={activeTab} />
            </div>
          </div>
        </div>

        {/* added user profile */}
        <div className="w-[30%]">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full relative overflow-hidden mb-3">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-[#070707]">{instructor.name}</h3>
              <p className="text-gray-500 text-sm">Offline</p>
              <p className="text-xs text-gray-500 mt-1">10:05 PM local time</p>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full py-2.5 bg-[#20B894] text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                Send Message Request
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full py-2.5 text-red-500 border border-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                Report Profile
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Average response time: 5 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
