import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Transformation",
  description: "Share your church transformation on social media",
};

export const dynamic = 'force-dynamic';

export default function SharePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}