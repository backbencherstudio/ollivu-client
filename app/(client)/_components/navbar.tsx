"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo/logo.png";
import { ChevronDown, ChevronUp, Menu, MoveUpRight, X } from "lucide-react";
import { usePathname } from "next/navigation";
import CustomImage from "@/components/reusable/CustomImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { verifiedUser } from "@/src/utils/token-varify";
import { useGetAllCategoriesQuery } from "@/src/redux/features/categories/categoriesApi";
import { useGetSingleUserQuery } from "@/src/redux/features/users/userApi";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { data: getAllCategories, isLoading } =
    useGetAllCategoriesQuery(undefined);
  const categories = getAllCategories?.data || [];
  // console.log("getAllCategories", getAllCategories);

  const validUser = verifiedUser();
  const { data: singleUser } = useGetSingleUserQuery(validUser?.userId);
  const singleUserData = singleUser?.data;

  // Update the authentication check
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        setIsAuthenticated(!!token);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Update the user verification
  // const user = typeof window !== 'undefined' ? verifiedUser() : null;

  // Add logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  // Add scroll event handler
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isServicesOpen) setIsServicesOpen(false);
  };

  // Fix the toggleServices function
  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const user = verifiedUser();
  // console.log("user", user);

  return (
    <nav
      className={`secondary_color shadow-sm sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              {/* <Image src={logo} width={100} height={100} alt="Logo" /> */}
              <CustomImage
                src={logo.src}
                alt="Company Logo"
                width={120}
                height={40}
                layout="fixed"
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex items-center space-x-8 text-[#777980]">
              <Link
                href="/"
                className={`font-medium hover:text-teal-600 ${
                  pathname === "/" ? "text-[#070707]" : "text-[#777980]"
                }`}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <Link
                  href="/service-result"
                  className={`flex items-center space-x-1 font-medium hover:text-teal-600 ${
                    pathname.includes("/service-result")
                      ? "text-[#070707]"
                      : "text-[#777980]"
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
                </Link>

                {/* Dropdown Menu - Shows on Hover */}
                <div className="absolute top-full mt-5 -left-40 w-[calc(100vw-2rem)] md:w-[700px] lg:w-[1000px] bg-white shadow-lg rounded-md p-4 md:p-6 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => (
                      <div key={category._id} className="group/item">
                        <h3 className="font-medium text-lg mb-2 md:mb-3 text-[#070707] group-hover/item:text-teal-600">
                          {category.category_name}
                        </h3>
                        <ul className="space-y-1 md:space-y-2">
                          {category.subCategories.map((item) => (
                            <li
                              key={item._id}
                              className="text-xs md:text-sm text-gray-600 hover:text-teal-600 transition-colors"
                            >
                              <Link
                                href={`/service-result?category=${encodeURIComponent(
                                  category.category_name
                                )}&service=${encodeURIComponent(
                                  item.subCategory
                                )}`}
                                className="block py-1"
                              >
                                {item.subCategory}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {isServicesOpen && (
                    <div className="pl-4 pr-2 py-2">
                      {categories.map((category) => (
                        <div key={category._id} className="group/item">
                          <h3 className="font-semibold text-sm mb-2 md:mb-3 text-gray-900 group-hover/item:text-teal-600">
                            {category.category_name}
                          </h3>
                          <ul className="space-y-2">
                            {category.subCategories.map((item) => (
                              <li key={item._id}>
                                <Link
                                  href={`/service-result?category=${encodeURIComponent(
                                    category.category_name
                                  )}&service=${encodeURIComponent(
                                    item.subCategory
                                  )}`}
                                  className="text-sm text-gray-600 hover:text-teal-600 flex items-center group-hover/item:translate-x-1 transition-transform"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsServicesOpen(false);
                                  }}
                                >
                                  {item.subCategory}
                                  <MoveUpRight className="w-3 h-3 ml-1 opacity-0 group-hover/item:opacity-100" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="https://ollivu-client.vercel.app/#how-it-works"
                className={`font-medium hover:text-teal-600 ${
                  pathname === "https://ollivu-client.vercel.app/#how-it-works"
                    ? "text-[#070707]"
                    : "text-[#777980]"
                }`}
              >
                How it works
              </Link>

              <Link
                href="/terms-and-conditions"
                className={`font-medium hover:text-teal-600 ${
                  pathname === "/terms-and-conditions"
                    ? "text-[#070707]"
                    : "text-[#777980]"
                }`}
              >
                Terms & Policy
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                  {/* <Avatar className="h-8 w-8 hover:ring-2 hover:ring-teal-500 transition-all">
                    <AvatarImage src="/default-avatar.png" />
                    <AvatarFallback className="bg-teal-500 text-white">
                      U
                    </AvatarFallback>
                  </Avatar> */}
                  <div className="w-10 h-10 rounded-full relative overflow-hidden">
                    {singleUserData?.profileImage ? (
                      <div>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${singleUserData.profileImage}`}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-xl font-semibold">
                        {singleUserData?.first_name
                          ? singleUserData.first_name.slice(0, 2).toUpperCase()
                          : "UN"}
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">
                        {singleUserData?.first_name} {singleUserData?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {singleUserData?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      const targetPath =
                        user?.role === "admin"
                          ? "/dashboard/user-management"
                          : "/dashboard";
                      router.push(targetPath);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="group font-medium px-4 py-2 rounded-full border border-teal-600 transition-all duration-300 text-[#777870] flex items-center gap-2 hover:bg-teal-500 hover:border-teal-500"
                >
                  <span className="group-hover:text-white transition-colors duration-300">
                    Login
                  </span>
                  <MoveUpRight
                    className="text-[#777870] group-hover:text-white transition-colors duration-300"
                    size={20}
                  />
                </Link>
                <Link
                  href="/auth/signup"
                  className="group font-medium px-4 py-2 rounded-full border border-teal-600 transition-all duration-300 text-[#777870] flex items-center gap-2 hover:bg-teal-500 hover:border-teal-500"
                >
                  <span className="group-hover:text-white transition-colors duration-300">
                    Sign Up
                  </span>
                  <MoveUpRight
                    className="text-[#777870] group-hover:text-white transition-colors duration-300"
                    size={20}
                  />
                </Link>
              </>
            )}
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
                pathname === "/" ? "text-[#070707]" : "text-[#777980]"
              } hover:text-teal-600`}
            >
              Home
            </Link>

            <div>
              <button
                onClick={toggleServices}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  pathname.includes("/services")
                    ? "text-[#070707]"
                    : "text-[#777980]"
                } hover:text-teal-600`}
              >
                <span>Services</span>
                {isServicesOpen ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {/* Mobile Menu Services Section */}
              {isServicesOpen && (
                <div className="pl-4 pr-2 py-2">
                  {categories.map((category) => (
                    <div key={category._id} className="group/item">
                      <h3 className="font-semibold text-sm mb-1 md:mb-3 text-gray-900 group-hover/item:text-teal-600">
                        {category.category_name}
                      </h3>
                      <ul className="space-y-2 mb-4">
                        {category.subCategories.map((item) => (
                          <li key={item._id}>
                            <Link
                              href={`/service-result?category=${encodeURIComponent(
                                category.category_name
                              )}&service=${encodeURIComponent(
                                item.subCategory
                              )}`}
                              className="text-sm text-gray-600 hover:text-teal-600 flex items-center group-hover/item:translate-x-1 transition-transform"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsServicesOpen(false);
                              }}
                            >
                              {item.subCategory}
                              <MoveUpRight className="w-3 h-3 ml-1 opacity-0 group-hover/item:opacity-100" />
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
                pathname === "/how-it-works"
                  ? "text-[#070707]"
                  : "text-[#777980]"
              } hover:text-teal-600`}
            >
              How it works
            </Link>

            <Link
              href="/terms"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/terms" ? "text-[#070707]" : "text-[#777980]"
              } hover:text-teal-600`}
            >
              Terms & Policy
            </Link>

            {/* Mobile Menu Auth Section */}
            <div className="flex items-center justify-center w-full gap-4 pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block px-12 py-3 rounded-full text-base font-medium bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-12 py-3 rounded-full text-base font-medium hover:text-teal-600 border border-[#D2B9A1] text-[#D2B9A1]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-12 py-3 rounded-full text-base font-medium bg-teal-500 text-white hover:bg-teal-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
