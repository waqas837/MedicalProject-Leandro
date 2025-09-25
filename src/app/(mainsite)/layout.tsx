import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medical - Premium Healthcare Services & Patient Registration",
  description: "Experience VIP-level healthcare services with Medical. Complete patient registration, access international facilities in Colombia and Dominican Republic, and receive specialized veteran support. Secure, HIPAA-compliant medical data collection with premium care.",
  keywords: "healthcare, patient registration, medical services, veteran healthcare, international facilities, HIPAA compliant, premium healthcare, medical data collection, Colombia healthcare, Dominican Republic healthcare",
  authors: [{ name: "Medical" }],
  openGraph: {
    title: "Medical - Premium Healthcare Services",
    description: "VIP-level healthcare services with international facility access and veteran support",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical - Premium Healthcare Services",
    description: "VIP-level healthcare services with international facility access and veteran support",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
