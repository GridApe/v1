import { Button } from '@/components/ui/button'
import { Wand } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { MagicWandIcon } from '@radix-ui/react-icons'

export const CreateButton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Button className='px-10 py-7 rounded-3xl border border-[#bbbbbb] bg-transparent text-2xl font-semibold space-x-4'>
        <MagicWandIcon className='font-bold text-xl' />
        <span>Create</span>
      </Button>
    </motion.div>
  )
}