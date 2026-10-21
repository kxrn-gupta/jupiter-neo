import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jupiter-neo.vercel.app"),
  title: "Jupiter Neo — Next-Gen Consumer DeFi Experience on Solana",
  description:
    "A clean, institutional redesign of Jupiter Exchange featuring Blowfish Pre-Flight Simulation, Mint Guardian Security, and Solana Validator RPC Engine. Built for Superteam India by Karan Gupta (Gupta Ventures).",
  keywords: [
    "Jupiter",
    "Solana",
    "DEX",
    "DeFi",
    "Superteam India",
    "Blowfish Simulation",
    "Jito MEV",
    "Meteora DLMM",
    "Raycast UI",
    "Linear Design",
    "Gupta Ventures",
  ],
  authors: [{ name: "Karan Gupta", url: "https://github.com/karan5028ji" }],
  creator: "Karan Gupta (Gupta Ventures)",
  openGraph: {
    title: "Jupiter Neo — Next-Gen Consumer DeFi Experience on Solana",
    description:
      "A clean, institutional redesign of Jupiter Exchange featuring Blowfish Pre-Flight Simulation, Mint Guardian Security, and Solana Validator RPC Engine.",
    url: "https://jupiter-neo.vercel.app",
    siteName: "Jupiter Neo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jupiter Neo — Next-Gen Consumer DeFi Experience on Solana",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jupiter Neo — Next-Gen Consumer DeFi on Solana",
    description:
      "Consumer simplicity on the surface, institutional Solana power underneath. Redesigned for Superteam India by Karan Gupta (@kxrn_gupta).",
    creator: "@kxrn_gupta",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#07080B] text-white selection:bg-[#14F195]/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
