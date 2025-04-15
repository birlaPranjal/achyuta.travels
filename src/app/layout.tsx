import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/hooks/use-toast";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CryptoProvider } from '@/context/CryptoContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Achyuta Travels - Discover India",
  description: "Experience the beauty and culture of India with Achyuta Travels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <AuthProvider>
            <CryptoProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CryptoProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
