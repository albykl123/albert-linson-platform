import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Portal: Resume & Skills | Albert Linson",
  description: "Private career asset: master resume exports and skills matrix.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
