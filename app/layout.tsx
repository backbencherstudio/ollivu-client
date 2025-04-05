import { Inter } from 'next/font/google';
import { AppConfig } from "@/config/app.config";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: AppConfig().app.name,
  description: AppConfig().app.slogan,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="inter_cbef4b12-module__km-56a__variable">
      <body>{children}</body>
    </html>
  );
}
