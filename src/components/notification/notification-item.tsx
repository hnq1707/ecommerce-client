/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import type React from 'react';

import { useState } from 'react';
import { Check, MoreVertical, Trash2, Archive } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Notification, NotificationType } from '@/lib/type/Notification';
import { Avatar } from '@/components/ui/avatar';

// Icons for different notification types
const NotificationIcons: Record<NotificationType, React.ReactNode> = {
  SYSTEM: (
    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ),
  ORDER: (
    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </div>
  ),
  PAYMENT: (
    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
      <svg
        className="h-5 w-5 text-purple-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ),
  USER: (
    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
      <svg
        className="h-5 w-5 text-yellow-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  ),
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => Promise<void> | void;
  onDelete?: (notificationId: string) => Promise<void> | void;
  onArchive?: (notificationId: string) => Promise<void> | void;
  onRestore?: (notificationId: string) => Promise<void> | void;
  showActions?: boolean;
  isInTrash?: boolean;
  isArchived?: boolean;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onArchive,
  onRestore,
  showActions = false,
  isInTrash = false,
  isArchived = false,
}: NotificationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }

    // Handle navigation if the notification has a link
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    if (onDelete) {
      const result = onDelete(notification.id);
      if (result instanceof Promise) {
        result.finally(() => setIsDeleting(false));
      } else {
        setIsDeleting(false);
      }
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead && onMarkAsRead(notification.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive && onArchive(notification.id);
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore && onRestore(notification.id);
  };

  return (
    <div
      className={cn(
        'p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer',
        !notification.read && 'bg-primary/5',
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {notification.sender?.avatar ? (
          <Avatar className="h-10 w-10">
            <img
              src={notification.sender.avatar || '/placeholder.svg'}
              alt={notification.sender.name || 'Sender'}
            />
          </Avatar>
        ) : (
          NotificationIcons[notification.type]
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className={cn('text-sm font-medium', !notification.read && 'text-primary')}>
              {notification.title}
            </div>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {(new Date(notification.createdAt)).toLocaleString()}
              </span>

              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {!notification.read && !isInTrash && !isArchived && (
                      <DropdownMenuItem onClick={handleMarkAsRead}>
                        <Check className="h-4 w-4 mr-2" />
                        Mark as read
                      </DropdownMenuItem>
                    )}
                    {!isArchived && !isInTrash && (
                      <DropdownMenuItem onClick={handleArchive}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    )}
                    {isInTrash && (
                      <DropdownMenuItem onClick={handleRestore}>Restore</DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
        </div>
      </div>
    </div>
  );
}
