import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Portal: Skills Inventory | Albert Linson",
  description: "Private career asset: 4-tier technical and sourcing skills matrix.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
