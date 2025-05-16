import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EcoFleet',
  description: 'Efficient. Clean. Reliable',
  keywords: 'EcoFleet, Eco, Fleet, EcoFleet, EcoFleet, EcoFleet, EcoFleet',
  authors: [{ name: 'Kirill Heitzler' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hackxplore-rose.vercel.app',
    title: 'EcoFleet - Efficient. Clean. Reliable',
    description: 'Efficient. Clean. Reliable',
    siteName: 'EcoFleet',
    images: [
      {
        url: 'https://hackxplore-rose.vercel.appopengraph.png',
        width: 1200,
        height: 630,
        alt: 'EcoFleet - Efficient. Clean. Reliable',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoFleet - Efficient. Clean. Reliable',
    description: 'Efficient. Clean. Reliable',
    images: ['https://hackxplore-rose.vercel.app'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
