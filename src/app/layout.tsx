import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SEOScan Pro - Professional SEO Audit in 10 Minutes",
    template: "%s | SEOScan Pro",
  },
  description:
    "Get comprehensive technical SEO analysis for $49-149. No monthly subscription. Professional SEO audit in 10 minutes, not 7 days. Pay once, own forever.",
  keywords: [
    "SEO audit",
    "technical SEO",
    "website audit",
    "SEO analysis",
    "Core Web Vitals",
    "page speed",
    "SEO checker",
    "SEO tool",
  ],
  authors: [{ name: "SEOScan Pro" }],
  creator: "SEOScan Pro",
  publisher: "SEOScan Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://seoscanpro.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seoscanpro.com",
    title: "SEOScan Pro - Professional SEO Audit in 10 Minutes",
    description:
      "Get comprehensive technical SEO analysis for $49-149. No monthly subscription. Pay once, own forever.",
    siteName: "SEOScan Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEOScan Pro - Professional SEO Audit Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEOScan Pro - Professional SEO Audit in 10 Minutes",
    description:
      "Get comprehensive technical SEO analysis for $49-149. No monthly subscription.",
    images: ["/og-image.png"],
    creator: "@seoscanpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
