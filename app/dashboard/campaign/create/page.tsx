"use client"

import DeviceWarning from "@/components/device-warning"
import EmailComposer from "@/shared/EmailCreate/EmailComposer"
import { motion } from "framer-motion"

const Page = () => {
  return (
    <>
      <DeviceWarning persistent={false} />

      <motion.div
        className="p-4 md:p-6 lg:p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <EmailComposer />
      </motion.div>
    </>
  )
}

export default Page
