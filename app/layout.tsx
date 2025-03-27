import { Inter } from 'next/font/google';
import { AppConfig } from "@/config/app.config";
import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
