"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/Public/client/home/logo.png";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { usePathname } from 'next/navigation';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Add scroll event handler
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) { // scrolling down
        setIsVisible(false);
      } else { // scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    // cleanup function
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isServicesOpen) setIsServicesOpen(false);
  };

  return (
    <nav className={`secondary_color shadow-sm sticky top-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              <Image src={logo} width={100} height={100} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navigation Menu - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex items-center space-x-8 text-[#777980]">
              <Link 
                href="/" 
                className={`font-medium hover:text-teal-600 ${pathname === '/' ? 'text-[#070707]' : 'text-[#777980]'}`}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative">
                <button 
                  className={`flex items-center space-x-1 font-medium hover:text-teal-600 ${pathname.includes('/services') ? 'text-[#070707]' : 'text-[#777980]'}`}
                  onClick={toggleServices}
                >
                  <span>Services</span>
                  {isServicesOpen ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>

                {isServicesOpen && (
                  <div className="absolute top-full mt-5 -left-40 w-[calc(100vw-2rem)] md:w-[700px] lg:w-[1000px] bg-white shadow-lg rounded-md p-4 md:p-6 z-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {serviceCategories.map((category) => (
                        <div key={category.title} className="group">
                          <h3 className="font-semibold text-sm mb-2 md:mb-3 text-gray-900 group-hover:text-teal-600">
                            {category.title}
                          </h3>
                          <ul className="space-y-1 md:space-y-2">
                            {category.items.map((item) => (
                              <li 
                                key={item}
                                className="text-xs md:text-sm text-gray-600 hover:text-teal-600 transition-colors"
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
                className={`font-medium hover:text-teal-600 ${pathname === '/how-it-works' ? 'text-[#070707]' : 'text-[#777980]'}`}
              >
                How it works
              </Link>

              <Link 
                href="/terms" 
                className={`font-medium hover:text-teal-600 ${pathname === '/terms' ? 'text-[#070707]' : 'text-[#777980]'}`}
              >
                Terms & Policy
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className={`font-medium hover:text-teal-600 ${pathname === '/login' ? 'text-[#070707]' : 'text-[#777980]'}`}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-teal-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/' ? 'text-[#070707]' : 'text-[#777980]'
              } hover:text-teal-600`}
            >
              Home
            </Link>
            
            <div>
              <button
                onClick={toggleServices}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  pathname.includes('/services') ? 'text-[#070707]' : 'text-[#777980]'
                } hover:text-teal-600`}
              >
                <span>Services</span>
                {isServicesOpen ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>
              
              {isServicesOpen && (
                <div className="pl-4 pr-2 py-2">
                  {serviceCategories.map((category) => (
                    <div key={category.title} className="mb-4">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {category.title}
                      </h3>
                      <ul className="mt-2 space-y-1">
                        {category.items.map((item) => (
                          <li key={item}>
                            <Link
                              href="#"
                              className="block px-3 py-1 text-sm text-gray-600 hover:text-teal-600"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/how-it-works"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/how-it-works' ? 'text-[#070707]' : 'text-[#777980]'
              } hover:text-teal-600`}
            >
              How it works
            </Link>

            <Link
              href="/terms"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/terms' ? 'text-[#070707]' : 'text-[#777980]'
              } hover:text-teal-600`}
            >
              Terms & Policy
            </Link>

            <div className="flex items-center justify-center w-full gap-4 pt-4 pb-3 border-t border-gray-200">
              <Link
                href="/login"
                className="block px-12 py-3  rounded-full text-base font-medium hover:text-teal-600 border border-[#D2B9A1] text-[#D2B9A1]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-12 py-3 rounded-full text-base font-medium bg-teal-500 text-white hover:bg-teal-600"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
