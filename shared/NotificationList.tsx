import * as React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface NotificationDropdownProps {
  notificationCount: number;
  onMarkAsRead: () => void;
}

export function NotificationList({
  notificationCount,
  onMarkAsRead,
}: NotificationDropdownProps) {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none focus:outline-none border-0 focus:border-0">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-8 w-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="outline-1 shadow-md w-56 p-2 bg-white rounded-md border-1 border-gray-500">
          <div className="flex justify-end">
            <Button
              className="hover:bg-blue-800 mt-5 text-xs p-2"
              onClick={onMarkAsRead}
            >
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
