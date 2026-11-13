import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Portal: Job Description Matcher | Albert Linson",
  description: "Private career asset: AI-assisted ATS resume match scoring.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function MatcherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
