import * as React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: () => void;
}

export function NotificationList({ notificationCount, onMarkAsRead }: NotificationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full focus:outline-none focus:border-0"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notifications.length > 99 ? "99+" : notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-4 mt-2"
        sideOffset={5}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button
            variant="ghost"
            className="rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-8 w-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="outline-1 shadow-md w-56 p-2 bg-white rounded-md border-1 border-gray-500">
          <div className="flex justify-end">
            <Button className="hover:bg-blue-800 mt-5 text-xs p-2" onClick={onMarkAsRead}>
              Mark as Read
            </Button>
          </div>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="cursor-pointer">
              <h1>Hello world</h1>
              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {notificationCount > 0 && (
        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
    </div>
  );
}
