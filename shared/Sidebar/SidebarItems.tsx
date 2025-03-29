import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDownIcon, LockClosedIcon } from '@radix-ui/react-icons';

import {
  BarChartIcon,
  CogIcon,
  FileTextIcon,
  LayoutTemplateIcon,
  PuzzleIcon,
  SendIcon,
  UsersIcon,
  House,
  FileStack,
  DollarSign,
} from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  path?: string;
  locked?: boolean;
  subitems?: { name: string; path: string }[];
  expandable?: boolean;
}

export const SidebarItems: React.FC = () => {
  const pathname = usePathname();
  const items: SidebarItem[] = [
    { name: 'Dashboard', icon: House, path: '/dashboard/' },
    { name: 'Analytics', icon: BarChartIcon, locked: true, path: '/dashboard/' },
    {
      name: 'Template',
      icon: LayoutTemplateIcon,
      subitems: [
        { name: 'All templates', path: '/dashboard/templates/all' },
        { name: 'Create Template', path: '/dashboard/templates/create' },
        { name: 'My templates', path: '/dashboard/templates/saved' },
      ],
      expandable: true,
    },
    {
      name: 'Campaigns',
      icon: SendIcon,
      subitems: [
        { name: 'All campaigns', path: '/dashboard/campaign/all' },
        { name: 'Create campaign', path: '/dashboard/campaign/create' },
      ],
      expandable: true,
    },
    { name: 'Landing page', icon: FileTextIcon, locked: true, path: '/dashboard/landing' },
    { name: 'Forms', icon: FileTextIcon, path: '/dashboard/form-widget' },
    { name: 'Integration', icon: PuzzleIcon, locked: true, path: '/dashboard/integration' },
    { name: 'Audience', icon: UsersIcon, path: '/dashboard/audience/all' },
    { name: 'My files', icon: FileStack, locked: true, path: '/dashboard/templates/my-files' },
    { name: 'Settings', icon: CogIcon, path: '/dashboard/settings' },
    { name: 'Pricing', icon: DollarSign, path: '/dashboard/pricing' },
  ];

  const isActive = (path: string) => pathname === path;
  const isSubItemActive = (subitems: { path: string }[]) => 
    subitems.some(subitem => pathname === subitem.path);

  return (
    <nav className="space-y-1">
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {item.expandable ? (
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200",
                    isSubItemActive(item.subitems || []) && "bg-white/10 text-white"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDownIcon 
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isSubItemActive(item.subitems || []) && "transform rotate-180"
                    )} 
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <motion.div 
                  className="ml-8 mt-2 space-y-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.subitems?.map((subitem) => (
                    <Link 
                      key={subitem.name} 
                      href={subitem.path} 
                      className={cn(
                        "block w-full rounded-md transition-all duration-200",
                        "hover:bg-white/10 hover:text-white",
                        isActive(subitem.path) && "bg-white/10 text-white"
                      )}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white/80"
                      >
                        <span className="truncate">{subitem.name}</span>
                      </Button>
                    </Link>
                  ))}
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link 
              href={item.path || '#'} 
              className={cn(
                "block w-full rounded-md transition-all duration-200",
                "hover:bg-white/10 hover:text-white",
                isActive(item.path || '') && "bg-white/10 text-white"
              )}
            >
              <Button
                variant="ghost"
                className="w-full justify-between text-white/80"
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.locked ? (
                    <span className="opacity-50">{item.name}</span>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
                {item.locked && <LockClosedIcon className="w-4 h-4 opacity-50" />}
              </Button>
            </Link>
          )}
        </motion.div>
      ))}
    </nav>
  );
};
