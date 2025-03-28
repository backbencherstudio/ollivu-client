'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section className="bg-white px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Illustration */}
        <div className="w-full md:w-1/2">
          <Image
            src="/services.png"
            alt="Service Collaboration"
            width={600}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#070707] leading-tight mb-6">
            Explore and Find The Services You Need
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-8">
            Find people who need what you offer. Exchange your services
            easily and grow your network! No cash required—just collaboration!
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-lg">
            <div className="flex items-center bg-white border border-[#F2EDEB] rounded-full px-4 py-2 shadow-sm">
              <Search className="w-5 h-5 text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Type your services"
                className="w-full bg-transparent focus:outline-none text-black"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
