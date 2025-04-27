import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Service } from "@/types/service.types";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomImage } from "@/components/common/CustomImage";

interface ServiceCardProps {
  service: Service;
}

// const DEFAULT_SERVICE_IMAGE = ;
// const DEFAULT_SERVICE_IMAGE = serviceImg
// const DEFAULT_AVATAR_IMAGE = avaterImg

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  console.log("service", service);
  
  const router = useRouter();

  const handleCardClick = () => {
    if (service.instructor?.id) {
      router.push(`/service-result/${service.instructor.id}`);
    }
  };

  return (
    <Card className="w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-all flex flex-col h-full p-0 ">
      
      <div className="relative w-full h-44 bg-gray-200 flex items-center justify-center">
        {service.image ? (
          <CustomImage
            src={service.image}
            alt={service.title}
            // fill
            className="object-cover"
            priority
            width={300}
            height={200}
            // onError={(e: any) => {
            //   e.currentTarget.src = DEFAULT_SERVICE_IMAGE;
            // }}
          />
        ) : (
          <span className="text-4xl font-medium text-gray-600">
            {service.title?.charAt(0).toUpperCase() || 'S'}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Title and Rating */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-[#070707] line-clamp-1">
              {service.title}
            </h3>
            
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-gray-700 font-medium">
                {typeof service.rating === 'number' ? service.rating.toFixed(1) : '0.0'}
              </span>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="bg-[#F9F9F9] p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {/* Instructor Image Section */}
              <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden flex items-center justify-center">
                {service.instructor?.image ? (
                  <Image
                    src={service.instructor.image}
                    alt={service.instructor?.name || "Instructor"}
                    fill
                    className="object-cover"
                    // onError={(e: any) => {
                    //   e.currentTarget.src = DEFAULT_AVATAR_IMAGE;
                    // }}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {service.instructor?.name?.charAt(0).toUpperCase() || 'I'}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-medium text-[#070707]">
                  {service.instructor?.name || "Instructor"}
                </h4>
                <p className="text-sm text-[#777980]">{service.instructor?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-4 text-sm">
              <p className="font-regular text-[#777980]">
                Experience:{" "}
                <span className="font-normal text-[#4A4C56]">
                  {service.instructor?.experience || "Not specified"}
                </span>
              </p>
              <p className="font-regular text-[#777980]">
                Reviews:{" "}
                <span className="font-normal text-[#4A4C56]">
                  {service.reviewCount || 0} Reviews
                </span>
              </p>
            </div>
          </div>

          {/* Connect Button */}
          <button onClick={handleCardClick}  className="w-full py-2.5 bg-[#20B894] text-white rounded-lg font-medium text-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 mt-3 cursor-pointer">
            Details
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};
