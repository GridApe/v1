import { Progress } from '@/components/ui/progress';
import React from 'react';
import { motion } from 'framer-motion';

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
      className="border-[0.5px] border-[#dddddd] text-white p-4 rounded-lg mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="font-semibold mb-2 text-left">Your plan</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Email Sent</span>
            <span>{emailSent} of {emailLimitDisplay}</span>
          </div>
          <Progress value={emailPercentage} className="h-2 bg-white" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Contact Limit</span>
            <span>{contacts} of {contactLimitDisplay}</span>
          </div>
          <Progress value={contactPercentage} className="h-2 bg-white" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span>Campaign Limit</span>
            <span>{campaigns} of {campaignLimitDisplay}</span>
          </div>
          <Progress
            value={campaignLimit === 'Unlimited' ? 50 : campaignPercentage}
            className="h-2 bg-white"
          />
        </div>
      </div>
    </motion.div>
  );
};