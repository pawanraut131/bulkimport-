import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ResumeAI — Bulk Resume Processing",
  description: "AI-powered bulk resume import, extraction, and intelligent candidate categorization platform for modern recruitment teams.",
  keywords: ["resume", "AI", "recruitment", "candidate", "bulk import"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen bg-[#08090c] bg-premium-pattern text-white">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
