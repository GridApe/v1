import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
        <CardHeader className="flex flex-col items-center gap-3 pb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-16 h-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-xl" />
            <Image 
              src="/logo.svg" 
              width={64} 
              height={64} 
              alt="Logo" 
              className="relative z-10 fill-blue-600"
            />
          </motion.div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#4338ca] to-indigo-900 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">{children}</CardContent>
      </Card>
    </motion.div>
  );
}
