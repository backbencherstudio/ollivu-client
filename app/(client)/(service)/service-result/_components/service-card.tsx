import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Service } from '@/types/service.types';
import { Star } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <Card className="w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-all">
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
    <div className="p-3">
      {/* Title and Rating */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-[#070707]">{service.title}</h3>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-gray-700 font-medium">{service.rating}</span>
        </div>
      </div>

      {/* Instructor Info */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden">
          <Image
            src={service.image}
            alt={service.instructor.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{service.instructor.name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Experience: {service.instructor.experience}</span>
          </div>
        </div>
      </div>

      {/* Review Count */}
      <p className="text-sm text-gray-500 mb-3">
        Review: {service.reviewCount} Reviews
      </p>

      {/* Connect Button */}
      <button className="w-full py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5">
        Connect Request
        <svg 
          className="w-3.5 h-3.5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M5 12h14m-7-7l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </Card>
);