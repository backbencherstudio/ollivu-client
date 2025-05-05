import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/src/redux/types/authInterface";

interface ServiceCardProps {
  user: User;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ user }) => {
  const [instructorImageError, setInstructorImageError] = useState(false);
  const [portfolioImageError, setPortfolioImageError] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    if (user?._id) {
      router.push(`/service-result/${user._id}`);
    }
  };

  const profileImageUrl = user?.profileImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profileImage}`
    : null;

  const portfolioImageUrl = user?.portfolio
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.portfolio}`
    : null;

  return (
    <Card className="w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-all flex flex-col h-full p-0">
      {/* Portfolio Image Section */}
      <div className="w-full h-48 relative bg-gray-100">
        {portfolioImageUrl && !portfolioImageError ? (
          <Image
            src={portfolioImageUrl}
            alt="Portfolio"
            fill
            className="object-cover"
            onError={() => setPortfolioImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No portfolio image</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center justify-end mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-gray-700 font-medium">
              {typeof user?.rating === "number"
                ? user.rating.toFixed(1)
                : "0.0"}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-[#F9F9F9] p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 relative overflow-hidden flex-shrink-0">
              {profileImageUrl && !instructorImageError ? (
                <Image
                  src={profileImageUrl}
                  alt={user?.first_name || "User"}
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={() => setInstructorImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-600">
                    {user?.first_name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-xl font-medium text-[#070707] truncate">
                {user?.first_name || "User"}
              </h4>
              <p className="text-sm text-[#777980] truncate">{user?.email}</p>
            </div>
          </div>

          {/* Services List */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-[#777980] mb-2">
              Services:
            </h5>
            <div className="flex flex-wrap gap-2">
              {user?.my_service?.map((service, index) => (
                <span
                  key={index}
                  className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#777980]">Experience:</span>
              <span className="font-medium text-[#4A4C56]">2+ years</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#777980]">Reviews:</span>
              <span className="font-medium text-[#4A4C56]">
                {user?.review || 0}
              </span>
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        <button
          onClick={handleCardClick}
          className="w-full py-3 bg-[#20B894] text-white rounded-lg font-medium text-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          View Profile
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
      </div>
    </Card>
  );
};
