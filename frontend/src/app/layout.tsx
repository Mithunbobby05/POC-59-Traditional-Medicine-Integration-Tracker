import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traditional & Complementary Medicine Integration Tracker",
  description: "Real Rails POC-59 workspace for traditional and complementary medicine integration.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
