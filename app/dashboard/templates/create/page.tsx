"use client"

import DeviceWarning from "@/components/device-warning"
import { motion } from "framer-motion"
import CreateTemplatePage from "."

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
        <CreateTemplatePage />
      </motion.div>
    </>
  )
}

export default Page
