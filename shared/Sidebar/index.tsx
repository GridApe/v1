import { Button } from '@/components/ui/button';
import { Logo } from '../Logo';
import { SidebarItems } from './SidebarItems';
import { UpgradePlanCard } from './UpgradePlanCard';
import { motion } from 'framer-motion';
import { CreateEmailModal } from '../Modal/CreateEmailModal';
import Link from 'next/link';

export default function Sidebar() {
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
        <UpgradePlanCard emailSent={30} contactLimit={30} campaignLimit={60} />
        <div className="bg-[#C4C6ED] text-[#0D0F56] p-4 rounded-lg text-sm">
          14 days left in trial.{' '}
          <Link href="/dashboard/pricing" className="p-0 h-auto text-[#E8590C] underline">
            Upgrade
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
