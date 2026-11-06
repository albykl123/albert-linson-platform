import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AvatarChatbot } from "@/components/AvatarChatbot";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Albert Linson — Personal Intelligence Platform",
  description:
    "Official portfolio and personal intelligence ecosystem of Albert Linson. Frontend Developer, IT Professional, AI Enthusiast & Researcher.",
  keywords: [
    "Albert Linson",
    "Albert Kalampadan Linson",
    "ATSForge AI",
    "Frontend Developer",
    "Artificial Intelligence",
    "US IT Recruitment",
    "Medical Imaging Research",
    "FreeStack",
  ],
  authors: [{ name: "Albert Linson" }],
  openGraph: {
    title: "Albert Linson — Personal Intelligence Platform",
    description: "Building Intelligent Digital Experiences.",
    url: "https://albertlinson.com",
    siteName: "Albert Linson Platform",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-midnight-950 text-gray-100 flex min-h-screen flex-col antialiased selection:bg-electric-500/30 selection:text-white">
        <AnalyticsTracker />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AvatarChatbot />
      </body>
    </html>
  );
}
