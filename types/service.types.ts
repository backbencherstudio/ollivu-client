// src/types/service.ts
// Update Service interface to accept both string and StaticImageData
import { StaticImageData } from "next/image";

export interface Service {
  id: number;
  title: string;
  category: string;
  instructor: {
    name: string;
    experience: string;
  };
  rating: number;
  reviewCount: number;
  image: string | StaticImageData;
}