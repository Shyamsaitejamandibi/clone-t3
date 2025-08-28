import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T3.chat",
  description: "AI-powered chat interface built with T3 stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <DataStreamProvider>
              <Toaster />
              {children}
            </DataStreamProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
