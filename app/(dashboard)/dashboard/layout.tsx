import React from "react";
import Header from "./_components/header";
import Sidebar from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5FFFD]">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
