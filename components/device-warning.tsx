"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"

interface DeviceWarningProps {
  breakpoint?: string
  message?: string
  className?: string
  persistent?: boolean
}

const DeviceWarning: React.FC<DeviceWarningProps> = ({
  breakpoint = "(max-width: 1024px)",
  message = "For the best user experience, please use a PC to access this page.",
  className = "",
  persistent = false,
}) => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean | null>(null)
  const [showWarning, setShowWarning] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia(breakpoint)
    const updateMatchStatus = () => setIsMobileOrTablet(mediaQuery.matches)

    updateMatchStatus()

    mediaQuery.addEventListener("change", updateMatchStatus)

    return () => mediaQuery.removeEventListener("change", updateMatchStatus)
  }, [breakpoint])

  if (isMobileOrTablet === null || !isMobileOrTablet || !showWarning) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 px-4 pt-4 h-screen w-full ${className}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />

            <div className="p-4 pl-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Device Notice</h3>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 pr-4">{message}</p>

                {!persistent && (
                  <motion.button
                    onClick={() => setShowWarning(false)}
                    className="flex items-center justify-center w-7 h-7 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

export default DeviceWarning
