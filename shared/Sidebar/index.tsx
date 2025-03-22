import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';
import { SidebarItems } from './SidebarItems';
import { UpgradePlanCard } from './UpgradePlanCard';
import { motion } from 'framer-motion';
import { CreateEmailModal } from '../Modal/CreateEmailModal';
import Link from 'next/link';
import { useSidebarAnalytics } from '@/hooks/useSidebarAnalytics';

export default function Sidebar() {
  const { analytics, loading, error } = useSidebarAnalytics();
  // console.log(analytics);
  return (
    <motion.div
      className="w-64 relative text-center bg-[#2E3192] h-screen p-4 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute bg-[#3639A0] w-96 h-96 rounded-full bottom-0 -left-1/2 translate-x-1/2 -z-10"></div>
      <div className="absolute bg-[#3639A0] w-96 h-96 rounded-full bottom-3/4 -right-1/2 -translate-x-1/2 -z-10"></div>
      <Logo />
      <CreateEmailModal />
      <div className="mt-8 mb-auto overflow-auto">
        <SidebarItems />
      </div>
      <div className="mt-auto">
        {loading ? (
          // Loading state
          <div className="border-[0.5px] border-[#dddddd] text-white p-4 rounded-lg mb-4 opacity-70">
            <h3 className="font-semibold mb-2 text-left">Your plan</h3>
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-2 bg-white/30 rounded mb-2"></div>
                <div className="h-2 bg-white/30 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-2 bg-white/30 rounded mb-2"></div>
                <div className="h-2 bg-white/30 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-2 bg-white/30 rounded mb-2"></div>
                <div className="h-2 bg-white/30 rounded"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="border-[0.5px] border-[#dddddd] text-white p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 text-left">Your plan</h3>
            <p className="text-sm text-white/80 mb-2">Unable to load plan data</p>
            <Link href="/dashboard/pricing" className="text-sm text-[#E8590C] underline">
              View pricing plans
            </Link>
          </div>
        ) : analytics ? (
          // Success state with data
          <>

            <UpgradePlanCard
              planName={analytics.planName}
              emailSent={analytics.emailSent}
              emailLimit={analytics.emailLimit}
              contacts={analytics.contacts}
              contactLimit={analytics.contactLimit}
              campaigns={analytics.campaigns}
              campaignLimit={analytics.campaignLimit}
              isOnTrial={analytics.isOnTrial}
              trialDaysLeft={analytics.trialDaysLeft}
            />

            {analytics.isOnTrial && analytics.trialDaysLeft !== undefined && (
              <div className="bg-[#C4C6ED] text-[#0D0F56] p-4 rounded-lg text-sm">
                {analytics.trialDaysLeft} days left in trial.{' '}
                <Link href="/dashboard/pricing" className="p-0 h-auto text-[#E8590C] underline">
                  Upgrade
                </Link>
              </div>
            )}
          </>
        ) : (
          // Fallback for no data
          <div className="border-[0.5px] border-[#dddddd] text-white p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 text-left">Your plan</h3>
            <Link href="/dashboard/pricing" className="text-sm text-[#E8590C] underline">
              Choose a plan
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}