"use client"
import React from 'react'
import EmailTemplateEditor from './index';
import DeviceWarning from '@/components/device-warning';
import { motion } from 'framer-motion';

const Editor = ({
  params,
}: {
  params: { templateid: string };
}) => {
  return (
    <>
      <DeviceWarning persistent={false} />

      <motion.div
        className="p-4 md:p-6 lg:p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <EmailTemplateEditor getTemplateId={params.templateid} />
      </motion.div>
    </>
  )
}

export default Editor
