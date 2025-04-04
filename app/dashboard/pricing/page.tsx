'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PricingTable } from '@/shared/PricingTable';
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
          // let fetchedPlans = Array.isArray(json.data) ? json.data : json.data.plans || [];

          // fetchedPlans = fetchedPlans.map((plan: { price: string; }) => ({
          //   ...plan,
          //   price: `₦${parseInt(plan.price, 10).toLocaleString()}`,
          // }));

          // const businessPlanIndex = fetchedPlans.findIndex(
          //   (plan: { name: string; }) => plan.name.toLowerCase() === 'business plan'
          // );

          // if (businessPlanIndex !== -1) {
          //   const businessPlan = fetchedPlans.splice(businessPlanIndex, 1)[0];
          //   fetchedPlans.splice(1, 0, businessPlan);
          // }

          setPlans(json.data.plans);
        }
      } catch (error) {
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
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="h-[400px] w-full max-w-3xl bg-gray-100 rounded-xl"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white to-gray-50"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="relative mx-auto max-w-7xl px-4 py-20">
        <div className="absolute inset-0 -z-10 h-full w-full">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
        </div>
        <motion.div className="text-center space-y-4 mb-16" variants={fadeIn}>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Always know what you'll pay.
          </p>
        </motion.div>
        <motion.div
          className="w-full"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <PricingTable plans={plans} />
        </motion.div>
      </div>
    </motion.div>
  );
}
