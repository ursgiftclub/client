import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";

import RootProvider from "@/components/RootProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import "./globals.css";
import MobileBottomBar from "@/components/product/MobileBottomBar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://ursgiftclub.com"),

  title: {
    default: "URS Gift Club | Premium Gifts for Every Occasion",
    template: "%s | URS Gift Club",
  },

  description:
    "Discover premium gifts for birthdays, anniversaries, weddings, festivals, and special occasions at URS Gift Club. Luxury gifting made simple.",

  keywords: [
    "gift shop",
    "premium gifts",
    "birthday gifts",
    "anniversary gifts",
    "personalized gifts",
    "luxury gifts",
    "online gift store",
    "gift delivery",
    "URS Gift Club",
  ],

  authors: [
    {
      name: "URS Gift Club",
    },
  ],

  creator: "URS Gift Club",
  publisher: "URS Gift Club",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],

    apple: "/apple-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ursgiftclub.com",
    siteName: "URS Gift Club",

    title: "URS Gift Club | Premium Gifts for Every Occasion",

    description:
      "Explore premium and personalized gifts for birthdays, anniversaries, weddings, festivals, and every special moment.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "URS Gift Club",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "URS Gift Club | Premium Gifts for Every Occasion",

    description:
      "Luxury gifting made simple. Shop premium gifts online at URS Gift Club.",

    images: ["/og-image.jpg"],
  },

  category: "ecommerce",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,

  themeColor: "#7A1F3D", // burgundy
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <RootProvider>
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />

          {process.env.NODE_ENV === "production" && <Analytics />}
          <MobileBottomBar />
        </RootProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
