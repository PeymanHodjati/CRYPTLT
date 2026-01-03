import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ManageSolanaAppKitProvider from "@/components/AppKitProvider";
import SecurityBanner from "@/components/SecurityBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manage Solana - Reclaim Your Solana Rent",
  description: "Find and reclaim rent from empty Solana token accounts",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0a0e12]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0e12] text-[#e8eaed]`}
      >
        <ManageSolanaAppKitProvider>
          <SecurityBanner />
          {children}
        </ManageSolanaAppKitProvider>
      </body>
    </html>
  );
}
