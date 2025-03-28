
import serviceOne from "@/public/client/services/service-01.png"
import serviceTwo from "@/public/client/services/service-02.png"
import serviceThree from "@/public/client/services/service-03.png"
import serviceFour from "@/public/client/services/service-04.png"
import serviceFive from "@/public/client/services/service-05.png"
import serviceSix from "@/public/client/services/service-06.png"

export const serviceCategories = [
  {
    title: "Education & Learning",
    items: [
      {
        id: 1,
        title: "Mathematics Tutoring",
        instructor: { name: "John Smith", experience: "8+ years" },
        rating: 4.9,
        reviewCount: 150,
        image: serviceOne
      },
      {
        id: 2,
        title: "Piano Lessons",
        instructor: { name: "Sarah Wilson", experience: "10+ years" },
        rating: 4.8,
        reviewCount: 120,
        image: serviceTwo
      },
      {
        id: 3,
        title: "Web Development Course",
        instructor: { name: "Michael Chen", experience: "7+ years" },
        rating: 4.7,
        reviewCount: 200,
        image: serviceThree
      }
    ]
  },
  {
    title: "Professional & Business Services",
    items: [
      {
        id: 4,
        title: "Logo Design",
        instructor: { name: "Alex Johnson", experience: "6+ years" },
        rating: 4.8,
        reviewCount: 180,
        image: serviceFour
      },
      {
        id: 5,
        title: "Business Consulting",
        instructor: { name: "Lisa Brown", experience: "12+ years" },
        rating: 4.9,
        reviewCount: 220,
        image: serviceSix
      }
    ]
  },
  {
    title: "Events & Entertainment",
    items: [
      {
        id: 6,
        title: "Wedding Photography",
        instructor: { name: "Emily White", experience: "9+ years" },
        rating: 4.8,
        reviewCount: 160,
        image: serviceFive
      },
      {
        id: 7,
        title: "Live Band Performance",
        instructor: { name: "James Wilson", experience: "15+ years" },
        rating: 4.9,
        reviewCount: 190,
        image: serviceFour
      },
      {
        id: 8,
        title: "Event Decoration",
        instructor: { name: "Sophie Martinez", experience: "7+ years" },
        rating: 4.7,
        reviewCount: 140,
        image: serviceOne
      }
    ]
  },
  {
    title: "Home Services & Maintenance",
    items: [
      {
        id: 9,
        title: "Home Cleaning",
        instructor: { name: "Maria Garcia", experience: "5+ years" },
        rating: 4.6,
        reviewCount: 130,
        image: serviceSix
      },
      {
        id: 10,
        title: "Garden Maintenance",
        instructor: { name: "Peter Green", experience: "8+ years" },
        rating: 4.8,
        reviewCount: 170,
        image: serviceThree
      },
      {
        id: 11,
        title: "Interior Design",
        instructor: { name: "Anna Lee", experience: "10+ years" },
        rating: 4.9,
        reviewCount: 200,
        image: serviceTwo
      }
    ]
  },
  {
    title: "Personal & Care Services",
    items: [
      {
        id: 12,
        title: "Professional Makeup",
        instructor: { name: "Jessica Kim", experience: "8+ years" },
        rating: 4.8,
        reviewCount: 150,
        image: serviceFive
      },
      {
        id: 13,
        title: "Personal Training",
        instructor: { name: "Chris Thompson", experience: "11+ years" },
        rating: 4.9,
        reviewCount: 210,
        image: serviceFour
      },
      {
        id: 14,
        title: "Nutrition Consulting",
        instructor: { name: "Rachel Green", experience: "6+ years" },
        rating: 4.7,
        reviewCount: 120,
        image: serviceOne
      }
    ]
  },
  {
    title: "Wellness & Personal Growth",
    items: [
      {
        id: 15,
        title: "Yoga Classes",
        instructor: { name: "Maya Patel", experience: "12+ years" },
        rating: 4.9,
        reviewCount: 230,
        image: serviceSix
      },
      {
        id: 16,
        title: "Life Coaching",
        instructor: { name: "Daniel Brown", experience: "9+ years" },
        rating: 4.8,
        reviewCount: 180,
        image: serviceTwo
      }
    ]
  },
  {
    title: "Automotive & Transportation",
    items: [
      {
        id: 17,
        title: "Car Repair",
        instructor: { name: "Mike Johnson", experience: "15+ years" },
        rating: 4.8,
        reviewCount: 190,
        image: serviceThree
      },
      {
        id: 18,
        title: "Bike Servicing",
        instructor: { name: "Tom Baker", experience: "7+ years" },
        rating: 4.7,
        reviewCount: 140,
        image: serviceFour
      },
      {
        id: 19,
        title: "Driving Lessons",
        instructor: { name: "Steve Davis", experience: "10+ years" },
        rating: 4.9,
        reviewCount: 170,
        image: serviceFive
      }
    ]
  }
];