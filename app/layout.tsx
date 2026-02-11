import React from "react";
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Web3Provider } from '@/components/web3-provider';
import { NotificationProvider } from '@/lib/notification-store';
import { GlobalNotifications } from '@/components/global-notifications'; // ✅ ADD

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'DARE PROTOCOL - Onchain Commitment System',
  description: 'Put real stakes behind real commitments. Dare. Stake. Prove it.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/images/logo.png' }],
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <Web3Provider>
          <NotificationProvider>
            {/* ✅ Fully client-controlled */}
            <GlobalNotifications />

            {children}
          </NotificationProvider>
        </Web3Provider>

        <Analytics />
      </body>
    </html>
  );
}
