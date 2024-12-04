'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MoreVertical, ArrowUp } from 'lucide-react';
import clsx from 'clsx';

interface PerformanceCardProps {
  value: number | string;
  change?: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ value, change, label, color, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl bg-gradient-to-b from-white to-gray-50 p-5 md:p-6 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
    >
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div
            className="flex justify-center items-center rounded-full shadow-md mb-4"
            style={{
              backgroundColor: color,
              width: 56,
              height: 56,
            }}
          >
            <div className="text-white text-lg">{icon}</div>
          </div>

          <p className="text-sm font-medium text-gray-600">{label}</p>

          <div className="flex items-center justify-between w-full mt-2 bg-white">
            <p className="text-3xl font-bold text-gray-800">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-2 py-1">
                <ArrowUp size={16} className="text-green-600 mr-1" />
                <span className="text-green-600 text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PerformanceCard;
