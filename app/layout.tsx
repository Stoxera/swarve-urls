import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Swarve Links | Fast, Secure & Minimalist URL Shortener",
  description: "Transform long, messy URLs into clean, shareable links in seconds. Free, secure, and built for speed.",
  keywords: ["url shortener", "link management", "swarve links", "minimalist shortener", "custom links"],
  authors: [{ name: "Swarve Team" }],
  openGraph: {
    title: "Swarve Links - Simple Link Shortening",
    description: "The most elegant way to share your links on the web.",
    url: "https://swarve.links", 
    siteName: "Swarve Links",
    images: [
      {
        url: "/png.png",
        alt: "Swarve Links - Minimalist Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swarve Links",
    description: "Shorten your links with a single click.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white min-h-screen flex flex-col`}
      >

        
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        
        <Footer />

        <Analytics/>
      </body>
    </html>
  );
}