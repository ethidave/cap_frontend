import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CapTrade Pro — Trade Smarter, Trade Anywhere", template: "%s | CapTrade Pro" },
  description: "Zero-commission Forex trading with spreads from 0.0 pips. Execute trades in under 10ms. Trusted by 250,000+ traders worldwide.",
  keywords: ["forex trading", "online trading", "currency exchange", "CFD trading", "trading platform"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CapTrade Pro",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

import { ToastProvider } from "@/components/ToastProvider";
import { MaintenanceGuard } from "@/components/MaintenanceGuard";
import { SocketProvider } from "@/components/SocketProvider";
import { SupportWidget } from "@/components/SupportWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/pwa-icon-192.png" />
        <meta name="theme-color" content="#00FFA3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CapTrade Pro" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#020617] text-slate-200 overflow-x-hidden`}>
        <ToastProvider>
          <SocketProvider>
            <MaintenanceGuard>
              {children}
            </MaintenanceGuard>
            <SupportWidget />
          </SocketProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
