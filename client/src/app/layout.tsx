import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PrizmAi',
  description: 'From clutter to clarity.',
  keywords:
    'PDF, data, search, PrizmAi, technology, AI',
  authors: [{ name: 'Kirill Heitzler' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://PrizmAi.com/',
    title: 'PrizmAi - From clutter to clarity.',
    description: 'From clutter to clarity.',
    siteName: 'PrizmAi',
    images: [
      {
        url: 'https://voyada.com/opengraph.png',
        width: 1200,
        height: 630,
        alt: 'PrizmAi - From clutter to clarity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrizmAi - From clutter to clarity',
    description: 'From clutter to clarity',
    images: ['https://voyada.com/opengraph.png'],
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
