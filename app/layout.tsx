import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SignalingProvider } from "@/lib/webrtc/SignalingContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Q.E.D - File Sharing',
  description: 'Quod Erat Demonstrandum. Secure, direct, serverless file transfer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SignalingProvider>
          <CustomCursor />
          <AnimatedBackground />
          {children}
          <Footer />
        </SignalingProvider>
      </body>
    </html>
  );
}
