import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import { buildWebSiteSchema } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Supportive — Mental health and supportive services careers",
    template: "%s | Supportive",
  },
  description: "Mental health and supportive services careers, Australia-wide. Browse clinical, community, AOD, peer work, and NDIS roles posted by mission-aligned employers.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Supportive — Mental health and supportive services careers",
    description: "Mental health and supportive services careers, Australia-wide. Browse clinical, community, AOD, peer work, and NDIS roles.",
    type: "website",
    siteName: "Supportive",
    locale: "en_AU",
    url: SITE_URL,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Supportive — Mental health careers in Australia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Supportive — Mental health careers in Australia",
    description: "Browse clinical, community, AOD, peer work, and NDIS roles posted by mission-aligned employers.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : {}),
    },
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
        <JsonLd data={buildWebSiteSchema()} />
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
