'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../Sidebar'

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setSidebarOpen(window.innerWidth >= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:block"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-1 overflow-auto bg-[#2E3192]">
        <div className="container mx-auto p-6 bg-[#fffae9de] rounded-xl">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          {children}
        </div>
      </main>
    </div>
  )
}