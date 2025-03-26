'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { PricingPlan } from '@/types/interface';

interface PricingCardProps {
  plan: PricingPlan;
  isPopular?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PricingCard({ plan, isPopular }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');

  const subscribeToPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/user/pricing/subscribe?planId=${plan.id}`);

      const data = response.data;

      if (data.status === 'success') {
        window.location.href = data.data.payment_link
        // setDialogType('success');
        // setDialogMessage('Subscription successful! 🎉');
      } else {
        setDialogType('error');
        setDialogMessage('Failed to subscribe. Please try again.');
      }
    } catch (error:any) {
      setDialogType('error');
      setDialogMessage(error.response.data.message);
    } finally {
      setLoading(false);
      setDialogOpen(true);
    }
  };

  let featuresObj: Record<string, any> = {};
  try {
    featuresObj = JSON.parse(plan.features);
  } catch (error) {
    // console.error('Error parsing features JSON:', error);
  }

  return (
    <>
      <motion.div variants={cardVariants}>
        <Card
          className={cn(
            'relative w-full p-6 rounded-2xl border transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-900',
            isPopular && 'border-primary shadow-xl scale-105'
          )}
        >
          {isPopular && (
            <Badge
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-medium"
              variant="default"
            >
              Most Popular
            </Badge>
          )}
          <CardHeader className="text-center space-y-3 pb-8 pt-10">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {plan.name}
            </h3>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold text-primary">{plan.price}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof plan.description === 'string' ? plan.description : plan.description[0]}
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5">
            <ul className="grid gap-3 text-sm">
              {Object.entries(featuresObj).map(([key, value]) => (
                <li key={key} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium capitalize text-gray-900 dark:text-white">
                      {key.replace(/_/g, ' ')}:
                    </span>{' '}
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pb-6 flex justify-center">
            <Button
              className={cn(
                'relative w-full px-6 py-3 text-lg font-semibold transition-all rounded-xl',
                isPopular
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'
              )}
              variant={isPopular ? 'default' : 'outline'}
              onClick={subscribeToPlan}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm rounded-lg shadow-lg bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700">
          <DialogHeader className="flex flex-col items-center space-y-4">
            {dialogType === 'success' ? (
              <CheckCircle className="h-14 w-14 text-green-500" />
            ) : (
              <XCircle className="h-14 w-14 text-red-500" />
            )}
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {dialogType === 'success' ? 'Subscription Successful' : 'Subscription Failed'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              className={cn(
                'w-full py-2.5 text-sm font-medium rounded-md',
                dialogType === 'success'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              )}
              onClick={() => setDialogOpen(false)}
            >
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
