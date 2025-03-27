"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/Public/client/home/logo.png";

// Define service categories and their items
const serviceCategories = [
  {
    title: "Education & Learning",
    items: [
      "Tutoring & Academic Support",
      "Online Learning & Skill Development",
      "Music Lessons",
      "Art Lessons",
      "Self-Defense Lessons",
      "Public Speaking Coaching",
      "Coding Lessons",
      "Photography Classes",
      "Car Maintenance Tutorials",
      "Language Exchange",
    ],
  },
  {
    title: "Professional & Business Services",
    items: [
      "Graphic Design",
      "Web Development",
      "Marketing & Social Media Management",
      "SEO & Content Writing",
      "Photography & Video Editing",
      "IT Support & Tech Help",
      "Legal Advice",
      "Accounting & Tax Help",
      "Translation Services",
      "Virtual Assistance",
    ],
  },
  {
    title: "Events & Entertainment",
    items: [
      "Event Planning",
      "DJ & Live Music Services",
      "Stand-up Comedy",
      "Face Painting & Balloon Art",
      "Caricature Drawing",
      "Dance Lessons",
      "Catering & Bartending",
      "Modeling & Photography",
      "Custom Crafts & Handmade Gifts",
    ],
  },
  {
    title: "Home Services & Maintenance",
    items: [
      "Handyman Services",
      "Plumbing & Electrical Work",
      "Gardening & Landscaping",
      "House Cleaning",
      "Home Decor & Interior Design",
      "Furniture Assembly",
    ],
  },
  {
    title: "Personal & Care Services",
    items: [
      "Makeup & Hair Styling",
      "Meal Prep & Cooking",
      "Pet Sitting & Dog Walking",
      "Babysitting & Childcare",
      "Elderly Care Assistance",
      "Nail & Eyebrow Services",
      "Dog Grooming",
    ],
  },
  {
    title: "Wellness & Personal Growth",
    items: [
      "Fitness Training",
      "Massage Therapy",
      "Reiki & Energy Healing",
      "Life Coaching",
      "Tarot Readings & Astrology",
      "Meditation & Mindfulness Coaching",
    ],
  },
  {
    title: "Automotive & Transportation",
    items: [
      "Car Repairs",
      "Moving Help",
      "Bike Repair & Maintenance",
      "Ridesharing",
      "Boat Repairs & Maintenance",
    ],
  },
];

export default function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-teal-600">
                <Image src={logo} width={100} height={100} alt="Logo" />
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-teal-600 font-medium"
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button className="text-gray-600 hover:text-teal-600 font-medium cursor-pointer">
                  Services
                </button>

                {isServicesOpen && (
                  <div className="absolute top-full -left-40 w-[1000px] bg-white shadow-lg rounded-md p-6  z-50">
                    <div className="grid grid-cols-4 gap-6">
                      {serviceCategories.map((category) => (
                        <div key={category.title} className="group">
                          <h3 className="font-semibold text-sm mb-3 text-gray-900 group-hover:text-teal-600">
                            {category.title}
                          </h3>
                          <ul className="space-y-2">
                            {category.items.map((item) => (
                              <li 
                                key={item}
                                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
                              >
                                <Link href="#" className="block py-1">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link 
                href="/how-it-works" 
                className="text-gray-600 hover:text-teal-600 font-medium"
              >
                How it works
              </Link>

              <Link 
                href="/terms" 
                className="text-gray-600 hover:text-teal-600 font-medium"
              >
                Terms & Policy
              </Link>
            </div>
          </div>

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-teal-600"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
