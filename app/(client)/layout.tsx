import React from "react";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="">       
      {children}
      </div>
      <Footer />
    </div>
  );
}
