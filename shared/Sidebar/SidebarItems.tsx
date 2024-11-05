import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { BarChartIcon, FileTextIcon, LayoutTemplateIcon, PuzzleIcon, SendIcon, UsersIcon } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface SidebarItem {
  name: string
  icon: React.ElementType
  path?: string // Add path for navigation
  locked?: boolean
  subitems?: { name: string; path: string }[] // Update subitems to include path
  expandable?: boolean
}

export const SidebarItems: React.FC = () => {
  const items: SidebarItem[] = [
    { name: 'Analytics', icon: BarChartIcon, path: '/' },
    { name: 'Landing page', icon: FileTextIcon, locked: true, path: '/landing' },
    {
      name: 'Template',
      icon: LayoutTemplateIcon,
      subitems: [
        { name: 'All templates', path: '/templates/all' },
        { name: 'Create Template', path: '/templates/create' },
        { name: 'Saved templates', path: '/templates/saved' },
        { name: 'My files', path: '/templates/my-files' },
        { name: 'Gallery', path: '/templates/gallery' },
      ],
      expandable: true,
    },
    {
      name: 'Campaigns',
      icon: SendIcon,
      subitems: [{ name: 'All campaigns', path: '/campaigns/all' }, { name: 'Create campaign', path: '/campaign/create' }],
      expandable: true,
    },
    { name: 'Integration', icon: PuzzleIcon, locked: true, path: '/integration' },
    {
      name: 'Audience',
      icon: UsersIcon,
      subitems: [{ name: 'All contacts', path: '/audience/all' }],
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
                  
                {item.locked ? <Button variant="ghost" className="w-full justify-between text-white hover:bg-indigo-700 hover:text-white" disabled>
                  <div className="flex items-center">
                    <span>{item.name}</span>
                  </div>
                </Button>
                : (
                  <Link href={item.path || '#'} passHref>
                  <Button variant="ghost" className="w-full justify-between text-white hover:bg-indigo-700 hover:text-white">
                    <div className="flex items-center">
                      <span>{item.name}</span>
                    </div>
                  </Button>
                </Link>
                )}
                </div>
                {item.locked && <LockClosedIcon className="w-4 h-4" />}
                {item.expandable && <ChevronDownIcon className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            {item.expandable && (
              <CollapsibleContent>
                <div className="ml-8 mt-2 space-y-1">
                  {item.subitems?.map((subitem) => (
                    <Link key={subitem.name} href={subitem.path} passHref>
                      <Button variant="ghost" className="w-full justify-start text-white hover:bg-indigo-700 hover:text-white">
                        {subitem.name}
                      </Button>
                    </Link>
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
