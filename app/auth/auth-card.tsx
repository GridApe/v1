import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps): JSX.Element {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card className="w-full shadow-lg rounded-xl overflow-hidden border-none bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-14 h-14"
          >
            <Image src="/logo.svg" width={56} height={56} alt="Logo" />
          </motion.div>
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}
