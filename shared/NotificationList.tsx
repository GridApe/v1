import { Bell, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  isRead: boolean
}

interface NotificationsListProps {
  notifications: Notification[]
  onMarkAllAsRead: () => void
}

export function NotificationsList({ notifications, onMarkAllAsRead }: NotificationsListProps) {
  return (
    <Card className="w-[380px] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
          <CardDescription>You have {notifications.filter(n => !n.isRead).length} unread messages</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMarkAllAsRead}
          className="text-xs"
        >
          <Check className="mr-1 h-4 w-4" />
          Mark all as read
        </Button>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 ${
              notification.isRead ? 'opacity-60' : ''
            }`}
          >
            <span className={`flex h-2 w-2 translate-y-1.5 rounded-full ${
              notification.isRead ? 'bg-muted' : 'bg-primary'
            }`} />
            <div className="space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-center border-t pt-3">
        <Button variant="link" className="text-xs">View all notifications</Button>
      </CardFooter>
    </Card>
  )
}

