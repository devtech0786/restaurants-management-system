import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: { default: "Fastfo", template: "%s | Fastfo" },
  description: "Order your favourite food online",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Fastfo" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#E63946",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "14px",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#E63946", secondary: "#fff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
