'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const allServices = [
  { title: 'Graphic Design', icon: '/icons/graphic.png', category: 'Professional & Business Services' },
  { title: 'Web Development', icon: '/icons/web.png', category: 'Professional & Business Services' },
  { title: 'Marketing & Social Media Management', icon: '/icons/marketing.png', category: 'Professional & Business Services' },
  { title: 'SEO & Content Writing', icon: '/icons/seo.png', category: 'Professional & Business Services' },
  { title: 'Photography & Video Editing', icon: '/icons/photo.svg', category: 'Events & Entertainment' },
  { title: 'IT Support & Tech Help', icon: '/icons/it.png', category: 'Education & Learning' },
  { title: 'Legal Advice', icon: '/icons/legal.png', category: 'Professional & Business Services' },
  { title: 'Accounting & Tax Help', icon: '/icons/accounting.svg', category: 'Professional & Business Services' },
];

const categories = [
  'All',
  'Personal & Care Services',
  'Events & Entertainment',
  'Automotive & Transportation',
  'Wellness & Personal Growth',
  'Education & Learning',
  'Professional & Business Services',
  'Home Services & Maintenance',
];

export default function ServiceCategoriesSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices =
    activeCategory === 'All'
      ? allServices
      : allServices.filter(service => service.category === activeCategory);

  return (
    <section className="bg-white max-w-[1320px] mx-auto text-[#4A4C56] px-4 sm:px-10 lg:px-20 py-16">
      <h2 className="text-center text-3xl font-semibold mb-6">Service Categories</h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap w-[85%] justify-center gap-4 text-sm sm:text-base mb-12">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-1 transition ${
              activeCategory === cat
                ? 'text-[#20B894] border-b-2 border-[#20B894]'
                : 'text-[#4A4C56] hover:text-[#20B894]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtered Service Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {filteredServices.map((service, i) => (
          <div
            key={i}
            className="rounded-[20px] border border-[#20B894] p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-[#F1FCF9] hover:text-[#070707]"
          >
            <img src={service.icon} alt={service.title} className="w-12 h-12 mb-4" />
            <h3 className="text-base font-medium mb-6">{service.title}</h3>
            <button
              className="flex items-center gap-2 text-sm border border-[#20B894] text-[#20B894] px-4 py-2 rounded-full hover:bg-[#20B894]/10 transition"
            >
              Exchange Service <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button className="bg-[#20B894] text-white text-sm font-medium px-6 py-3 rounded-full flex items-center gap-2 mx-auto hover:opacity-90 transition">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
