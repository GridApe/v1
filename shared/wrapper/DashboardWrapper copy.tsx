'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../Sidebar';
import { usePathname } from 'next/navigation';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if current page is a template editor page
  const isTemplateEditorPage = pathname?.includes('/templates/create') || 
                              pathname?.includes('/templates/edit') || 
                              pathname?.includes('/templates/ai');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Only auto-open sidebar if not on template editor page
      setSidebarOpen(window.innerWidth >= 768 && !isTemplateEditorPage);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isTemplateEditorPage]);

  // Effect to handle sidebar state when navigating to/from template editor pages
  useEffect(() => {
    if (isTemplateEditorPage) {
      setSidebarOpen(false);
    } else if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isTemplateEditorPage, isMobile]);

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
        {(sidebarOpen || (!isMobile && !isTemplateEditorPage)) && (
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
            marginLeft: isMobile && sidebarOpen ? '256px' : '0',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="mx-auto min-h-svh p-0 bg-[#ffffff] w-full rounded-s-3xl">
            <div className="sticky top-0 z-50 flex items-center p-4 bg-white/80 backdrop-blur-sm border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
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
