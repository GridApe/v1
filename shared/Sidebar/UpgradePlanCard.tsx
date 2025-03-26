import { Progress } from '@/components/ui/progress';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UpgradePlanCardProps {
  emailSent: number;
  emailLimit: number | string;
  contacts: number;
  contactLimit: number | string;
  campaigns: number;
  campaignLimit: number | string | 'Unlimited';
  isOnTrial?: boolean;
  trialDaysLeft?: number;
}

export const UpgradePlanCard: React.FC<UpgradePlanCardProps> = ({
  emailSent,
  emailLimit,
  contacts,
  contactLimit,
  campaigns,
  campaignLimit,
  isOnTrial,
  trialDaysLeft,
}) => {
  // Calculate percentages for progress bars
  const emailPercentage = typeof emailLimit === 'number' && emailLimit > 0
    ? (emailSent / emailLimit) * 100
    : emailSent;

  const contactPercentage = typeof contactLimit === 'number' && contactLimit > 0
    ? (contacts / contactLimit) * 100
    : (contacts / 50) * 100;

  const campaignPercentage = typeof campaignLimit === 'number' && campaignLimit > 0
    ? (campaigns / campaignLimit) * 100
    : campaigns;

  // Format display values
  const emailLimitDisplay = emailLimit || 100;
  const contactLimitDisplay = contactLimit || 50;
  const campaignLimitDisplay = campaignLimit === 'Unlimited' ? 'Unlimited' : (campaignLimit || 100);

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm text-white p-4 rounded-xl mb-4 shadow-lg border border-white/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="font-semibold mb-4 text-left">Your plan</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Email Sent</span>
            <span className="text-sm font-medium">{emailSent} of {emailLimitDisplay}</span>
          </div>
          <Progress 
            value={emailPercentage} 
            className={cn(
              "h-1.5",
              emailPercentage > 90 ? "bg-red-500/20" : "bg-white/20"
            )}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Contact Limit</span>
            <span className="text-sm font-medium">{contacts} of {contactLimitDisplay}</span>
          </div>
          <Progress 
            value={contactPercentage} 
            className={cn(
              "h-1.5",
              contactPercentage > 90 ? "bg-red-500/20" : "bg-white/20"
            )}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Campaign Limit</span>
            <span className="text-sm font-medium">{campaigns} of {campaignLimitDisplay}</span>
          </div>
          <Progress
            value={campaignLimit === 'Unlimited' ? 50 : campaignPercentage}
            className={cn(
              "h-1.5",
              campaignPercentage > 90 ? "bg-red-500/20" : "bg-white/20"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};
