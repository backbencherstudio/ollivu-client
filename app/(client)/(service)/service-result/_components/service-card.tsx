import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Service } from '@/types/service.types';
import { Star } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <Card className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    {/* Image Section */}
    <div className="relative w-full h-48">
      <Image 
        src={service.image} 
        alt={service.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"/>
    </div>

    {/* Content Section */}
    <div className="p-4">
      {/* Title and Rating */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-medium text-[#070707]">{service.title}</h3>
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-700 font-medium">{service.rating}</span>
        </div>
      </div>

      {/* Instructor Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
          <Image
            src={service.image}
            alt={service.instructor.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{service.instructor.name}</h4>
          <p className="text-sm text-gray-600">Experience: {service.instructor.experience}</p>
        </div>
      </div>

      {/* Review Count */}
      <p className="text-sm text-gray-600 mb-4">
        Review: {service.reviewCount} Reviews
      </p>

      {/* Connect Button */}
      <button className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
        Connect Request
        <svg 
          className="w-4 h-4" 
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