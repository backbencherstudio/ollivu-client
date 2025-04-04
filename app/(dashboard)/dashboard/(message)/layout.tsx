import React from 'react'

// app/(message)/message/layout.tsx
export default function MessageLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="h-screen overflow-hidden">
        {children}
      </div>
    );
  }
