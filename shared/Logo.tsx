import React from "react"
import { motion } from 'framer-motion'
export const Logo: React.FC = () => (
  <motion.div
    className="flex items-center space-x-2 mb-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <img
      src='/logo.svg'
      alt="Logo"
      className="w-14 h-14"
    />
    <span className="text-white font-semibold text-lg sr-only">Gridape</span>
  </motion.div>
)