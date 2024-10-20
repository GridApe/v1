import { Progress } from '@/components/ui/progress'
import React from 'react'
import { motion } from 'framer-motion'

interface UpgradePlanCardProps {
  emailSent: number
  contactLimit: number
  campaignLimit: number
}

export const UpgradePlanCard: React.FC<UpgradePlanCardProps> = ({ emailSent, contactLimit, campaignLimit }) => (
  <motion.div
    className=" border-[0.5px] border-[#dddddd] text-white p-4 rounded-lg mb-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <h3 className="font-semibold mb-2">Your plan</h3>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span>Email Sent</span>
          <span>{emailSent} of 100</span>
        </div>
        <Progress value={emailSent} className="h-2 bg-white" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span>Contact Limit</span>
          <span>{contactLimit} of 50</span>
        </div>
        <Progress value={(contactLimit / 50) * 100} className="h-2 bg-white" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span>Campaign Limit</span>
          <span>{campaignLimit} of 100</span>
        </div>
        <Progress value={campaignLimit} className="h-2 bg-white" />
      </div>
    </div>
  </motion.div>
)