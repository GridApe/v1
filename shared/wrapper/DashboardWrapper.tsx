'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../Sidebar';
import { usePathname } from 'next/navigation';

import { DashboardProvider, useDashboardContext } from '@/app/context/DashboardContext';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useDashboardContext();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes('/dashboard/templates/')) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (!pathname.includes('/dashboard/templates/')) { 
        setSidebarOpen(window.innerWidth >= 768);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarOpen, pathname]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false)
  //   }, 1000)

  //   return () => clearTimeout(timer)
  // }, [pathname])

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-[#fffae9de]">
  //       <div className="loader">Loading...</div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatePresence>
        {(sidebarOpen || (!isMobile && !pathname.includes('/dashboard/templates/'))) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 md:relative"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative flex-1 overflow-hidden">
        <motion.main
          className="h-full overflow-auto bg-[#2E3192]"
          animate={{
            x: isMobile && sidebarOpen ? 256 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className=" mx-auto min-h-svh p-6 bg-[#ffffff] w-full rounded-s-3xl">
            <Button
              variant="outline"
              size="icon"
              className="md:hidden mb-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            {/* <AnimatePresence mode="wait"> */}
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
            {/* </AnimatePresence> */}
          </div>
        </motion.main>
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
