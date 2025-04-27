"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ReviewList from "./_components/review-list";
import ProfileHeader from "./_components/profile-header";
import About from "./_components/about";
import RatingOverview from "./_components/rating-overview";
import ReviewModal from "./_components/review-modal";
import {
  useGetCurrentUserQuery,
  useGetSingleUserQuery,
} from "@/src/redux/features/users/userApi";
import BagIcon from "@/public/icons/bag-icon";
import SuccessIcon from "@/public/icons/success-icon";
import EnsuredIcon from "@/public/icons/ensured-icon";
import VerifiedIcon from "@/public/icons/verified-icon";
import { Pagination } from "@/components/reusable/pagination";
import FlagIcon from "@/public/icons/flag-icon";
import {
  useCreateReviewMutation,
  useGetSingleReviewQuery,
} from "@/src/redux/features/shared/reviewApi";
import { verifiedUser } from "@/src/utils/token-varify";
import { toast } from "sonner";
import ReportProfileModal from "./_components/report-profile-modal";
import { useCreateProfileReportMutation } from "@/src/redux/features/shared/reportApi";
import MessageRequestModal from "./_components/message-request-modal";
import { useCreateExchangeMutation } from "@/src/redux/features/admin/exchangeApi";

const ServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportProfileModalOpen, setIsReportProfileModalOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const currentUser = verifiedUser();

  const itemsPerPage = 3;

  const { data: instructor, isLoading } = useGetSingleUserQuery(
    params.id as string
  );

  const { data: currentUserData } = useGetCurrentUserQuery(currentUser?.userId);
  const currentUsreInfo = currentUserData?.data;

  const singleUser = instructor?.data;

  const { data: getSingleReview } = useGetSingleReviewQuery(singleUser?._id);
  const [createProfileReport] = useCreateProfileReportMutation();

  const [createReview] = useCreateReviewMutation();

  const [createExchange] = useCreateExchangeMutation();

  // Pagination logic
  const reviews = getSingleReview?.data || [];
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById("reviews-section")?.offsetTop,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleUser) {
    return <div>User not found</div>;
  }

  const formattedInstructor = {
    id: singleUser._id,
    name: singleUser?.personalInfo?.display_name,
    first_name: singleUser.personalInfo?.first_name,
    last_name: singleUser.personalInfo?.last_name,
    email: singleUser?.email,
    profileImage: singleUser?.profileImage || "/default-avatar.jpg",
    rating: singleUser?.rating || 0,
    skills: singleUser?.extra_skills || [],
    experience: "5+ years",
    totalReview: singleUser?.review || 0,
    customerSatisfaction: 95,
    isVerified: true,
    portfolioImage: singleUser?.portfolio || "/default-portfolio.jpg",
    about: singleUser?.about_me,
    location: `${singleUser?.addressInfo?.city}, ${singleUser?.addressInfo?.country}`,
    languages: ["English", "Bengali"], // Add default languages
  };

  const handleReviewSubmit = async (rating: number, review: string) => {
    // Handle the review submission here
    const reviewCreate = {
      reviewerId: currentUser?.userId,
      reciverId: singleUser._id,
      rating: rating,
      review: review,
    };
    // console.log(reviewCreate);
    try {
      const response = await createReview(reviewCreate).unwrap();
      console.log("res", response);
      toast.success("Review submitted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }

    // Call your API to submit the review
  };
  const handleProfileReport = async (reason: string, file: File | null) => {
    try {
      const formData = new FormData();
      formData.append("reporterId", currentUser?.userId);
      formData.append("reportedId", singleUser?._id);
      formData.append("reportType", reason); // This will be the description if "Other" was selected
      if (file) {
        formData.append("supportingFile", file);
      }

      const response = await createProfileReport(formData).unwrap();
      // console.log("response", response);

      if (response?.success) {
        toast.success("Report submitted successfully");
        setIsReportProfileModalOpen(false);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  const handleMessageRequest = async (selectedService: string) => {
    try {
      const exchangeData = [{
        senderUserId: currentUser?.userId,
        reciverUserId: singleUser?._id,
        email: currentUser?.email,
        senderService: selectedService,
        my_service: currentUsreInfo?.my_service,
      }];
      // console.log("exchange Data", exchangeData);
      

      const response = await createExchange(exchangeData).unwrap();
      // console.log("send exchange response", response);

      if (response?.success) {
        toast.success("Message request sent successfully");
        setIsMessageModalOpen(false);
      }
    } catch (error) {
      console.error("Error sending message request:", error);
      toast.error("Failed to send message request");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="w-full  flex  gap-6">
        <div className="w-[70%] flex justify-center gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ProfileHeader formattedInstructor={formattedInstructor} />

            {/* About Me Section */}
            <About
              instructor={formattedInstructor}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
              {[
                {
                  label: "Years of expertise",
                  value: "3 years",
                  icon: <BagIcon />,
                },
                {
                  label: "Customer Satisfaction",
                  value: "100%",
                  icon: <SuccessIcon />,
                },
                {
                  label: "Quality Service Ensured",
                  value: "Yes",
                  icon: <EnsuredIcon />,
                },
                {
                  label: "Verified Trainer",
                  value: "Verified",
                  icon: <VerifiedIcon />,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border flex flex-col items-center text-center gap-2"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  {/* <div className="text-[#4A4C56] font-medium text-lg">
                    {stat.value}
                  </div> */}
                  <div className="text-[#4A4C56] text-base font-normal">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Section */}
            {/* <div className="mb-8">
              <h2 className="text-2xl font-medium text-[#070707] mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {formattedInstructor.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#F9F9F9] border border-[#777980] text-[#777980] px-4 py-2 rounded-full text-base"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div> */}

            {/* Portfolio Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#070707] mb-4">
                Portfolio
              </h2>
              <div className="relative h-[410px] rounded-xl overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${formattedInstructor?.portfolioImage}`}
                  alt="Portfolio"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* added review section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-[#070707]">Reviews</h2>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center gap-2 text-emerald-500 hover:text-emerald-600 cursor-pointer"
                >
                  Write Review
                </button>

                <ReviewModal
                  isOpen={isReviewModalOpen}
                  onClose={() => setIsReviewModalOpen(false)}
                  onSubmit={handleReviewSubmit}
                />
              </div>

              {/* Rating Overview */}
              <RatingOverview formattedInstructor={formattedInstructor} />

              {/* Review Tabs */}
              <div className="border-b mb-6">
                <h2 className="text-2xl font-medium text-[#070707] my-5">
                  Review Lists
                </h2>
                <div className="flex gap-6">
                  <button
                    // onClick={() => setActiveTab("all")}
                    className={`pb-2 text-sm"text-[#20B894] border-b-2 border-[#20B894] font-normal text-xl"
                        `}
                  >
                    All reviews
                  </button>
                </div>
              </div>

              {/* Review List */}
              <div id="reviews-section">
                {reviews.length > 0 ? (
                  <>
                    <div>
                      {currentReviews?.map((singleReview: any) => (
                        <ReviewList
                          key={singleReview._id}
                          review={singleReview}
                          instructor={formattedInstructor}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No reviews yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* added user profile */}
        <div className="w-[30%]">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full relative overflow-hidden mb-3">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${formattedInstructor?.profileImage}`}
                  alt={instructor.first_name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium text-[#070707]">
                {formattedInstructor.first_name}
              </h3>
              <p className="text-gray-500 text-sm">Offline</p>
              <p className="text-xs text-gray-500 mt-1">10:05 PM local time</p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setIsMessageModalOpen(true)}
                className="w-full py-2.5 bg-[#20B894] text-white rounded-lg text-base font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Send Message Request
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
              <button
                onClick={() => setIsReportProfileModalOpen(true)}
                className="w-full py-2.5 text-[#FE5050] border border-[#FE5050] rounded-lg text-base font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Report Profile
                <FlagIcon className="w-4 h-4 stroke-current" />
              </button>

              {/* Add the modal component */}
              <ReportProfileModal
                isOpen={isReportProfileModalOpen}
                onClose={() => setIsReportProfileModalOpen(false)}
                onSubmit={handleProfileReport}
              />

              <MessageRequestModal
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                onSubmit={handleMessageRequest}
                instructor={formattedInstructor}
                singleUser={singleUser}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm  text-gray-500">
                Average response time: 5 hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default ServiceDetails;
