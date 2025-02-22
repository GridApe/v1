'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from '@/shared/PricingCard';
import type { PricingPlan } from '@/types/interface';
import axios from 'axios';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);


  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await axios.get('/api/user/pricing');
        const json = res.data;

        if (json.status === 'success' && json.data) {
          let fetchedPlans = Array.isArray(json.data) ? json.data : json.data.plans || [];

          fetchedPlans = fetchedPlans.map((plan: { price: string; }) => ({
            ...plan,
            price: `₦${parseInt(plan.price, 10).toLocaleString()}`,
          }));

          const businessPlanIndex = fetchedPlans.findIndex(
            (plan: { name: string; }) => plan.name.toLowerCase() === 'business plan'
          );

          if (businessPlanIndex !== -1) {
            const businessPlan = fetchedPlans.splice(businessPlanIndex, 1)[0];
            fetchedPlans.splice(1, 0, businessPlan);
          }

          setPlans(fetchedPlans);
        } else {
          console.error('API response error:', json);
        }
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
      }
    };

    fetchPricing();
  }, []);

  if (!plans.length) {
    return (
      <motion.div
        className="flex min-h-[400px] items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <p className="text-muted-foreground">Loading pricing plans...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative mx-auto max-w-7xl px-4 py-20"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>
      <motion.div className="text-center space-y-4 mb-16" variants={fadeIn}>
        <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs. Always know what you'll pay.
        </p>
      </motion.div>
      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        {plans.map((plan, index) => (
          <motion.div key={plan.id} variants={fadeIn}>
            <PricingCard plan={plan} isPopular={index === 1} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
