import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Service } from "@/types/service.types";
import { Star } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <Card className="w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-all flex flex-col h-full p-0">
    {/* Image Section */}
    <div className="relative w-full h-44">
      <Image
        src={service.image}
        alt={service.title}
        fill
        className="object-cover"
        priority
      />
    </div>

    {/* Content Section */}
    <div className="p-3 flex flex-col flex-grow">
      <div className="flex-grow">
        {/* Title and Rating */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-[#070707]">
            {service.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-gray-700 font-medium">{service.rating}</span>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden">
              <Image
                src={service.image}
                alt={service.instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <h4 className="font-medium text-lg text-[#070707]">
              {service.instructor.name}
            </h4>
          </div>
          <div>
            <div className="flex flex-col gap-1 mt-4 text-sm">
              <p className="font-regular  text-[#777980]">
                Experience:{" "}
                <span className="font-normal text-[#4A4C56]">
                  {service.instructor.experience}
                </span>
              </p>
              <p className="font-regular  text-[#777980]">
          Review:
          <span className="font-normal text-[#4A4C56]">
            {" "}
            {service.reviewCount} Reviews
          </span>
        </p>
            </div>
          </div>
        </div>

        {/* Review Count */}
        
      </div>

      {/* Connect Button - Always at bottom */}
      <button className="w-full py-2.5 bg-[#20B894] text-white rounded-lg font-medium text-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 mt-3 cursor-pointer">
        Connect Request
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
  </Card>
);
