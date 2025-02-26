import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WalletContextProvider } from '@/context/WalletContext';
import Header from '@/components/Header';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TradesXBT - AI Powered Solana Trading',
  description: 'AI-powered trading analytics and signals for the Solana ecosystem',
  keywords: 'Solana, trading, crypto, AI, blockchain, TradesXBT, cryptocurrency, SOL, BONK, JUP',
  authors: [{ name: 'TradesXBT Team' }],
  creator: 'TradesXBT',
  publisher: 'TradesXBT',
  metadataBase: new URL('https://tradesxbt.com'),
  openGraph: {
    title: 'TradesXBT - AI Powered Solana Trading',
    description: 'AI-powered trading analytics and signals for the Solana ecosystem',
    url: 'https://tradesxbt.com',
    siteName: 'TradesXBT',
    images: [
      {
        url: 'https://tradesxbt.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TradesXBT - Powered by AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradesXBT - AI Powered Solana Trading',
    description: 'AI-powered trading analytics and signals for the Solana ecosystem',
    creator: '@tradesxbt',
    images: ['https://tradesxbt.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: 'https://tradesxbt.com/manifest.json',
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <WalletContextProvider>
            <Header />
            <main className="min-h-screen bg-[#050505]">
              {children}
            </main>
            {/* Vercel Analytics */}
            <Analytics />
            {/* Vercel Speed Insights */}
            <SpeedInsights />
            {/* Real-time collaboration script (Vercel Pro feature) */}
            <Script 
              id="vercel-live-feedback"
              strategy="afterInteractive"
              src="https://feedback.vercel.app/api.js"
              data-project-id="tradesxbt"
            />
          </WalletContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}