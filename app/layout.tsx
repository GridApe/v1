import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import localFont from 'next/font/local';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Gridape - Your Email Marketing Buddy',
  description:
    'Say hello to smarter, simpler email marketing with Gridape! Create, send, and track campaigns that get results—without the hassle. Let’s make inbox magic happen!',
  keywords: [
    'email marketing',
    'Gridape',
    'marketing campaigns',
    'email campaigns',
    'email automation',
  ],

  openGraph: {
    title: 'Gridape - Your Email Marketing Buddy',
    description:
      'Say hello to smarter, simpler email marketing with Gridape! Create, send, and track campaigns that get results—without the hassle. Let’s make inbox magic happen!',
    url: 'https://app.gridape.com',
    images: [
      {
        url: '/preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Gridape Open Graph Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gridape - Your Email Marketing Buddy',
    description: 'Say hello to smarter, simpler email marketing with Gridape!',
    images: ['/preview.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
