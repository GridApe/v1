import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimestamp } from "@/utils/utils";
import { Notification } from "@/types/interface";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: () => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
}: NotificationDropdownProps) {
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
            size="sm"
            onClick={onMarkAsRead}
            className="text-xs"
          >
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No new notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                </DropdownMenuItem>
              </React.Fragment>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
