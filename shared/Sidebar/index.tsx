import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';
import { SidebarItems } from './SidebarItems';
import { UpgradePlanCard } from './UpgradePlanCard';
import { motion } from 'framer-motion';
import { CreateEmailModal } from '../Modal/CreateEmailModal';
import Link from 'next/link';
import { useSidebarAnalytics } from '@/hooks/useSidebarAnalytics';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { analytics, loading, error } = useSidebarAnalytics();
  // console.log(analytics);
  // console.log(analytics);
  return (
    <motion.div
      className="w-64 relative h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#2E3192] to-[#1a1c5c]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#3639A0] rounded-full blur opacity-80"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#3639A0] rounded-full blur opacity-80"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3639A0] rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo section */}
        <div className="p-4 border-b border-white/10">
          <Logo />
        </div>

        {/* Create Email Button */}
        <div className="px-4 py-3">
          <CreateEmailModal />
        </div>

        {/* Navigation Items with custom scrollbar */}
        <div className={cn(
          "flex-1 overflow-y-auto px-2 py-4",
          "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
          "hover:scrollbar-thumb-white/30",
          "scrollbar-thumb-rounded-full",
          "scrollbar-track-rounded-full",
          "scrollbar-thumb-hover:bg-white/40",
          "scrollbar-thumb-active:bg-white/50",
          "scrollbar-thumb-transition-colors",
          "scrollbar-thumb-duration-200"
        )}>
          <SidebarItems />
        </div>

        {/* Bottom section with plan info */}
        <div className="p-4 border-t border-white/10">
          {loading ? (
            <div className="bg-white/5 backdrop-blur-sm text-white p-4 rounded-xl mb-4">
              <h3 className="font-semibold mb-2 text-left">Your plan</h3>
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-2 bg-white/20 rounded mb-2"></div>
                  <div className="h-2 bg-white/20 rounded"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-2 bg-white/20 rounded mb-2"></div>
                  <div className="h-2 bg-white/20 rounded"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-2 bg-white/20 rounded mb-2"></div>
                  <div className="h-2 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/5 backdrop-blur-sm text-white p-4 rounded-xl mb-4">
              <h3 className="font-semibold mb-2 text-left">Your plan</h3>
              <p className="text-sm text-white/80 mb-2">Unable to load plan data</p>
              <Link 
                href="/dashboard/pricing" 
                className="text-sm text-[#E8590C] hover:text-[#ff6b1a] transition-colors inline-flex items-center gap-1"
              >
                View pricing plans
                <span className="text-xs">→</span>
              </Link>
            </div>
          ) : analytics ? (
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
                <motion.div 
                  className="bg-[#C4C6ED] text-[#0D0F56] p-4 rounded-xl text-sm shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {analytics.trialDaysLeft} days left in trial.{' '}
                  <Link 
                    href="/dashboard/pricing" 
                    className="text-[#E8590C] hover:text-[#ff6b1a] transition-colors inline-flex items-center gap-1"
                  >
                    Upgrade
                    <span className="text-xs">→</span>
                  </Link>
                </motion.div>
              )}
            </>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm text-white p-4 rounded-xl mb-4">
              <h3 className="font-semibold mb-2 text-left">Your plan</h3>
              <Link 
                href="/dashboard/pricing" 
                className="text-sm text-[#E8590C] hover:text-[#ff6b1a] transition-colors inline-flex items-center gap-1"
              >
                Choose a plan
                <span className="text-xs">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
