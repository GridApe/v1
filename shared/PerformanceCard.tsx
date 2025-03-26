'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface PerformanceCardProps {
  value: string | number;
  label: string;
  color: string;
  icon: React.ReactNode;
  change?: string | number;
}

export default function PerformanceCard({ value, label, color, icon, change }: PerformanceCardProps) {
  const changeValue = typeof change === 'string' ? parseFloat(change) : change;
  const isPositive = changeValue ? changeValue > 0 : false;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <motion.div
      className="bg-white backdrop-blur-sm rounded-xl p-6 border-[0.5px] border-black/10 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <h3 className="text-black font-bold">{label}</h3>
        </div>
        {change !== undefined && (
          <motion.div 
            className={cn("flex items-center space-x-1", changeColor)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4" />
            ) : (
              <ArrowDownIcon className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {changeValue ? Math.abs(changeValue) : 0}%
            </span>
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="text-2xl font-bold text-black"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
