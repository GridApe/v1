"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "../Sidebar"
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, isMobile, setSidebarOpen } = useSidebar()

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 md:relative"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative flex-1 overflow-hidden">
        <motion.main
          className="h-full overflow-auto bg-[#2E3192]"
          animate={{
            marginLeft: isMobile && sidebarOpen ? "256px" : "0",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="mx-auto min-h-svh p-0 bg-[#ffffff] w-full rounded-s-3xl">
            {/* TopBar will be rendered by the page layout, not here */}
            <motion.div
              key={Math.random()} // Use a more reliable key if possible
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4"
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
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}

