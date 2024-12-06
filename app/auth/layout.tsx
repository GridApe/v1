import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication pages for the application',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    // <html lang="en">
      <div
        className={` antialiased min-h-screen flex items-center justify-center bg-[#4338ca] p-4`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <div className="w-full max-w-md">{children}</div>
          <Toaster />
        </Suspense>
      </div>
    // </html>div
  );
}
