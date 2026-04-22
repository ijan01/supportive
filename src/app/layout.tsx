import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://supportive.com.au";

export const metadata: Metadata = {
  title: {
    default: "Supportive — Mental health and supportive services careers",
    template: "%s | Supportive",
  },
  description: "Mental health and supportive services careers, Australia-wide. Browse clinical, community, AOD, peer work, and NDIS roles posted by mission-aligned employers.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Supportive — Mental health and supportive services careers",
    description: "Mental health and supportive services careers, Australia-wide. Browse clinical, community, AOD, peer work, and NDIS roles.",
    type: "website",
    siteName: "Supportive",
    locale: "en_AU",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Supportive — Mental health careers in Australia",
    description: "Browse clinical, community, AOD, peer work, and NDIS roles posted by mission-aligned employers.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en-AU" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
