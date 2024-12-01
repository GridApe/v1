'use client'

import * as React from 'react'
import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserNav } from './UserNav'
import { NotificationsList } from './NotificationList'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Message Received',
    description: 'You have a new message from Sarah',
    time: '5 min ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Project Update',
    description: 'Your project "Website Redesign" has been updated',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'Meeting Reminder',
    description: 'Team meeting starts in 30 minutes',
    time: '2 hours ago',
    isRead: true,
  },
]

export default function SearchBar({
  onSearch,
  placeholder = 'Search document, template,....',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className={`flex items-center justify-between gap-4 p-4 ${className}`}>
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            className="w-full rounded-full pl-10 pr-4 h-11 bg-muted/50 shadow-md"
          />
        </div>
      </form>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full h-11 w-11"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0">
            <NotificationsList
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <UserNav
          user={{
            name: "Lynda",
            email: "lyndaada80@gmail.com",
            image: "/placeholder.svg?height=32&width=32"
          }}
        />
      </div>
    </div>
  )
}

