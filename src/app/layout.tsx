import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster as Sonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Honest Tinkerer — practical AI building without the hype",
  description:
    "Field notes from someone building small things with AI in the trenches, not on a pedestal. A public shipping log of what broke, what shipped, and the boring tools that quietly carried the weight.",
  keywords: [
    "indie builder",
    "AI building",
    "shipping log",
    "vibe coding",
    "Google Workspace",
    "minimalist stack",
    "honest tinkerer",
  ],
  authors: [{ name: "The Honest Tinkerer" }],
  openGraph: {
    title: "The Honest Tinkerer",
    description:
      "Practical AI building without the hype, from someone who's in the trenches, not on a pedestal.",
    siteName: "The Honest Tinkerer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Honest Tinkerer",
    description:
      "Practical AI building without the hype, from someone who's in the trenches, not on a pedestal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Sonner position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
