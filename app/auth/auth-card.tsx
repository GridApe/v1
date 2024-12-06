import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps): JSX.Element {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 flex items-center">
        <div className="w-12 h-12 mb-4">
          <Image src="/logo.svg" width={48} height={48} alt="" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
