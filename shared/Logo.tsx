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
      src='/public/logo.svg'
      alt="Logo"
      className="w-10 h-10"
    />
    <span className="text-white font-semibold text-lg">Griddape</span>
  </motion.div>
)