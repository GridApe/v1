import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { BarChartIcon, FileTextIcon, LayoutTemplateIcon, PuzzleIcon, SendIcon, UsersIcon } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

interface SidebarItem {
  name: string
  icon: React.ElementType
  locked?: boolean
  subitems?: string[]
  expandable?: boolean
}

export const SidebarItems: React.FC = () => {
  const items: SidebarItem[] = [
    { name: 'Analytics', icon: BarChartIcon, locked: true },
    { name: 'Landing page', icon: FileTextIcon, locked: true },
    {
      name: 'Template',
      icon: LayoutTemplateIcon,
      subitems: ['All templates', 'Saved templates', 'My files', 'Gallery'],
      expandable: true,
    },
    {
      name: 'Campaigns',
      icon: SendIcon,
      subitems: ['All campaigns'],
      expandable: true,
    },
    { name: 'Integration', icon: PuzzleIcon, locked: true },
    {
      name: 'Audience',
      icon: UsersIcon,
      subitems: ['All contacts'],
      expandable: true,
    },
  ]

  return (
    <nav className="space-y-1">
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <Button variant="ghost" className="w-full justify-between text-white hover:bg-indigo-700 hover:text-white">
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </div>
                {item.locked && <LockClosedIcon className="w-4 h-4" />}
                {item.expandable && <ChevronDownIcon className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            {item.expandable && (
              <CollapsibleContent>
                <div className="ml-8 mt-2 space-y-1">
                  {item.subitems?.map((subitem) => (
                    <Button key={subitem} variant="ghost" className="w-full justify-start text-white hover:bg-indigo-700 hover:text-white">
                      {subitem}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
        </motion.div>
      ))}
    </nav>
  )
}