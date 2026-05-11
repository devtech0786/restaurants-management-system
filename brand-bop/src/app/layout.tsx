import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brand BOP — Restaurant Admin Panel",
    template: "%s | Brand BOP",
  },
  description: "Restaurant Business Operations Platform — manage your brand, franchises, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
