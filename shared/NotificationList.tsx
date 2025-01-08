import * as React from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Notification } from '@/types/interface';
import { formatTimestamp } from '@/utils/utils';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead, onMarkAllAsRead, onRemove }: NotificationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {notifications.length !== 0 && (<Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs border border-gray-300"
          >
            Mark all as read
          </Button>)}
        </div>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No new notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-md transition-colors duration-200 ease-in-out ${notification.is_read ? 'bg-background' : 'bg-accent'
                  } hover:bg-accent-hover cursor-pointer`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between hover:bg-gray-200 p-1 rounded-sm">
                  <div className="space-y-1 flex-grow">
                    <p className={`text-sm leading-none ${notification.is_read ? 'font-normal' : 'font-medium'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTimestamp(notification.created_at)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete notification</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

