"use client"

import * as React from "react"
import { NotificationList } from "@/shared/NotificationList"
import { UserNav } from "@/shared/UserNav"
import { useNotificationStore } from "@/store/notificationStore"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { ChevronLeft, Home, PanelLeft, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useSidebar } from "@/contexts/sidebar-context"

interface TopBarProps {
  title: string
  description?: string
  showBackButton?: boolean
  avatarSrc?: string
  avatarFallback?: string
  className?: string
}

export default function TopBar({
  title,
  description,
  showBackButton = false,
  avatarSrc,
  avatarFallback = "U",
  className = "",
}: TopBarProps) {
  const { notifications, fetchNotifications, markAllAsRead, markAsRead, deleteNotification } = useNotificationStore()
  const { sidebarOpen, toggleSidebar } = useSidebar()

  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  React.useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/auth/login")
    } catch (error) {
      // console.error('Logout failed:', error);
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        " ",
        className,
      )}
    >
      <div className="h-16 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full h-8 w-8 hover:bg-muted transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>

          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full h-8 w-8 hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHome}
              className="rounded-full h-8 w-8 hover:bg-muted transition-colors md:hidden"
              aria-label="Go to home"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-semibold tracking-tight leading-none">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block h-8 w-px bg-border/50 mx-1"></div>
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onRemove={deleteNotification}
          />
          <UserNav avatarSrc={avatarSrc} avatarFallback={avatarFallback} onLogout={handleLogout} />
        </div>
      </div>
    </motion.div>
  )
}

