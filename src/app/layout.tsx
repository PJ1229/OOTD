// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OOTD",
  description: "The fast fashion industry encourages impulsive buying, leading to overconsumption and massive textile waste. Many people purchase clothes without considering their long-term value, often discarding them after minimal use. We were inspired to create OOTD to shift this mindset by promoting thoughtful purchasing habits. OOTD helps users make mindful decisions with an AI-powered virtual try-on tool that reduces unnecessary purchases. At the same time, it provides a fun, engaging way to discover new clothes, get outfit inspiration, and explore sustainable fashion options—making conscious shopping both easy and exciting.",
  manifest: "/manifest.json",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#000000" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192x192.jpg" },
    { rel: "icon", url: "/icon-192x192.jpg" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
