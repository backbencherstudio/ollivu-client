import React from "react";
import Banner from "./_components/home-page/banner";
import ServicesSection from "./_components/home-page/services";
import ValuePropositionSection from "./_components/home-page/value-proposition";
import ServiceCategoriesSection from "./_components/home-page/Service-categories";
import HowWorks from "./_components/home-page/how-it-works";
import Community from "./_components/home-page/community";
import Footer from "./_components/footer";

export default function HomePage() {
  return <div className="">
    <Banner />
    <ServicesSection />
    <ValuePropositionSection />
    <ServiceCategoriesSection />
    <HowWorks />
    <Community />
    <Footer/>
  </div>;
}
