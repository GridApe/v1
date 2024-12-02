import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication pages for the application',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={` antialiased min-h-screen flex items-center justify-center bg-[#4338ca] p-4`}
      >
        <div className="w-full max-w-md">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
