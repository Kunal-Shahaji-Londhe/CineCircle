'use client'

/**
 * NotificationBell Component
 * 
 * A notification bell icon component for displaying user notifications.
 * 
 * TODO: Implement real notification fetching from backend once notifications
 * are implemented in apps/api.
 */

import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export default function NotificationBell() {
  const [notificationCount, setNotificationCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  // TODO: Replace with real notification fetching
  useEffect(() => {
    // Mock: For now, no notifications
    setNotificationCount(0)
    setNotifications([])
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <div className="font-semibold text-sm">Notifications</div>
          {notifications.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-2 rounded-md hover:bg-accent cursor-pointer"
                >
                  <div className="text-sm">{notification.message}</div>
                  <div className="text-xs text-muted-foreground">
                    {notification.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

